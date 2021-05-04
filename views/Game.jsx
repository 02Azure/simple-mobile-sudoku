import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import InputTile from "../components/InputTile"
import deepCopy from "../helpers/deepCopy2DimArr"

export default function Game({ route, navigation }) {
  const { playerName, difficulty } = route.params

  const [board, setBoard] = useState([])
  const [initialBoard, setInitialBoard] = useState([])
  const [loading, setLoading] = useState(true)
  const [countup, setCountup] = useState(0)

  let inputTiles = []
  let boardSize = 9

  useEffect(() => {
    fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
      .then(response => response.json())
      .then(data => {
        setInitialBoard(deepCopy(data.board))
        setBoard(data.board)
        setLoading(false)

        setTimeout(() => {
          setCountup(countup + 1)
        }, 1000)

      })
  }, [])

  useEffect(() => {
    if(countup) {
      setTimeout(() => {
        setCountup(countup + 1)
      }, 1000)
    }
  }, [countup])

  function changeNum(num, row, column){
    if(!isNaN(+num)) { //cek kalau yg diinput bukan angka, abaikan
      let newBoard = [...board] //shallow copy array board
      newBoard[row] = [...newBoard[row]] //deep copy satu row yang mau dimutasi saja
      newBoard[row][column] = +num
  
      setBoard(newBoard)
    }
  }

  function checkSolution() {
    fetch("https://sugoku.herokuapp.com/validate", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeParams({board})
    })
      .then(response => response.json())
      .then(data => {
        if(data.status === "solved") {
          navigation.replace("Finish", { playerName, countup })

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
      .then(data => setBoard(data.solution))
  }

  function resetBoard() {
    setBoard(deepCopy(initialBoard))
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

  return (
    <View style={ styles.pageScreen }>
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
    paddingTop: 30,
    height: "100%",
    backgroundColor: "navajowhite"
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