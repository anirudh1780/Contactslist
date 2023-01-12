import React, { useState, useEffect, useRef, useCallback } from 'react';
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
	Platform,
	Alert
} from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { apiKey, token } from "../config.js"

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	map: {
		...StyleSheet.absoluteFillObject,
		zIndex: -1,
		marginTop: 100,
		margin: 10
	},
});

const initialRegion = {
	latitude: 1.2938,
	longitude: 103.8591
}

export default () => {
	const timeout = useRef(null);
	const markerRef = useRef(null);

	const [latLng, setLatLng] = useState(initialRegion)
	const [locationName, setLocationName] = useState("Loading...");
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		reverseGeoCode();
	}, [latLng]);


	function handleChangeText(value) {
		clearTimeout(timeout.current);
		setSearchText(value);
		timeout.current = setTimeout(() => {
			searchFunction(value)
		}, 2000);
	}

	function searchFunction(value) {
		console.log("Searching for ", value);
		fetch(`https://developers.onemap.sg/commonapi/search?searchVal=${value}&returnGeom=Y&getAddrDetails=Y&pageNum=1`)
			.then(res => res.json())
			.then(msg => {
				if (msg.results.length > 0) {
					const requiredLoc = msg.results[0];
					setLatLng({
						latitude: parseFloat(requiredLoc.LATITUDE),
						longitude: parseFloat(requiredLoc.LONGITUDE)
					})
					setLocationName(requiredLoc.BUILDING)
				} else {
					Alert.alert(" No place found with name ", value)
					setSearchText("");
				}
			})
	}

	function handleMarkerDragEnd(e) {
		const requiredCoord = e.nativeEvent.coordinate;
		setLatLng({
			latitude: requiredCoord.latitude,
			longitude: requiredCoord.longitude
		})
	}

	function reverseGeoCode() {
		fetch(`https://developers.onemap.sg/privateapi/commonsvc/revgeocode?location=${latLng.latitude},${latLng.longitude}&token=${token}`)
			.then(res => res.json())
			.then((msg) => {

				if (msg.error) {
					console.log(msg.error);
					Alert.alert(msg.error);
					return;
				}

				const GeocodeInfo = msg.GeocodeInfo;


				let newLocation = null;
				let i = 0;
				while(!newLocation || i < GeocodeInfo.length) {
					newLocation = GeocodeInfo[i].BUILDINGNAME;
					if(!newLocation) {
						newLocation = GeocodeInfo[i].ROAD;
					}
					
					i++;
				}
				
				if(!newLocation) {
					newLocation == "Loading...";
				}

				setLocationName(newLocation);
			})

	}


	return <View style={styles.container}>
		<TextInput
			className="absolute z-[99] w-[300px] h-[50px] top-5 bg-slate-300 border border-slate-500 rounded-2xl px-4"
			placeholder='Type to search'
			onChangeText={handleChangeText}
			value={searchText}
		/>
		<Text className="absolute top-[75px]">Searching for {locationName}</Text>

		<MapView
			style={styles.map}
			region={{
				latitude: latLng.latitude,
				longitude: latLng.longitude,
				latitudeDelta: 0.015,
				longitudeDelta: 0.0121,
			}}
		>
			<Marker
				ref={markerRef}
				title={searchText}
				draggable
				centerOffset={{ x: -18, y: -60 }}
				anchor={{ x: 0.69, y: 1 }}
				onDragEnd={handleMarkerDragEnd}
				coordinate={{
					latitude: latLng.latitude,
					longitude: latLng.longitude,
					latitudeDelta: 0.015,
					longitudeDelta: 0.0121,
				}}
			/>
		</MapView>
	</View>
}