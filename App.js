// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ContactList from './src/screens/ContactList';
import ApiTestScreen from './src/screens/ApiTestScreen';
import MapsScreen from './src/screens/MapsScreen';
import FirstScreen from './src/screens/FirstScreen'

import {enableLatestRenderer} from 'react-native-maps';

enableLatestRenderer();

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="First">
	  	<Stack.Screen name="First" component={FirstScreen} />
        <Stack.Screen name="Contact" component={ContactList}/>
		<Stack.Screen name="Apitest" component={ApiTestScreen} />
		<Stack.Screen name="Maps" component={MapsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;