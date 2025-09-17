// app/edit-profile.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import  useProfileStore  from "../store/useProfileStore"; // ✅ import store

export default function EditProfilePage() {
  // ✅ Get values directly from store
  const { name, email, country, notifications, verified, setProfile } =
    useProfileStore();

  // ✅ Local states (pre-filled from store)
  const [nameState, setNameState] = useState(name);
  const [emailState, setEmailState] = useState(email);
  const [countryState, setCountryState] = useState(country);
  const [notificationsState, setNotificationsState] = useState(notifications);
  const [verifiedState, setVerifiedState] = useState(verified);

  const handleSave = () => {
    // ✅ Update global store with new values
    setProfile({
      name: nameState,
      email: emailState,
      country: countryState,
      notifications: notificationsState,
      verified: verifiedState,
    });

    router.back(); // Go back to user page after saving
  };

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
        <TouchableOpacity style={styles.cameraIcon}>
          <Ionicons name="camera" size={18} color="black" />
        </TouchableOpacity>
      </View>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={nameState}
          onChangeText={setNameState}
        />
        <Ionicons name="pencil" size={18} color="gray" />
      </View>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={emailState}
          onChangeText={setEmailState}
        />
        <Ionicons name="pencil" size={18} color="gray" />
      </View>

      {/* Country */}
      <Text style={styles.label}>Country</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={countryState}
          onChangeText={setCountryState}
        />
        <Ionicons name="chevron-down" size={18} color="gray" />
      </View>

      {/* Notification Settings */}
      <View style={styles.switchRow}>
        <Text style={styles.label}>Notification Settings</Text>
        <Switch
          value={notificationsState}
          onValueChange={setNotificationsState}
        />
      </View>

      {/* Verified User */}
      <View style={styles.switchRow}>
        <Text style={styles.label}>Verified User</Text>
        <Switch value={verifiedState} onValueChange={setVerifiedState} />
      </View>

      {/* Buttons */}
      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 120,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "700",
  },
  cancelText: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: 16,
    fontSize: 15,
  },
});
