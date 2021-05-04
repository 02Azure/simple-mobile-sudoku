import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Record from "../components/HighScoreTile" 

export default function Finish({ route, navigation }) {
  const { playerName, countup, difficulty } = route.params
  const [hallOfFame, setHallOfFame] = useState([])
  const [isNewRecord, setIsNewRecord] = useState(false)
  
  useEffect(() => {
    getHallOfFame(difficulty)
  }, [])

  const getHallOfFame = async (difficulty) => {
    let newData = { player: playerName, time: countup }

    try {
      let recordData = await AsyncStorage.getItem(difficulty)

      if(recordData) {
        recordData = JSON.parse(recordData)

        let indexHighest
        let highestTime = 0
        
        recordData.forEach((record, i)=> {
          if(record.time > highestTime) {
            highestTime = record.time
            indexHighest = i
          }
        })

        if(recordData.length < 5) {
          recordData.push(newData)
          await AsyncStorage.setItem(difficulty, JSON.stringify(recordData))
          setIsNewRecord(true)

        } else if ( newData.time < highestTime ) {
          recordData[indexHighest] = newData
          await AsyncStorage.setItem(difficulty, JSON.stringify(recordData))
          setIsNewRecord(true)

        } 
        setHallOfFame(recordData)
        console.log(recordData)

      } else {
        await AsyncStorage.setItem(difficulty, JSON.stringify([newData])) 
        setHallOfFame([newData])
        setIsNewRecord(true)
      }

    } catch(error) {
      console.log(error)
    }
  }

  let recordList = hallOfFame.map((record, i) => {
    return(
      <Record
        { ...record }
        key = { i }
      />
    )
  })
  
  return (
    <View style={ styles.pageScreen }>
      <Text style={ styles.mainTitle }>Correct!!</Text>

      <View style={ styles.centerContainer }>
        <View style={ styles.imageAndMessageContainer }>
          <Image
            style = { styles.finishImage }
            source= { require("../assets/pepe-yay.png") }
            resizeMode = "contain"
          />
          <Text style={ styles.subText }>Congratulations { playerName }!</Text> 
          <Text style={ styles.subText }>You masterfully beat this puzzle in { countup } second!</Text> 
          { isNewRecord && <Text style={ styles.subText }>You got a new high score!</Text>}
        </View>

        <View style={ styles.hallOfFameBox }>
          <Text style={ styles.secondaryMainTitle }>{ difficulty[0].toUpperCase() + difficulty.slice(1) } mode Hall of Fame  </Text> 
          <View style={ styles.hallOfFameContainer }>
            { recordList }
          </View>
        </View>
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
    paddingVertical: 30,
    height: "100%",
    justifyContent: "space-between",
    backgroundColor: "navajowhite"
  },

  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "75%",
    width: "100%"
  },

  imageAndMessageContainer: {
    width: "80%",
    alignItems: "center"
  },

  mainTitle: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },

  finishImage: {
    height: "50%"
  },

  hallOfFameBox: {
    width: "80%"
  },

  secondaryMainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
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