import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function InputTile({ num, row, column, changeNum }) {
  return (
      <TextInput
        style = { styles.input }
        value = { num }
        onChangeText = { num => changeNum(num, row, column) }
        keyboardType = "numeric"
      />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: "11%",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: "blue"
  },
});