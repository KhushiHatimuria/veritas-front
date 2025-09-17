// app/user.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import useProfileStore  from "../store/useProfileStore"; // ✅ import store

export default function UserPage() {
  // ✅ get global profile state
  const { name, gender, dob, country } = useProfileStore();

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name || "Your Name"}</Text>
      </View>

      {/* Gender */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{gender || "Your Gender"}</Text>
      </View>

      {/* DOB */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{dob || "Your DOB"}</Text>
      </View>

      {/* Country */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{country || "Your Country"}</Text>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => router.push("/edit-profile")}
      >
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20 },
  avatarContainer: { alignItems: "center", marginBottom: 30 },
  avatar: { width: 90, height: 90, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "600" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  infoText: { fontSize: 16 },
  editBtn: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  editText: { color: "white", fontWeight: "700" },
});
