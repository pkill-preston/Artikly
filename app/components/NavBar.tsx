import { StyleSheet, Text, View } from "react-native";
import Badge from "./Badge";
import { useAppStore } from "@/app/store/useAppStore";

export default function NavBar() {
	const store = useAppStore();

	const percentage =
		store.totalGuesses === 0
			? 0
			: (store.guesses / store.totalGuesses) * 100;

	const styles = StyleSheet.create({
		parentContainer: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			width: "100%",
		},
		navbar: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
			maxWidth: 1024,
			paddingHorizontal: 8,
			paddingVertical: 16,
		},
		leftNavbarContainer: {
			display: "flex",
			flexDirection: "column",
			gap: 6
		},
		title: {
			fontSize: 18,
			textDecorationLine: "none",
			fontWeight: "800"
		},
		subtitle: {
			fontSize: 14,
			fontWeight: "400",
			color: "#a3a3a3"
		},
		streakProgress: {
			width: "100%",
			height: 10,
			backgroundColor: "#BDBDBD",
			position: "relative"
		},
		streakProgressBar: {
			height: 10,
			backgroundColor: "#f97316",
			position: "absolute",
			left: 0,
		}
	});

	return (
		<View style={styles.parentContainer}>
			<View style={styles.navbar}>
				<View style={styles.leftNavbarContainer}>
					<a style={{ textDecoration: "none" }} href="/">
						<Text style={styles.title}>Artikly</Text>
					</a>
					<Text style={styles.subtitle}>German article trainer</Text>
				</View>
				<View>
					<Badge text="Streak" value={`${store.streak}`} />
				</View>
			</View>

			<View style={styles.streakProgress}>
				<View
					style={[
						styles.streakProgressBar,
						{ width: `${percentage}%` }
					]}
				/>
			</View>
		</View>
	);
}