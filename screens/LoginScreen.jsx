// LoginScreen.jsx
import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Pressable,
	SafeAreaView,
	StyleSheet,
} from "react-native";

// import the auth variable
import { auth } from "../controllers/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
	// State variables for email and password inputs
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Handle login button
	const handleLogin = async () => {
		//verify credentials
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			// LOG: current user
			console.log(`Currently logged in user: \n`);
			console.log(userCredential.user.getIdToken);
			console.log(auth.currentUser.uid);

			// UI alert
			alert(`Login success! ${auth.currentUser.email}`);
			navigation.navigate("Search", { userEmail: auth.currentUser.email });
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.mainContainer}>
				<View style={styles.inputSection}>
          <Text style={styles.title}>Login to your Account</Text>
					{/* Email Input */}
					<TextInput
						placeholder="Enter your email"
						value={email}
						onChangeText={setEmail}
						textContentType="emailAddress"
						autoCapitalize="none"
						style={styles.input}
					/>
					{/* Password Input */}
					<TextInput
						placeholder="Enter your password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						style={styles.input}
					/>
				</View>

				{/* Login Button */}
				<Pressable
					style={({ pressed }) => [
						styles.button,
						{ backgroundColor: pressed ? "#8472C0" : "#6A56B3" },
					]}
					onPress={handleLogin}
				>
					<Text style={styles.buttonText}>Login</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAF4F1",
		paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
		justifyContent: "space-between",
	},
	mainContainer: {
		paddingHorizontal: 25,
		flex: 1,
		justifyContent: "space-between",
	},
	inputSection: {
		paddingTop: 250,
	},
  title: {
		fontSize: 34,
		fontWeight: "700",
		paddingBottom: 40,
	},
	input: {
		width: "100%",
		height: 40,
		borderColor: "#C1B9DF",
		borderWidth: 1,
		borderRadius: 10,
		marginBottom: 20,
		paddingHorizontal: 10,
		backgroundColor: "#fff",
	},
	btnSection: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		marginLeft: 10,
	},
	button: {
		width: "100%",
		borderRadius: 50,
		paddingVertical: 12,
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		textAlign: "center",
	},
});

export default LoginScreen;
