import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'

export default function Finish({ route, navigation }) {
  const { playerName } = route.params

  return (
    <View style={ styles.pageScreen }>
      <Text style={ styles.mainTitle }>Correct!!</Text>

      <View style={ styles.centerContainer }>
        <Image
          style = { styles.finishImage }
          source= { require("../assets/pepe-yay.png") }
          resizeMode = "contain"
        />
        <Text style={ styles.subText }>Congratulations { playerName }!</Text> 
        <Text style={ styles.subText }>You masterfully beat this puzzle!</Text> 
      </View>

      <TouchableOpacity
        style = { styles.customButton }
        onPress = { () => navigation.replace("Home") }
      >
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  pageScreen: {
    alignItems: "center",
    paddingVertical: 20,
    height: "100%",
    justifyContent: "space-between",
    backgroundColor: "navajowhite"
  },

  centerContainer: {
    alignItems: "center",
    justifyContent: "center"
  },

  mainTitle: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },

  finishImage: {
    height: "60%"
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
  }
})