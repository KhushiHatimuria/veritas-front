import { View, Text, Pressable, StyleSheet, ImageBackground, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { router } from "expo-router";

export default function Welcome() {
  // Pulse animation for button
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Infinite pulsing for button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <ImageBackground
      source={require("../../assets/background2.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Static Logo (no rotation applied) */}
        <Animated.Image
          source={require("../../assets/logo1.jpg")}
          style={styles.logo}
        />

        {/* App name */}
        <Text style={styles.title}>VERITAS</Text>

        {/* Button with glow effect */}
        <Animated.View
          style={[
            styles.btnGlow,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0.6, 0],
              }),
            },
          ]}
        />
        <Pressable style={styles.btn} onPress={() => router.push("/onboarding/language")}>
          <Text style={styles.btnText}>Get Started</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.6)" 
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 30,
  },
  title: { 
    fontSize: 30, 
    fontWeight: "700", 
    color: "white", 
    marginBottom: 40 
  },
  btnGlow: {
    position: "absolute",
    bottom: "28%", // places glow behind button
    width: "70%",
    height: 60,
    borderRadius: 12,
    backgroundColor: "#0074D9",
    zIndex: -1,
  },
  btn: { 
    backgroundColor: "#0074D9", 
    padding: 16, 
    marginVertical: 10, 
    borderRadius: 10, 
    width: "70%", 
  },
  btnText: { 
    color: "white", 
    fontSize: 18, 
    textAlign: "center" 
  },
});
