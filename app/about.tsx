import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AboutPage() {
  // Expanded by default
  const [aboutExpanded, setAboutExpanded] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* About Us */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => setAboutExpanded(!aboutExpanded)}
          >
            <Ionicons name="information-circle-outline" size={22} color="#4A90E2" />
            <Text style={styles.title}>About Us</Text>
            <Ionicons
              name={aboutExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#555"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

          {aboutExpanded && (
            <View>
              <Text style={styles.text}>
                Veritas (replace with your app’s name) is an AI-powered
                misinformation detection and fact-checking platform designed to
                help users identify and debunk false information circulating
                across social media and messaging platforms.
              </Text>
              <Text style={styles.text}>
                Our mission is to combat misinformation by providing real-time
                verification, credibility scoring, and gamified tools that empower
                users to recognize and report misleading claims. Whether it’s a
                text, image, video, or even a deepfake, the app ensures
                transparency, trust, and community-driven awareness.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
    color: "#333",
  },
});
