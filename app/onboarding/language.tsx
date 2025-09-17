import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function Language() {
  const languages = ["English", "French", "German", "Spanish", "Chinese", "Hindi"];
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What language would you like to choose?</Text>
      {languages.map((lang, i) => (
        <Pressable
          key={i}
          style={styles.option}
          onPress={() => {
            setSelected(lang);
            router.push("/onboarding/signin");
          }}
        >
          {/* Circle for selection */}
          <View style={[styles.circle, selected === lang && styles.circleSelected]} />
          <Text style={styles.btnText}>{lang}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#001f3f", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20 
  },
  title: { 
    color: "white", 
    fontSize: 20, 
    marginBottom: 20, 
    textAlign: "center" 
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0074D9",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    width: "80%",
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
  },
});
