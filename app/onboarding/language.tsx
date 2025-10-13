import { View, Text, Pressable, StyleSheet, ImageBackground, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Language() {
  const languages = ["English", "French", "German", "Spanish", "Chinese", "Hindi"];
  const [selected, setSelected] = useState<string | null>(null);

  // --- Flicker animation ---
  const flickerAnim = useRef(new Animated.Value(0)).current;
  const [shuffleDone, setShuffleDone] = useState(false);

  useEffect(() => {
    if (!shuffleDone) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(flickerAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(flickerAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [flickerAnim, shuffleDone]);

  const flickerColor = flickerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffffff", "#a855f7"], // white ↔ neon purple
  });

  // --- Shuffle text effect ---
  const originalTitle = "What language would you like to choose?";
  const [shuffledTitle, setShuffledTitle] = useState(originalTitle);

  useEffect(() => {
    let iteration = 0;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const interval = setInterval(() => {
      setShuffledTitle(
        originalTitle
          .split("")
          .map((char, idx) => {
            if (idx < iteration) return originalTitle[idx];
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );

      iteration += 1 / 3;
      if (iteration >= originalTitle.length) {
        clearInterval(interval);
        setShuffledTitle(originalTitle);
        setShuffleDone(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/bg1.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Title with flicker effect */}
        <Animated.Text
          style={[
            styles.title,
            { color: shuffleDone ? "#a855f7" : flickerColor },
          ]}
        >
          {shuffledTitle}
        </Animated.Text>

        {languages.map((lang, i) => (
          <Pressable
            key={i}
            style={styles.optionWrapper}
            onPress={() => {
              setSelected(lang);
              router.push("/onboarding/signin");
            }}
          >
            <LinearGradient
              colors={["#7e22ce", "#a855f7", "#9333ea"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.option,
                selected === lang && styles.optionSelected,
              ]}
            >
              <Animated.View
                style={[
                  styles.glow,
                  {
                    opacity: flickerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 0.9],
                    }),
                  },
                ]}
              />
              <View
                style={[styles.circle, selected === lang && styles.circleSelected]}
              />
              <Text style={styles.btnText}>{lang}</Text>
            </LinearGradient>
          </Pressable>
        ))}
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 10, 25, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 1,
    textShadowColor: "rgba(168,85,247,0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  optionWrapper: {
    width: "80%",
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    width: "100%",
    justifyContent: "flex-start", // 👈 Align circle + text to the left
    paddingHorizontal: 20,        // 👈 Add left padding for breathing room
  },
  optionSelected: {
    borderWidth: 1.5,
    borderColor: "#d8b4fe",
    shadowColor: "#a855f7",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: "#a855f7",
    opacity: 0.2,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    marginRight: 12,
    backgroundColor: "transparent",
  },
  circleSelected: {
    backgroundColor: "white",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
