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
	ToastAndroid
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

import Contact from '../components/Contact';

export default function ContactList() {
	const availableFirstLetters = useRef(new Set([]));
	const contactListRef = useRef();

	const [contacts, setContacts] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [topItem, setTopItem] = useState("A");

	useEffect(async () => {
		if (Platform.OS == "android") {
			const isPermissionGiven = await getPermission();
			console.log(isPermissionGiven);
			if (isPermissionGiven != "granted") return;
		}
		Contacts.getAll()
			.then((newContacts) => {
				let filteredContacts = [];
				newContacts.forEach((contact) => {
					if (contact.givenName && contact.phoneNumbers?.length > 0) {
						filteredContacts.push({
							givenName: contact.givenName,
							phoneNumber: contact?.phoneNumbers[0]?.number
						})
					}
				});


				filteredContacts = filteredContacts.filter((contact) => isSGContact(contact));

				filteredContacts.filter(contact => contact.givenName);

				filteredContacts.forEach((contact) => {
					if (contact.givenName) {
						availableFirstLetters.current.add(contact.givenName[0])
					}
				});

				const availableFirstLettersArray = Array.from(availableFirstLetters.current);

				availableFirstLettersArray.forEach((letter) => {
					filteredContacts.push(letter);
				})

				availableFirstLettersArray.sort((a, b) => {
					if (a > b) {
						return 1
					} else {
						return -1;
					}
				})

				availableFirstLetters.current = new Set(availableFirstLettersArray);


				filteredContacts.sort((a, b) => {
					const displayNameA = a.givenName || a;
					const displayNameB = b.givenName || b;
					if (displayNameA > displayNameB) {
						return 1;
					}
					if (displayNameA <= displayNameB) {
						return -1;
					}
				});

				if (searchText.length >= 1) {
					filteredContacts = filteredContacts.filter(contact => contact.givenName?.toLowerCase().includes(searchText.toLowerCase()));
				}

				setContacts(filteredContacts);
			})
			.catch((e) => {
				console.log(e)
			})
	}, [searchText]);

	async function getPermission() {
		return await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
			{
				'title': 'Contacts',
				'message': 'This app would like to view your contacts.',
				'buttonPositive': 'Please accept bare mortal'
			}
		)
	}

	function isSGContact(contact) {
		let phoneNumber = contact.phoneNumber
		let cleanedNumber = cleanContactNumber(phoneNumber)
		return phoneNumber.includes('+65') || (cleanedNumber.length == 8 && /^[689]/.test(cleanedNumber));
	}

	const cleanContactNumber = (number) => {
		return number.replace(/[^0-9]/g, '');
	}

	const keyExtractor = (item, idx) => {
		return idx;
	};

	const renderContactItem = ({ item, index }) => {
		if (item.phoneNumber) {
			return <Contact displayName={item.givenName} phoneNumber={item.phoneNumber} index={index} type="contact" />;
		} else {
			return <Contact displayName={item} index={index} type="alphabet" />
		}
	};

	function renderFirstLetterItem({ item }) {
		const availableFirstLettersArray = Array.from(availableFirstLetters.current);
		const isLetterAvailable = availableFirstLettersArray.includes(item);
		return <FirstLetterItem alphabet={item} isLetterAvailable={isLetterAvailable} scrollToAlphabet={scrollToAlphabet} />
	}

	function scrollToAlphabet(alphabet) {
		const index = contacts.findIndex(contact => contact == alphabet);
		contactListRef.current.scrollToIndex({ index: index, animated: false });
	}

	const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
		if (!viewableItems[0]) return;
		const firstVisibleItem = viewableItems[0].item;
		if (!firstVisibleItem.givenName) {
			setTopItem(firstVisibleItem);
		} else {
			setTopItem(firstVisibleItem.givenName[0])
		}
	}, []);

	const _viewabilityConfig = {
		itemVisiblePercentThreshold: 10
	}

	_getItemLayout = (data, index) => (
		{ length: 40, offset: 40 * index, index }
	)

	return (
		<SafeAreaView>
			<View className="bg-[#020003] h-full py-2">
				<View className="bg-[#171317]">
					<View className="flex justify-center h-10 w-full items-center border-b-[#9A9B9C] py-2">
						<Text className="text-lg font-bold text-white">Contacts</Text>
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
								className="text-[#716E72] text-[16px] w-full"
								placeholder='Search'
								placeholderTextColor={"#716E72"}
								onChangeText={setSearchText}
							/>
						</View>
					</View>
					<View className="border-[#2d252d] border-t-[1px]">
						<Text className="text-[#655365] font-semibold ml-4">{topItem}</Text>
					</View>
				</View>
				<View className="flex flex-row mb-[120px] h-[80%] justify-center items-center">
					<FlatList
						onViewableItemsChanged={_onViewableItemsChanged}
						viewabilityConfig={_viewabilityConfig}
						getItemLayout={_getItemLayout}
						ref={contactListRef}
						data={contacts}
						onScrollToIndexFailed={info => {
							const wait = new Promise(resolve => setTimeout(resolve, 500));
							wait.then(() => {
								contactListRef.current?.scrollToIndex({ index: info.index, animated: true });
							});
						}}
						renderItem={renderContactItem}
						keyExtractor={keyExtractor}
						showsVerticalScrollIndicator={false}
						className="w-[95%]"
					/>
					<FlatList
						data={Array.from(availableFirstLetters.current)}
						renderItem={renderFirstLetterItem}
						keyExtractor={keyExtractor}
						className="h-full mx-1 mt-10"
						contentContainerStyle={{ alignItems: "center" }}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}


function FirstLetterItem({ alphabet, isLetterAvailable, scrollToAlphabet }) {
	function handlePress() {
		if (!isLetterAvailable) return;
		scrollToAlphabet(alphabet);
	}


	return <Pressable onPress={handlePress}
		className="py-[2px] flex items-center justify-center">
		{
			isLetterAvailable ?
				<Text className="text-[12px] font-semibold text-blue-500">
					{alphabet}
				</Text>
				:
				<View className="w-2 h-2 my-[1px] bg-blue-500 rounded-full"></View>
		}
	</Pressable>
}