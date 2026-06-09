import {Modal, Pressable, Text, View, StyleSheet, Dimensions} from "react-native";
import CardSwiper, {WordEntry} from "./components/CardSwiper";
import React, {useEffect, useState} from "react";
import {useAppStore} from "@/app/store/useAppStore";
import {useDailyStore} from "@/app/store/useDailyStore";
import {router} from "expo-router";
import {Check, X} from "lucide-react-native";

export default function Daily() {
    const [word, setWord] = useState<WordEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const appStore = useAppStore();
	const markCompleted = useDailyStore(
		(state) => state.markCompleted
	);

	const isCompleted = useDailyStore(
		(state) => state.isCompleted
	);

	const completedCorrectly = useDailyStore(
		(state) => state.completedCorrectly
	);

	const dailyWord = word[0];

    const screenWidth = Dimensions.get("window").width;
	const screenHeight = Dimensions.get("window").height;

    const getWords = async () => {
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/dailyWord`
            );
			const data = await response.json();
			setWord([data]);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
		setModalOpen(false);
        appStore.reset();
        getWords();
    }, []);

	if (
		!isLoading &&
		dailyWord?.id &&
		isCompleted(dailyWord.id)
	) {
		return (
			<View style={styles.completedContainer}>
				<Text style={styles.completedTitle}>
					You already guessed it today
				</Text>

				<Text style={styles.completedDescription}>
					{completedCorrectly
						? "Come back tomorrow for another word."
						: "Better luck tomorrow."}
				</Text>

				<Pressable
					style={styles.completedButton}
					onPress={() => router.push("/")}
				>
					<Text style={styles.completedButtonText}>
						Return Home
					</Text>
				</Pressable>
			</View>
		);
	}

    return (
		<View style={{
			width: screenWidth,
			height: screenHeight,
			overflow: "hidden",
		}}>
			{isLoading ? <Text>Loading...</Text> : <CardSwiper words={word} setIsOpen={setModalOpen} currentIndex={0} onSwipe={() => {
			}}/>}
			<Modal
				animationType="fade"
				transparent={true}
				backdropColor={"#000000"}
				pointerEvents={"auto"}
				visible={modalOpen}
				onRequestClose={() => {
					setTimeout(() => {
						setModalOpen(false);
					}, 600);

					if (dailyWord?.id) {
						markCompleted(
							dailyWord.id,
							appStore.correctGuesses > 0
						);

						console.log(
							"useDailyStore state:",
							useDailyStore.getState()
						);
					}

					router.push("/");
				}}
			>
				<View style={[styles.centeredView]}>
					<View
						style={[
							styles.modalView,
							{
								width: screenWidth > 768 ? 450 : "90%",
								gap: 24,
							},
						]}
					>
						<View
							style={[
								styles.modalDrop,
								{ opacity: modalOpen ? 0 : 1 },
							]}
						/>

						{appStore.correctGuesses > 0 ? (
							<View style={styles.modalScore}>
								<Text style={styles.scoreTitle}>
									You did it!
								</Text>

								<View style={styles.scoreRingContainer}>
									<View style={styles.scoreRing}>
										<Check
											color={"#1e9e23"}
											size={64}
										/>
									</View>

									<Text style={styles.scoreDescription}>
										Correct!
									</Text>
								</View>

								<Text style={{ fontSize: 18 }}>
									Great job! You guessed it right!
								</Text>
							</View>
						) : (
							<View style={styles.modalScore}>
								<Text style={styles.scoreTitle}>
									Better luck next time!
								</Text>

								<View style={styles.scoreRingContainer}>
									<View
										style={[
											styles.scoreRing,
											{
												borderColor: "#EF5350",
											},
										]}
									>
										<X
											color={"#ef5350"}
											size={64}
										/>
									</View>

									<Text
										style={[
											styles.scoreDescription,
											{
												color: "#ef5350",
											},
										]}
									>
										Wrong!
									</Text>
								</View>

								<Text style={{ fontSize: 18 }}>
									Better luck tomorrow!
								</Text>
							</View>
						)}

						<View style={styles.exitButtonContainer}>
							<Pressable
								style={styles.exitButton}
								onPress={() => {
									if (dailyWord?.id) {
										markCompleted(
											dailyWord.id,
											appStore.correctGuesses > 0
										);
									}

									setModalOpen(false);
									router.push("/");
								}}
							>
								<Text
									style={{
										color: "#ffffff",
										fontSize: 16,
									}}
								>
									Return to landing
								</Text>
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
		display: "flex",
		justifyContent: 'center',
		height: "auto",
		alignItems: 'center',
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
	modalScore: {
		display: "flex",
		width: "100%",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 24,
	},
	scoreTitle: {
		fontSize: 24,
		textAlign: "center",
		fontWeight: "bold",
		color: "#333",
	},
	scoreRingContainer:{
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	scoreRing:{
		width: 120,
		height: 120,
		borderRadius: "100%",
		borderColor: "#1e9e23",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: 8,
		borderWidth: 8,
	},
	scoreRingMark:{
		fontSize: 84,
		color: "#1e9e23"
	},
	scoreDescription: {
		fontSize: 24,
		textAlign: "center",
		color: "#1e9e23",
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
		padding: 12,
		width: 180
	},
	completedContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
		gap: 20,
	},

	completedTitle: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
	},

	completedDescription: {
		fontSize: 18,
		textAlign: "center",
		color: "#666",
		maxWidth: 400,
	},

	completedButton: {
		backgroundColor: "#42a5f5",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 12,
	},

	completedButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
})

