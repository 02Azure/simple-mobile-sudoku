import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import InputTile from "./components/inputTile"

export default function App() {
  let inputTiles = []
  let boardSize = 9 * 9

  for(let n = 0; n < boardSize; n++) {
    inputTiles.push(
      <InputTile
        key = { n.toString() }
        horizontalOrder = { (n + 1) % 3 }
        verticalOrder = { Math.ceil((n + 1) / 9 )}
      />
    )
  }

  return (
    <View style={ styles.appContainer } >
      <Text style={ styles.mainTitle } >Sudoku</Text>

      <View  style={ styles.tilesContainer }>
        { inputTiles }
      </View>

      <Button
        title = "Submit"
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
    justifyContent: "space-around",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginVertical: 30
  },
});