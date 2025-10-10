import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";

export default function VerifyEmail() {
  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (code === "1234") {
      router.push("/onboarding/reset-password");
    } else {
      Alert.alert("Invalid Code", "The code you entered is incorrect. Please try again.");
      setCode("");
    }
  };

  const handleResend = () => {
    Alert.alert("Code Resent", "A new verification code has been sent to your email.");
  };

  return (
    <ImageBackground
      source={require("../../assets/background4.jpg")} // ✅ Local asset background
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Email Icon */}
        <Image
          source={{ uri: "https://img.icons8.com/ios-filled/100/1E90FF/new-post.png" }}
          style={styles.icon}
        />

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.text}>Please enter the 4-digit code sent to your email.</Text>

        {/* OTP Input */}
        <TextInput
          style={styles.input}
          placeholder="----"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={4}
          value={code}
          onChangeText={setCode}
        />

        {/* Resend Code */}
        <Pressable onPress={handleResend}>
          <Text style={styles.resend}>Resend Code</Text>
        </Pressable>

        {/* Verify Button */}
        <Pressable style={styles.btn} onPress={handleVerify}>
          <Text style={styles.btnText}>Verify</Text>
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
    backgroundColor: "rgba(255,255,255,0.85)", // ✅ overlay for readability
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
    borderWidth: 1.5,
    borderColor: "#1E90FF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 20,
    backgroundColor: "#f9f9f9",
  },
  resend: {
    textAlign: "center",
    color: "#1E90FF",
    marginBottom: 20,
    fontWeight: "500",
  },
  btn: { backgroundColor: "#1E90FF", padding: 14, borderRadius: 10 },
  btnText: { textAlign: "center", color: "white", fontWeight: "600", fontSize: 16 },
});
