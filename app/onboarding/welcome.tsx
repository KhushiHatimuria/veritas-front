import { View, Text, Pressable, StyleSheet, ImageBackground, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { router } from "expo-router";

export default function Welcome() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
      source={require("../../assets/robo1.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.centered}>
        <Text style={styles.caption}>
          Beyond{"\n"}the{"\n"}shadow,{"\n"}there is{"\n"}veritas
        </Text>
        <View style={styles.btnWrapper}>
          <Animated.View
            style={[
              styles.btnGlow,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.2],
                  outputRange: [0.4, 0],
                }),
              },
            ]}
          />
          <Pressable style={styles.btn} onPress={() => router.push("/onboarding/language")}>
            <Text style={styles.btnText}>Get Started</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(19,17,57,0.55)", // slightly softer overlay for blending
    zIndex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    width: "100%",
    paddingHorizontal: 22,
  },
  caption: {
    color: "rgba(255,255,255,0.86)", // more blended with bg
    fontSize: 30, // less bold/striking
    fontWeight: "600", // semi-bold
    marginBottom: 65, // more space before button
    textAlign: "center",
    lineHeight: 38,
    letterSpacing: 0.5,
    fontFamily: "Montserrat-SemiBold",
    textShadowColor: "rgba(0,0,0,0.18)", // soft shadow
    textShadowOffset: { width: 1, height: 4 },
    textShadowRadius: 5,
  },
  btnWrapper: {
    width: "80%",
    alignItems: "center",
    position: "relative",
    marginTop: 42, // more downward spacing
  },
  btnGlow: {
    position: "absolute",
    width: "100%",
    height: 58,
    top: 0,
    borderRadius: 14,
    backgroundColor: "#8C7DFC",
    zIndex: -1,
    shadowColor: "#8C7DFC",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 4,
  },
  btn: {
    backgroundColor: "#831cb2ff",
    padding: 14,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    shadowColor: "#8C7DFC",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 2,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Montserrat-SemiBold",
    letterSpacing: 0.4,
  },
});
