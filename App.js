import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import InputTile from "./components/InputTile"

export default function App() {
  const [board, setBoard] = useState([])
  const [initialBoard, setInitialBoard] = useState([])

  let inputTiles = []
  let boardSize = 9

  useEffect(() => {
    fetch("https://sugoku.herokuapp.com/board?difficulty=easy")
      .then(response => response.json())
      .then(data => {
        let deepCopy = []

        for(let n = 0; n < data.board.length; n++) {
          let row = [...data.board[n]]
          deepCopy.push(row)
        }

        setInitialBoard(deepCopy)
        setBoard(data.board)
      })
  }, [])

  function changeNum(num, row, column){
    let newBoard = [...board]
    newBoard[row][column] = +num

    setBoard(newBoard)
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
          Alert.alert(
            "Correct!!",
            "Congratulations, you successfully beat this puzzle!",
            [
              {
                text: "OK",
                style: "default",
              },
            ],
            {
              cancelable: true
            }
          );

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
      body: encodeParams({board: initialBoard})
    })
      .then(response => response.json())
      .then(data => setBoard(data.solution))
  }

  const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')

  const encodeParams = (params) => 
    Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');
  
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

  return (
    <View style={ styles.appContainer } >
      <Text style={ styles.mainTitle } >Sudoku</Text>

      <View  style={ styles.tilesContainer }>
        { inputTiles }
      </View>

      <View  style={ styles.buttonContainer }>
        <TouchableOpacity
          onPress = { checkSolution }
          style = {styles.customButton}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress = { showSolution }
          style = {styles.customButton}
        >
          <Text style={styles.buttonText}>Show Solution</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    alignItems: "center",
    paddingTop: 40
  },

  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },

  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    width: 350,
    marginVertical: 30,
  },

  buttonContainer: {
    width: 350,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  customButton: {
    width: "40%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "dodgerblue",
    borderRadius: 6
  },

  buttonText: {
    color: "white"
  }

});