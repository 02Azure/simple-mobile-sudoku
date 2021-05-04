import React from 'react'
import { StyleSheet, TextInput } from 'react-native'

export default function InputTile({ num, row, column, changeNum, isInitial }) {
  let styling = [styles.input]
  
  if((row + 1) % 3 === 1) styling.push(styles.borderTop)
  if((column + 1) % 3 === 1) styling.push(styles.borderLeft)
  if(row === 0) styling.push(styles.firstRow)
  if(row === 8) styling.push(styles.lastRow)
  if(column === 0) styling.push(styles.firstCol)
  if(column === 8) styling.push(styles.lastCol)
  if(isInitial) styling.push(styles.initialNum)

  return (
    <TextInput
      style = { styling }
      value = { num !== 0 ? num.toString() : "" }
      onChangeText = { num => changeNum(num, row, column) }
      keyboardType = "numeric"
      maxLength = { 1 }
      selectTextOnFocus = { true }
      editable = { !isInitial }
    />
  )
}

const styles = StyleSheet.create({
  input: {
    height: 38,
    width: 38,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: "maroon",
    textAlign: "center",
    backgroundColor: "cornsilk",
    fontSize: 18
  },

  borderTop: {
    borderTopWidth: 3,
    borderTopColor: "maroon"
  },

  borderLeft: {
    borderLeftWidth: 3,
    borderLeftColor: "maroon"
  },

  firstRow: {
    borderTopWidth: 4
  },

  lastRow: {
    borderBottomWidth: 4,
    borderBottomColor: "maroon"
  },

  firstCol: {
    borderLeftWidth: 4
  },

  lastCol: {
    borderRightWidth: 4,
    borderRightColor: "maroon"
  },

  initialNum: {
    color: "black",
    fontWeight: "bold"
  }
})