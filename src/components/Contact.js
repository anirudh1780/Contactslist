import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';


const Contact = (props) => {

	function showPhoneNumber() {
		if(props.phoneNumber) {
			console.log(props.phoneNumber);
			Alert.alert(props.phoneNumber)
		}
	}

	return (
		<Pressable onPress={showPhoneNumber} className={(props.type == "alphabet" ? "justify-end" : "justify-center") + " h-[40px] w-full flex items-start pl-4 border-b-[1px] border-[#141414]"}>
			{
				props.type == "alphabet" ? 
					<Text className="text-[#5c5c5c] font-semibold text-xs">{props.displayName}</Text>
				:
					<Text className="font-semibold text-white">{props.displayName}</Text>
			}
		</Pressable>
	);
};


export default Contact;