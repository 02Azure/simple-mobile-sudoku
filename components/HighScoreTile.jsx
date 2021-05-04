import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Record({ player, time }) {
  return (
    <View style={ styles.recordContainer }>
      <Text style = { styles.record }> { player }: </Text>
      <Text style = { styles.record }> { time }s </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  recordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"    
  },

  record: {
    fontSize: 16,
    fontWeight: "bold"
  },
})