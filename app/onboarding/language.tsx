import { View, Text, Pressable, StyleSheet, ImageBackground, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Language() {
  const languages = ["English", "French", "German", "Spanish", "Chinese", "Hindi"];
  const [selected, setSelected] = useState<string | null>(null);

  // Flicker animation
  const flickerAnim = useRef(new Animated.Value(0)).current;
  const [shuffleDone, setShuffleDone] = useState(false);

  // Start flicker loop only until shuffle completes
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

  // Flicker color (active only during shuffle)
  const flickerColor = flickerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffffff", "#00eaff"], // flicker white ↔ neon blue
  });

  // Shuffle text effect
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

      iteration += 1 / 3; // controls how fast letters settle
      if (iteration >= originalTitle.length) {
        clearInterval(interval);
        setShuffledTitle(originalTitle); // final resolved text
        setShuffleDone(true); // stop flicker after shuffle
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/background3.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Flicker only until shuffle finishes, then solid neon blue */}
        <Animated.Text
          style={[
            styles.title,
            { color: shuffleDone ? "#00eaff" : flickerColor },
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
              colors={["#005bea", "#00c6fb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.option}
            >
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
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  optionWrapper: {
    width: "80%",
    marginVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    width: "100%",
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
  },
});
