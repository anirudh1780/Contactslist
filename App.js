/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import ContactList from './src/screens/ContactList';
import MapsScreen from './src/screens/MapsScreen';

import {enableLatestRenderer} from 'react-native-maps';

enableLatestRenderer();


const App = () => {
	return (
		<ContactList/>
		//<MapsScreen/>
	);
};

export default App;
