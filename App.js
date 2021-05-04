import React from 'react'
import { Provider } from "react-redux"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import GameScreen from "./views/Game"
import HomeScreen from "./views/Home"
import FinishScreen from "./views/Finish"
import store from "./store/"

const Stack = createStackNavigator()

export default function App() {
  return (
    <Provider store={ store }>
      <NavigationContainer>
        <Stack.Navigator screenOptions={ { headerShown: false }}>
          <Stack.Screen name="Home" component={ HomeScreen } />
          <Stack.Screen name="Game" component={ GameScreen } />
          <Stack.Screen name="Finish" component={ FinishScreen } />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}