import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
  Animated,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const glowAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

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
      await AsyncStorage.setItem("userPassword", password);
      Alert.alert("Success", "Password updated successfully!", [
        { text: "OK", onPress: () => router.push("/onboarding/signin") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save password. Please try again.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bg1.jpg")} // ✅ dark sci-fi background
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Animated Lock Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: glowAnim }] },
          ]}
        >
          <Image
            source={{ uri: "https://img.icons8.com/fluency-systems-filled/96/BB86FC/lock--v1.png" }}
            style={styles.icon}
          />
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.text}>
          Your new password must be different from previously used passwords.
        </Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#777"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Animated Save Button */}
        <Animated.View
          style={[styles.glowButtonWrapper, { opacity: glowAnim }]}
        >
          <Pressable style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>Save</Text>
          </Pressable>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0A0016",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  iconContainer: {
    alignSelf: "center",
    marginBottom: 25,
    shadowColor: "#BB86FC",
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  icon: {
    width: 80,
    height: 80,
    tintColor: "#BB86FC",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#BB86FC",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "#9c5dfc",
    textShadowRadius: 10,
  },
  text: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#9c5dfc",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "rgba(20, 0, 40, 0.9)",
    color: "#fff",
    fontSize: 16,
    shadowColor: "#9c5dfc",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  glowButtonWrapper: {
    alignSelf: "center",
    width: "100%",
    shadowColor: "#BB86FC",
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  btn: {
    backgroundColor: "#9c5dfc",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
