import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function InputTile(props) {
  const [num, onChangeNum] = useState(0)

  return (

      <TextInput
        style = { props.horizontalOrder === 1 ? styles.input1 : styles.input}
        onChangeText = { onChangeNum }
        value = { num }
        keyboardType = "numeric"
      />
  );
}

const styles = StyleSheet.create({
  input1: {
    height: 40,
    width: "11%",
    borderWidth: 1,
    borderLeftWidth: 3,
    paddingHorizontal: 10,
    borderColor: "blue"
  },

  input: {
    height: 40,
    width: "11%",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: "blue"
  },
});