import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Profile2() {
  const identities = [
    "General User",
    "Journalist",
    "Researcher",
    "Student / Learner",
    "Policy/Fact-checker",
    "Other",
  ];

  const topics = [
    "Economy and business",
    "Politics",
    "Health & Science",
    "Environment",
    "Entertainment",
    "Global Events",
    "Other Interests",
  ];

  const [selectedIdentity, setSelectedIdentity] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Identity Section */}
      <Text style={styles.title}>How do you identify?</Text>
      {identities.map((id, i) => (
        <Pressable
          key={i}
          style={styles.optionRow}
          onPress={() => setSelectedIdentity(id)}
        >
          <Ionicons
            name={
              selectedIdentity === id
                ? "radio-button-on"
                : "radio-button-off"
            }
            size={22}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.optionText}>{id}</Text>
        </Pressable>
      ))}

      {/* Topics Section */}
      <Text style={styles.subtitle}>Choose topics you care about</Text>
      {topics.map((t, i) => (
        <Pressable
          key={i}
          style={styles.optionRow}
          onPress={() => toggleTopic(t)}
        >
          <Ionicons
            name={
              selectedTopics.includes(t)
                ? "checkmark-circle"
                : "ellipse-outline"
            }
            size={22}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.optionText}>{t}</Text>
        </Pressable>
      ))}

      {/* Save Button */}
      <Pressable
        style={styles.btn}
        onPress={() => router.push("/onboarding/permission2")}
      >
        <Text style={styles.btnText}>Save & Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#001f3f", padding: 20 },
  title: { color: "white", fontSize: 20, marginBottom: 15, fontWeight: "600" },
  subtitle: { color: "white", fontSize: 18, marginTop: 25, marginBottom: 15 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  optionText: { color: "white", fontSize: 16 },
  btn: {
    backgroundColor: "#39CCCC",
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
  },
  btnText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" },
});
