/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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
} from 'react-native';
import Svg, {
	Circle,
	Ellipse,
	G,
	TSpan,
	TextPath,
	Path,
	Polygon,
	Polyline,
	Line,
	Rect,
	Use,
	Symbol,
	Defs,
	LinearGradient,
	RadialGradient,
	Stop,
	ClipPath,
	Pattern,
	Mask
} from 'react-native-svg';
import Contacts from 'react-native-contacts';
import Contact from './Contact';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

const App = () => {
	const availableFirstLetters = useRef(new Set([]));
	const contactListRef = useRef();

	const [contacts, setContacts] = useState([]);
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
			{
				'title': 'Contacts',
				'message': 'This app would like to view your contacts.',
				'buttonPositive': 'Please accept bare mortal'
			}
		)
			.then(Contacts.getAll()
				.then((newContacts) => {
					// work with contacts
					let filteredContacts = newContacts.filter((contact) => contact.phoneNumbers[0]?.number.includes("+65"));

					filteredContacts.forEach((contact) => {
						if (contact.displayName) {
							availableFirstLetters.current.add(contact.displayName[0])
						}
					});
					
					const alpha = Array.from(Array(26)).map((e, i) => i + 65);
					const alphabets = alpha.map((x) => String.fromCharCode(x));
					const availableFirstLettersArray = Array.from(availableFirstLetters.current);

					filteredContacts.push(...alphabets)
					// alphabets.forEach((alphabet) => {
					// 	const isLetterAvailable = availableFirstLettersArray.includes(alphabet);
					// 	if(isLetterAvailable) {
					// 		filteredContacts.push(alphabet);
					// 	}
					// })

					filteredContacts.sort((a, b) => {
						const displayNameA = a.displayName || a;
						const displayNameB = b.displayName || b;
						if (displayNameA > displayNameB) {
							return 1;
						}
						if (displayNameA <= displayNameB) {
							return -1;
						}
					});

					if (searchText.length >= 1) {
						filteredContacts = filteredContacts.filter(contact => contact.displayName?.toLowerCase().includes(searchText.toLowerCase()));
					}

					setContacts(filteredContacts);
				})
				.catch((e) => {
					console.log(e)
				}))
	}, [searchText]);

	const keyExtractor = (item, idx) => {
		return Math.random();
	};

	const renderContactItem = ({ item, index }) => {
		if (item.phoneNumbers) {
			return <Contact displayName={item.displayName} phoneNumber={item.phoneNumbers[0]} index={index} type="contact" />;
		} else {
			return <Contact displayName={item} index={index} type="alphabet" />
		}
	};

	function renderFirstLetterItem({ item }) {
		const alphabet = String.fromCharCode(item);
		const availableFirstLettersArray = Array.from(availableFirstLetters.current);
		const isLetterAvailable = availableFirstLettersArray.includes(alphabet);
		return <FirstLetterItem alphabet={alphabet} isLetterAvailable={isLetterAvailable} scrollToAlphabet={scrollToAlphabet} />
	}

	function scrollToAlphabet(alphabet) {
		const index = contacts.findIndex(contact => contact == alphabet);
		contactListRef.current.scrollToIndex({ animated: true, index: index });
	}

	return (
		<SafeAreaView>
			<View className="bg-[#020003] h-full py-2">
				<View className="bg-[#171317]">
					<View className="flex justify-center h-10 w-full items-center border-b-[#9A9B9C] py-2">
						<Text className="font-bold text-lg text-white">Contacts</Text>
					</View>
					<View className="p-4 h-15">
						<View className="rounded-2xl bg-[#2D2B30] flex flex-row h-[40px] items-center justify-start pl-2">
							<Svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								width={16}
								height={16}
								fill="#716E72"
							>
								<Path d="M23.707 22.293l-5.969-5.969a10.016 10.016 0 10-1.414 1.414l5.969 5.969a1 1 0 001.414-1.414zM10 18a8 8 0 118-8 8.009 8.009 0 01-8 8z" />
							</Svg>
							<TextInput
								className="text-[#716E72] text-[16px]"
								placeholder='Search'
								placeholderTextColor={"#716E72"}
								onChangeText={setSearchText}
							/>
						</View>
					</View>
				</View>
				<View className="flex flex-row mb-[100px] ">
					<FlatList
						ref={contactListRef}
						data={contacts}
						renderItem={renderContactItem}
						keyExtractor={keyExtractor}
						showsVerticalScrollIndicator={false}
						className="w-[95%]"
					/>
					<FlatList
						data={Array.from(Array(26)).map((e, i) => i + 65)}
						renderItem={renderFirstLetterItem}
						keyExtractor={keyExtractor}
						className="h-full mt-10 mx-1"
						contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

function FirstLetterItem({ alphabet, isLetterAvailable, scrollToAlphabet }) {
	const [isFocused, setIsFocused] = useState(false);

	function handlePress() {
		if (!isLetterAvailable) return;


		setIsFocused(true);
		scrollToAlphabet(alphabet);
	}


	return <Pressable onPress={handlePress}
		onPressOut={() => setIsFocused(false)}
		className="my-[1px] h-[15px] flex items-center justify-center">
		{
			isLetterAvailable ?
				<Text className="text-blue-500 font-semibold text-xs">
					{alphabet}
				</Text>
				:
				<View className="h-2 w-2 my-[1px] rounded-full bg-blue-500"></View>
		}
	</Pressable>
}

export default App;
