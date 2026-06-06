import {Stack} from "expo-router";
import NavBar from "./components/NavBar";

export default function RootLayout() {
	return (
		<>
			<NavBar></NavBar>
			<Stack screenOptions={{headerShown: false}} />
		</>
	);
}
