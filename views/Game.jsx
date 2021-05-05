import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native'
import InputTile from "../components/InputTile"
import { setBoard, setInitialBoard, getPuzzle } from "../store/actions"
import deepCopy from "../helpers/deepCopy2DimArr"

export default function Game({ route, navigation }) {
  const dispatch = useDispatch()
  const { playerName, difficulty } = route.params

  const board = useSelector(state => state.board)
  const initialBoard = useSelector(state => state.initialBoard)

  const [loading, setLoading] = useState(true)
  const [countup, setCountup] = useState(0)

  const countupId = useRef(0) //karena state tidak terbaca di hook component will unmount

  let inputTiles = []
  let boardSize = 9

  useEffect(() => {
    dispatch(getPuzzle(difficulty))
      .then(response => response.json())
      .then(data => {
        dispatch(setInitialBoard(deepCopy(data.board)))
        dispatch(setBoard(data.board))
        setLoading(false)

        countupId.current = setInterval(() => {
          setCountup(prevCount => prevCount + 1)
        }, 1000)
      })
  }, [])

  useEffect(() => {
    return () => {
      clearInterval(countupId.current) //unsubscribe saat unmount
    }
  },[])

  function changeNum(num, row, column){
    if(!isNaN(+num)) { //cek kalau yg diinput bukan angka, abaikan
      let newBoard = [...board] //shallow copy array board
      newBoard[row] = [...newBoard[row]] //deep copy satu row yang mau dimutasi saja
      newBoard[row][column] = +num
  
      dispatch(setBoard(newBoard))
    }
  }

  function checkSolution() {
    fetch("https://sugoku.herokuapp.com/validate", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeParams({ board })
    })
      .then(response => response.json())
      .then(data => {
        if(data.status === "solved") {
          clearTimeout(countupId)
          navigation.replace("Finish", { playerName, countup, difficulty })

        } else {
          Alert.alert(
            "Whoops...",
            "Sorry, your board is still incorrect...",
            [
              {
                text: "OK",
                style: "cancel",
              },
            ],
            {
              cancelable: true
            }
          );
        }
      })
  }

  function showSolution() {
    fetch("https://sugoku.herokuapp.com/solve", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeParams({ board: initialBoard })
    })
      .then(response => response.json())
      .then(data => { 
        dispatch(setBoard(data.solution))
      })
  }

  function resetBoard() {
    dispatch(setBoard(deepCopy(initialBoard)))
  }

  const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')

  const encodeParams = (params) => 
    Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');
  
  // ========== input tiles definition ==================
  for(let n = 0; n < boardSize; n++) {
    for(let m = 0; m < boardSize; m++) {
      let initial = false

      if(initialBoard[n] && initialBoard[n][m] !== 0) {
        initial = true
      }
      inputTiles.push(
        <InputTile 
          row = { n }
          column = { m }
          num = { board[n] ? board[n][m] : 0 }
          key = {`n${n}m${m}`} 
          changeNum = { changeNum }
          isInitial = { initial }
        />
      )
    }
  }
  // ============== timer display =====================
  let min, sec; //mengatur display yang timer yang ditampilkan dalam format mm:ss
  countup < 600 ? min = "0" + Math.floor(countup / 60) : min = Math.floor(countup / 60)
  countup % 60 < 10 ? sec = "0" + countup % 60 : sec = countup % 60		

  let screenStyling = [styles.pageScreen]

  if(Platform.OS === "android") screenStyling.push(styles.androidPadding)

  return (
    <View style={ screenStyling }>
      <Text style={ styles.mainTitle } >Sudoku</Text>
      { loading ? 
        <Text style={ styles.loadingText }>Generating puzzle board...</Text> 

        :

        <View style= { styles.puzzleContainer }>
          <Text style={ styles.countupTimer }>{ min + ":" + sec }</Text>

          <View style={ styles.tilesContainer }>
            { inputTiles }
          </View>

          <View style={ styles.buttonContainer }>
            <TouchableOpacity
              onPress = { checkSolution }
              style = { styles.customButton }
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress = { showSolution }
              style = { [styles.customButton, styles.greenButton] }
            >
              <Text style={ styles.buttonText }>Solution</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress = { resetBoard }
              style = { [styles.customButton, styles.redButton] }
            >
              <Text style={ styles.buttonText }>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  pageScreen: {
    alignItems: "center",
    paddingTop: 20,
    height: "100%",
    backgroundColor: "navajowhite"
  },

  androidPadding: {
    paddingTop: StatusBar.currentHeight + 20
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  },

  loadingText: {
    marginTop: 64,
    fontSize: 24
  },

  puzzleContainer: {
    alignItems: "center",
    height: "90%",
    justifyContent: "space-between",
    backgroundColor: "navajowhite"
  },

  countupTimer: {
    fontSize: 16,
    fontWeight: "bold"
  }, 

  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 20,
    width: 350
  },

  buttonContainer: {
    width: 350,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  customButton: {
    width: "26%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "dodgerblue",
    borderRadius: 6
  },

  buttonText: {
    color: "white",
    fontWeight: "bold"
  },

  greenButton: {
    backgroundColor: "forestgreen"
  },

  redButton: {
    backgroundColor: "crimson"
  }
})