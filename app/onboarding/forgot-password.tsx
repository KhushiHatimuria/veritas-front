import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <ImageBackground
      source={require("../../assets/background4.jpg")} // ✅ use your local asset
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Lock Icon */}
        <Image
          source={{ uri: "https://img.icons8.com/ios-filled/100/1E90FF/lock--v1.png" }}
          style={styles.icon}
        />

        {/* Title */}
        <Text style={styles.title}>Forgot Password</Text>

        {/* Subtitle */}
        <Text style={styles.text}>
          Please enter your email address to receive a verification code.
        </Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Try another way */}
        <Pressable>
          <Text style={styles.link}>Try another way</Text>
        </Pressable>

        {/* Send Button */}
        <Pressable
          style={styles.btn}
          onPress={() => router.push("/onboarding/verify-email")}
        >
          <Text style={styles.btnText}>Send</Text>
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
    backgroundColor: "rgba(255,255,255,0.85)", // ✅ semi-transparent white for readability
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
    padding: 14,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  link: {
    textAlign: "center",
    color: "#1E90FF",
    marginBottom: 20,
    fontWeight: "500",
  },
  btn: { backgroundColor: "#1E90FF", padding: 14, borderRadius: 10 },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
