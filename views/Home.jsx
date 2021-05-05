import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Platform, StatusBar } from 'react-native'
import { Picker } from "@react-native-picker/picker"

export default function Home({ navigation }) {
  const [playerName, setPlayerName] = useState("Guess")
  const [difficulty, setDifficulty] = useState("easy")

  let screenStyling = [styles.pageScreen]

  if(Platform.OS === "android") screenStyling.push(styles.androidPadding)

  return (
    <View style={ screenStyling }>
      <Text style={ styles.mainTitle }>Sudoku</Text>

      <View style = { styles.formGroup }>
        <Text style={ styles.label }>Enter your player's name:</Text>
        <TextInput
          style = { styles.input }
          value = { playerName }
          onChangeText = { text => setPlayerName(text) }
          maxLength = { 15 }
        />
      </View>

      <View style = { styles.formGroup }>
        <Text style={ styles.label } >Select puzzle's difficulty:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style = { styles.selectInput }
            itemStyle = { styles.optionItem }
            selectedValue = { difficulty }
            onValueChange = { newDifficulty => setDifficulty(newDifficulty) }
          >
            <Picker.Item label="Easy" value="easy" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Hard" value="hard" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style = {styles.customButton}
        onPress = { () => navigation.replace("Game", { playerName: playerName || "Guess", difficulty }) }
      >
        <Text style={styles.buttonText}>Start!</Text>
      </TouchableOpacity>     
    </View>
  )
}

const styles = StyleSheet.create({
  pageScreen: {
    alignItems: "center",
    height: "100%",
    paddingVertical: 20,
    justifyContent: "space-between",
    backgroundColor: "navajowhite"
  },

  androidPadding: {
    paddingTop: StatusBar.currentHeight + 20
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  label: {
    marginTop: 32,
    fontSize: 16,
  },
  
  input: {
    height: 38,
    width: "80%",
    borderWidth: 2,
    paddingHorizontal: 10,
    borderColor: "maroon",
    textAlign: "center",
    backgroundColor: "cornsilk",
    fontSize: 18,
    marginTop: 16
  },

  selectInput: {
    height: 38,
    fontSize: 18,
    width: "100%",
    backgroundColor: "cornsilk",
    textAlign: "center",
    color: "black"
  },

  pickerContainer: {
    marginTop: 18,
    height: 42,
    width: "80%",
    borderWidth: 2,
    borderColor: "maroon",
  },

  customButton: {
    marginTop: 38,
    width: "80%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "forestgreen",
    borderRadius: 6
  },

  buttonText: {
    color: "white",
    fontWeight: "bold"
  },

  formGroup: {
    alignItems: "center",
    width: "100%"
  }
})