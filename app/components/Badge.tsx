import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import FlameIcon from "./Flame";

interface BadgeProps {
	text: string;
    value: string;
	backgroundColor?: string;
	textColor?: string;
	iconColor?: string;
	iconSize?: number;
	style?: ViewStyle;
}

export default function Badge({
	text,
    value = "0",
	backgroundColor = "#F97316",
	textColor = "#FFFFFF",
	iconColor = "#FFFFFF",
	iconSize = 16,
	style
}: BadgeProps) {
	if (value === "0") {
		backgroundColor = "#BDBDBD";
	}else{
		backgroundColor = "#F97316";
	}
	return (
		<View style={[styles.container, {backgroundColor}, style]}>
			{<FlameIcon size={iconSize} color={iconColor} strokeWidth={2} />}
			<Text style={[styles.text, {color: textColor}]}>{text}</Text>
			<Text style={[styles.text, {color: textColor}]}>{value}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
        justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 16,
		gap: 8
	},
	text: {
		fontSize: 13,
		fontWeight: "600",
		letterSpacing: 0.5
	}
});
