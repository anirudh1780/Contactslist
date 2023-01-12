import React from 'react'
import { Button, View } from 'react-native';

export default function FirstScreen({navigation}) {
	function openContactList() {
		navigation.navigate('Contact')
	}

	function openAPITestScreen() {
		navigation.navigate('Apitest')
	}

	function openMapsScreen() {
		navigation.navigate('Maps')
	}
	return (
		<View className="flex flex-col items-center justify-around h-full gap-y-2">
			<Button title='Open ContactList' onPress={openContactList} />
			<Button title='Open Maps Screen' onPress={openMapsScreen} />
			<Button title='Open APITest Screen' onPress={openAPITestScreen} />
		</View>
	)
}
