import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Record from "../components/HighScoreTile" 

export default function Finish({ route, navigation }) {
  const { playerName, countup, difficulty, limit } = route.params
  const [hallOfFame, setHallOfFame] = useState([])
  const [isNewRecord, setIsNewRecord] = useState(false)
  
  useEffect(() => {
    getHallOfFame(difficulty)
  }, [])

  const getHallOfFame = async (difficulty) => {
    let newData = { player: playerName, time: countup }

    try {
      let recordData = await AsyncStorage.getItem(difficulty)

      if(newData.time < limit) { //jika dibawah timelimit
        if(recordData) { //jika record sudah ada
          recordData = JSON.parse(recordData)
  
          let indexHighest
          let highestTime = 0
          
          //cari record yg punya time tertinggi
          recordData.forEach((record, i)=> {
            if(record.time > highestTime) {
              highestTime = record.time
              indexHighest = i
            }
          })
  
          if(recordData.length < 5) { //jika record masih kurang dari 5
            recordData.push(newData) //langsung masukkan hasil baru
            await AsyncStorage.setItem(difficulty, JSON.stringify(recordData))
            setIsNewRecord(true)
  
          } else if ( newData.time < highestTime ) { // jika sudah 5, masukkan kalau data baru punya time lebih rendah
            recordData[indexHighest] = newData
            await AsyncStorage.setItem(difficulty, JSON.stringify(recordData))
            setIsNewRecord(true)
          } 
  
          setHallOfFame(recordData)
  
        } else { // jika belum ada record samsek, set data baru sebagai array kemudian masukkan ke storage
          await AsyncStorage.setItem(difficulty, JSON.stringify([newData])) 
          setHallOfFame([newData])
          setIsNewRecord(true)
        }
      }

      else { // jika diatas time limit, pasti tidak masuk halloffame
        setHallOfFame(recordData)
      }

    } catch(error) {
      console.log(error)
    }
  }

  let recordList = hallOfFame
    .map(record => record)
    .sort((a, b) => a.time - b.time)
    .map((record, i) => { 
    return(
      <Record
        { ...record }
        key = { i }
      />
    )
  })

  let screenStyling = [styles.pageScreen]

  if(Platform.OS === "android") screenStyling.push(styles.androidPadding)
  
  return (
    <View style={ screenStyling }>
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
    paddingVertical: 20,
    height: "100%",
    justifyContent: "space-between",
    backgroundColor: "navajowhite"
  },

  androidPadding: {
    paddingTop: StatusBar.currentHeight + 20
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

  subText: {
    textAlign: "center"
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