import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useProfileStore from "../store/useProfileStore"; // ✅ import the store

export default function ComposeScreen() {
  const [text, setText] = useState("");

  // ✅ get name from global profile store
  const { name } = useProfileStore();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} />
        </Pressable>
        {/* ✅ show Welcome + username */}
        <Text style={styles.headerTitle}>Welcome {name || "Guest"}</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.prompt}>What do you want to verify?</Text>

      <TextInput
        placeholder="Start typing your thoughts..."
        value={text}
        onChangeText={setText}
        multiline
        style={styles.input}
      />

      <View style={styles.row}>
        <Pressable style={styles.chip}>
          <Ionicons name="image-outline" size={18} />
          <Text> Photo / video</Text>
        </Pressable>
        <Pressable style={styles.chip}>
          <Ionicons name="link-outline" size={18} />
          <Text> Link</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.postBtn, { opacity: text ? 1 : 0.5 }]}
        disabled={!text}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Post</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  prompt: {
    marginTop: 16,
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    minHeight: 140,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  postBtn: {
    marginTop: "auto",
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#111827",
  },
});
