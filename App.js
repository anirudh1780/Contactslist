/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import ContactList from './src/screens/ContactList';
import ApiTestScreen from './src/screens/ApiTestScreen';
import MapsScreen from './src/screens/MapsScreen';

import {enableLatestRenderer} from 'react-native-maps';

enableLatestRenderer();


const App = () => {
	return (
		<ContactList/>
		//<ApiTestScreen/>
		//<MapsScreen/>
	);
};

export default App;
