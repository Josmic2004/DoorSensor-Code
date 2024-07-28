import { StatusBar } from 'expo-status-bar';
import React from 'react';
import LoginScreen from './src/Screens/LoginScreen';
import ControlScreen from './src/Screens/ControlScreen';
import SignUp from './src/Screens/SignUp';
import GestordataScreen from './src/Screens/GestordataScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={ControlScreen} />
        <Stack.Screen name="Register" component={SignUp} />
        <Stack.Screen name="GestorData" component={GestordataScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
