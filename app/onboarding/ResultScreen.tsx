import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ResultScreen() {
  const { result, type } = useLocalSearchParams();
  const parsed = result ? JSON.parse(result as string) : null;

  // Clean text formatting
  const cleanText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\\n/g, " ") // remove \n
      .replace(/\n/g, " ") // handle real line breaks
      .replace(/\\/g, "") // remove markdown stars
      .replace(/\s+/g, " ") // normalize spacing
      .trim();
  };

  const info: Record<string, { title: string; color: string; emoji: string }> = {
    summarise: { title: "Summary", color: "#8B5CF6", emoji: "🧠" },
    misinfo: { title: "Misinformation Check", color: "#F59E0B", emoji: "⚠" },
    sentiment: { title: "Sentiment Analysis", color: "#10B981", emoji: "💬" },
    detect_image: { title: "Image Detection", color: "#3B82F6", emoji: "🖼" },
    detect_audio: { title: "Audio Detection", color: "#EC4899", emoji: "🎧" },
  };

  const selected = info[type as string] || {
    title: "Result",
    color: "#9CA3AF",
    emoji: "✨",
  };

  // Extract readable content
  const displayText = parsed
    ? cleanText(typeof parsed === "string" ? parsed : JSON.stringify(parsed))
    : "No result found.";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.emoji, { color: selected.color }]}>
          {selected.emoji}
        </Text>
        <Text style={styles.title}>{selected.title}</Text>
      </View>

      <View
        style={[
          styles.card,
          { borderColor: selected.color, shadowColor: selected.color },
        ]}
      >
        <Text style={styles.text}>{displayText}</Text>
      </View>

      <Text style={styles.footerNote}>
        Processed securely by your AI assistant ⚡
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#E5E7EB",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1E293B",
    borderWidth: 1.2,
    borderRadius: 16,
    padding: 18,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  text: {
    color: "#F1F5F9",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  footerNote: {
    color: "#64748B",
    fontSize: 13,
    textAlign: "center",
    marginTop: 30,
  },
});