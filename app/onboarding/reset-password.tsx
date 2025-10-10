import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match. Try again.");
      return;
    }

    try {
      // ✅ Mock save password locally
      await AsyncStorage.setItem("userPassword", password);

      Alert.alert("Success", "Password updated successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/onboarding/signin"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save password. Please try again.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background4.jpg")} // ✅ background4 added
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Lock Icon */}
        <Image
          source={{ uri: "https://img.icons8.com/ios-filled/100/1E90FF/lock--v1.png" }}
          style={styles.icon}
        />

        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.text}>
          Your new password must be different from previously used passwords.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>Save</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.85)", // ✅ white overlay for readability
    justifyContent: "center",
    padding: 20,
  },
  icon: { width: 80, height: 80, alignSelf: "center", marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
    color: "#1E90FF",
  },
  text: { fontSize: 14, color: "#444", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#1E90FF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  btn: { backgroundColor: "#1E90FF", padding: 14, borderRadius: 10, marginTop: 10 },
  btnText: { textAlign: "center", color: "white", fontWeight: "600", fontSize: 16 },
});
