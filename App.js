import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import InputTile from "./components/InputTile"

export default function App() {
  const [board, setBoard] = useState([])

  let inputTiles = []
  let boardSize = 9

  useEffect(() => {
    fetch("https://sugoku.herokuapp.com/board?difficulty=easy")
      .then(response => response.json())
      .then(data => setBoard(data.board))
  }, [])

  function changeNum(num, row, column){
    let newBoard = [...board]
    newBoard[row][column] = num

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
      .then(data => console.log(data))
  }

  function showSolution() {
    fetch("https://sugoku.herokuapp.com/solve", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeParams({board})
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
      inputTiles.push(
        <InputTile 
          row = { n }
          column = { m }
          num = { board[n] ? board[n][m] : 0 }
          key = {`n${n}m${m}`} 
          changeNum = { changeNum }
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

      <Button
        title = "Submit"
        onPress = { checkSolution }
      />

      <Button
        title = "Show Solution"
        onPress = { showSolution }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },

  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginVertical: 30
  },
});