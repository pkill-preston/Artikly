import React, { useEffect, useState } from "react";
import {Dimensions, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import CardSwiper, { WordEntry } from "./components/CardSwiper";
import {useAppStore} from "@/app/store/useAppStore";
import {router, useLocalSearchParams} from "expo-router";
import {GaugeMeter} from "@/app/components/GaugeMeter";


export default function Challenge() {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleSwipe = () => {

		if (currentIndex < words.length - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			console.log("You've finished all cards!");
		}
	};

	const appStore = useAppStore();

	const { amount } = useLocalSearchParams() as unknown as { amount: number };
	const screenWidth = Dimensions.get("window").width;
	const percentage =
		appStore.totalGuesses === 0
			? 0
			: (appStore.correctGuesses / appStore.totalGuesses) * 100;

	appStore.totalGuesses = amount;

	const [words, setWords] = useState<WordEntry[]>([]);
	const [isLoading,setIsLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);

	const getWords = async () => {
		try {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_API_URL}/words?amount=${amount}`
			);
			const data = await response.json();
			setWords(data);
			setIsLoading(false);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		setModalOpen(false);
		getWords();
	}, []);

	if (words === null) {
		return <Text>Loading...</Text>;
	}

	return (
		<View>
			{isLoading ? <Text>Loading...</Text> : <CardSwiper words={words} currentIndex={0} setIsOpen={setModalOpen} onSwipe={handleSwipe}/>}
			<Modal
				animationType="fade"
				transparent={true}
				backdropColor={"#000000"}
				pointerEvents={"auto"}
				visible={modalOpen}
				onRequestClose={() => {
					setModalOpen(false);
				}}>
				<View style={[styles.centeredView]}>
					<View style={[styles.modalView, {
						width: screenWidth > 768 ? 450 : "90%",
						gap: 24,
					}]}>
						<View style={[styles.modalDrop,{opacity: modalOpen ? 0 : 1}]}></View>
						<View style={{width: "100%"}}>
							<View>
								<View style={styles.modalScore}>
									<Text style={[styles.scoreTitle,{fontSize: 24}]}>Accuracy </Text>
									<GaugeMeter value={Math.trunc(percentage)} max={100} ></GaugeMeter>
								</View>
							</View>
						</View>
						<View style={{width: "100%", display: "flex", flexDirection: "row",justifyContent: "space-between"}}>
							<View style={styles.modalScore}>
								<Text style={styles.scoreTitle}>Total Guesses </Text>
								<View style={[styles.scoreValueContainer, {backgroundColor: "#42A5F5"}]}>
									<Text style={styles.scoreValue}>{appStore.totalGuesses}</Text>
								</View>
							</View>
							<View style={styles.modalScore}>
								<Text style={styles.scoreTitle}>Correct guesses </Text>
								<View style={[styles.scoreValueContainer, {backgroundColor: "#4CAF50"}]}>
									<Text style={styles.scoreValue}>{appStore.correctGuesses}</Text>
								</View>
							</View>
							<View style={styles.modalScore}>
								<Text style={styles.scoreTitle}>Wrong guesses </Text>
								<View style={[styles.scoreValueContainer, {backgroundColor: "#EF5350"}]}>
									<Text style={styles.scoreValue}>{appStore.wrongGuesses}</Text>
								</View>
							</View>
						</View>
						<View style={styles.exitButtonContainer}>
							<Pressable style={styles.exitButton} onPress={() => {
								setModalOpen(false);
								router.push("/")
							}}>
								<Text style={{color:"#ffffff", fontSize: 16}}>Return to landing</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);

}

const styles = StyleSheet.create({
	centeredView: {
		position: 'relative',
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		flex: 1,
		justifyContent: 'center',
		height: "auto",
		alignItems: 'center',
	},
	modalDrop:{
		position: "absolute",
		zIndex: 99999,
		borderRadius: 20,
		pointerEvents: "none",
		backgroundColor: "#ffffff",
		width: "100%",
		height: "100%",
		left:0
	},
	modalView: {
		position: "relative",
		padding: 24,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		flexWrap: "wrap",
		height: "auto",
		gap: 8,
		backgroundColor: 'white',
		borderRadius: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalScore: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 10,
	},
	scoreTitle: {
		fontSize: 14,
		textAlign: "center",
		fontWeight: "bold",
		color: "#333",
	},
	scoreValueContainer: {
		backgroundColor: "#f0f0f0",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		width: 90,
		height: 90,
		padding: 12,
	},
	scoreValue: {
		fontSize: 36,
		fontWeight: "bold",
		color: "#ffffff",
		textAlign: "center",
	},
	exitButtonContainer:{
		width: "100%",
		display:"flex",
		justifyContent: "center",
		alignItems: "center",
	},
	exitButton:{
		borderRadius: 12,
		backgroundColor: "#42a5f5",
		display: "flex",
		justifyContent: "center",
		borderWidth: 0,
		alignItems: "center",
		padding: 8,
		width: 180
	}
})
