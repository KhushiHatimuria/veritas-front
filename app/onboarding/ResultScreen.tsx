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
      .replace(/\\n/g, "\n") // convert \n to actual line breaks
      .replace(/\*\*/g, "") // remove markdown bold
      .replace(/\*/g, "") // remove markdown stars
      .replace(/\s{3,}/g, "\n\n") // normalize excessive spacing
      .trim();
  };

  // Format JSON object into readable text
  const formatJsonToText = (data: any): string => {
    if (typeof data === "string") {
      return cleanText(data);
    }

    if (typeof data === "object" && data !== null) {
      let formatted = "";

      // Handle different response structures
      if (data.summary) {
        formatted += cleanText(data.summary);
      } else if (data.result) {
        formatted += cleanText(data.result);
      } else if (data.analysis) {
        formatted += cleanText(data.analysis);
      } else if (data.verdict) {
        formatted += `Verdict: ${data.verdict}\n\n`;
        if (data.explanation) {
          formatted += cleanText(data.explanation);
        }
      } else if (data.sentiment) {
        formatted += `Sentiment: ${data.sentiment}\n\n`;
        if (data.confidence) {
          formatted += `Confidence: ${data.confidence}\n\n`;
        }
        if (data.explanation) {
          formatted += cleanText(data.explanation);
        }
      } else if (data.detected) {
        formatted += `Detection: ${data.detected ? "Yes" : "No"}\n\n`;
        if (data.details) {
          formatted += cleanText(data.details);
        }
      } else if (data.is_misinformation !== undefined) {
        formatted += `Misinformation: ${
          data.is_misinformation ? "Yes" : "No"
        }\n\n`;
        if (data.reasoning) {
          formatted += "Reasoning:\n" + cleanText(data.reasoning);
        }
      } else {
        // Fallback: convert object to formatted text
        Object.entries(data).forEach(([key, value]) => {
          const formattedKey = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          if (typeof value === "string") {
            formatted += `${formattedKey}:\n${cleanText(value)}\n\n`;
          } else {
            formatted += `${formattedKey}: ${value}\n\n`;
          }
        });
      }

      return formatted.trim() || "No readable content found.";
    }

    return "No result found.";
  };

  const info: Record<string, { title: string; color: string; emoji: string }> =
    {
      summarise: { title: "Summary", color: "#8B5CF6", emoji: "🧠" },
      misinfo: { title: "Misinformation Check", color: "#F59E0B", emoji: "⚠️" },
      sentiment: { title: "Sentiment Analysis", color: "#10B981", emoji: "💬" },
      detect_image: { title: "Image Detection", color: "#3B82F6", emoji: "🖼️" },
      detect_audio: { title: "Audio Detection", color: "#EC4899", emoji: "🎧" },
    };

  const selected = info[type as string] || {
    title: "Result",
    color: "#9CA3AF",
    emoji: "✨",
  };

  // Format the parsed JSON into readable text
  const displayText = formatJsonToText(parsed);

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
