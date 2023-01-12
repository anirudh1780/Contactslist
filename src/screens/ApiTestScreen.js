import React, { useState, useEffect, useRef } from 'react'
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
	PermissionsAndroid,
	FlatList,
	TextInput,
	Dimensions,
	Pressable,
	Button,
	Alert
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { apiKey, token } from "../config.js"

function ApiTestScreen() {
	const timeout = useRef(null);

	const [searchText, setSearchText] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [geoCodedLoc, setGeoCodedLoc] = useState("");


	function getGeoCode() {
		console.log(latitude, longitude);
		fetch(`https://developers.onemap.sg/privateapi/commonsvc/revgeocode?location=${latitude},${longitude}&token=${token}`)
			.then(res => res.json())
			.then((msg) => {})

				if (msg.error) {
					console.log(msg.error);
					Alert.alert(msg.error);
					return;
				}

				const GeocodeInfo = msg.GeocodeInfo;
				setGeoCodedLoc(GeocodeInfo[0].BUILDINGNAME);
			
	}

	function handleChangeText(value) {
		clearTimeout(timeout.current);
		setSearchText(value);
		timeout.current = setTimeout(() => {
			searchFunction(value)
		}, 2000);
	}

	function searchFunction(value) {
		fetch(`https://developers.onemap.sg/commonapi/search?searchVal=${searchText}&returnGeom=Y&getAddrDetails=Y&pageNum=1`)
			.then(res => res.json())
			.then(msg => {
				setSearchResults(msg.results)
			})
	}

	function renderItem({ item }) {
		return <View>
			<Text className="text-white">{item.ADDRESS}</Text>
			<Text className="text-white">{item.BUILDING}</Text>
		</View>
	}

	function testTheme() {


		fetch(`https://developers.onemap.sg/privateapi/themesvc/getAllThemesInfo?token=${token}&moreInfo=Y`)
			.then(res => res.json())
			.then((msg) => {
				console.log(msg)
			})
	}


	return (
		<SafeAreaView>
			<View className="bg-[#020003] h-full py-2 px-4">
				<View className="bg-[#171317]">
					<View className="flex justify-center h-10 w-full items-center border-b-[#9A9B9C] py-2">
						<Text className="text-lg font-bold text-white">API TEST SCREEN</Text>
					</View>
				</View>
				<View className="mb-[50px]">
					<TextInput
						onChangeText={setSearchText}
						className="px-2 my-2 bg-white rounded-2xl"
						placeholder='Seach location'
					/>
					<View className="my-2">
						<Button
							title="search function"
							onPress={searchFunction}
							color="#771fff"
						/>
					</View>
					{/* <View className="my-2">
						<Button
							title="Test theme"
							onPress={testTheme}
							color="#64ffdb"
						/>
					</View> */}
					<View className="my-2">
						<View className="flex flex-row items-center justify-start w-full gap-x-1">
							<TextInput
								onChangeText={setLatitude}
								className="w-1/3 px-2 my-2 text-black bg-white rounded-2xl"
								placeholder='Latitude'
								value={latitude}
							/>
							<TextInput
								onChangeText={setLongitude}
								className="w-1/3 px-2 my-2 text-black bg-white rounded-2xl"
								placeholder='Longitude'
								value={longitude}
							/>
						</View>
						<Text className="text-white">latitude: {latitude} longitude: {longitude}</Text>
						<Button
							title="get geo code"
							onPress={getGeoCode}
							color="#841584"
						/>
						<Button
							title="Sing coords"
							onPress={() => {
								setLatitude(1.2838)
								setLongitude(103.8591)
							}}
							color="#0f6547"
						/>
						<Button
							title="Current loc"
							onPress={() => {
								Geolocation.getCurrentPosition(info => {
									setLatitude(parseFloat(info.coords.latitude));
									setLongitude(parseFloat(info.coords.longitude))
								});
							}}
							color="098765"
						/>
					</View>
				</View>
				<Text className="text-white border-b-2 border-white">{geoCodedLoc}</Text>
				<Text className="text-white">Search results</Text>
				<FlatList
					data={searchResults}
					keyExtractor={(item, idx) => {
						return idx;
					}}
					renderItem={renderItem}
				/>
			</View>
		</SafeAreaView>
	)
}

export default ApiTestScreen