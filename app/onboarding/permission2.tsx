import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Permission2() {
  const privacyOptions = [
    "Share anonymous insights to improve detection",
    "Enable WhatsApp/Telegram integration",
  ];

  const permissionOptions = [
    "Notifications",
    "Media access for image/video check",
    "Contacts",
  ];

  const [selectedPrivacy, setSelectedPrivacy] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const toggleOption = (option: string, type: "privacy" | "permission") => {
    if (type === "privacy") {
      setSelectedPrivacy((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    } else {
      setSelectedPermissions((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    }
  };

  const toggleAllowAll = () => {
    if (selectedPermissions.length === permissionOptions.length) {
      setSelectedPermissions([]); // deselect all
    } else {
      setSelectedPermissions(permissionOptions); // select all
    }
  };

  const isAllSelected = selectedPermissions.length === permissionOptions.length;

  return (
    <View style={styles.container}>
      {/* Privacy Section */}
      <Text style={styles.sectionTitle}>Privacy</Text>
      {privacyOptions.map((p, i) => (
        <Pressable
          key={i}
          style={styles.optionRow}
          onPress={() => toggleOption(p, "privacy")}
        >
          <Ionicons
            name={selectedPrivacy.includes(p) ? "checkbox" : "square-outline"}
            size={22}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.optionText}>{p}</Text>
        </Pressable>
      ))}

      {/* Permissions Section */}
      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Permissions</Text>
      {permissionOptions.map((p, i) => (
        <Pressable
          key={i}
          style={styles.optionRow}
          onPress={() => toggleOption(p, "permission")}
        >
          <Ionicons
            name={selectedPermissions.includes(p) ? "checkbox" : "square-outline"}
            size={22}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.optionText}>{p}</Text>
        </Pressable>
      ))}

      {/* Allow All Option */}
      <Pressable style={styles.optionRow} onPress={toggleAllowAll}>
        <Ionicons
          name={isAllSelected ? "checkbox" : "square-outline"}
          size={22}
          color="white"
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.optionText, { fontWeight: "600" }]}>Allow All</Text>
      </Pressable>

      {/* Save Button */}
      <Pressable style={styles.btn} onPress={() => router.push("/home")}>
        <Text style={styles.btnText}>Save & Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#001f3f", padding: 20 },
  sectionTitle: {
    color: "#39CCCC",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  optionText: { color: "white", fontSize: 16 },
  btn: {
    backgroundColor: "#39cccc",
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
  },
  btnText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" },
});
