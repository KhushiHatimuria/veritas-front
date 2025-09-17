import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import useProfileStore from "../../store/useProfileStore";
 // ✅ import the store

export default function Profile1() {
  const { setProfile } = useProfileStore(); // ✅ access setter from store

  // Local states
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");

  const handleSave = () => {
    setProfile({ name, gender, dob, country }); // ✅ save to global store
    router.push("/onboarding/profile2"); // ✅ navigate next
  };

  return (
    <View style={styles.container}>
      {/* Profile Image Placeholder */}
      <View style={styles.imageContainer}>
        <View style={styles.profileCircle}>
          <Ionicons name="person" size={50} color="#ccc" />
        </View>
        <Pressable style={styles.cameraBtn}>
          <Ionicons name="camera" size={20} color="white" />
        </Pressable>
      </View>

      {/* Input Fields with Labels */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={gender}
            onValueChange={(val) => setGender(val)}
            dropdownIconColor="#0074D9"
          >
            <Picker.Item label="Select gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#999"
          value={dob}
          onChangeText={setDob}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Country</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={country}
            onValueChange={(val) => setCountry(val)}
            dropdownIconColor="#0074D9"
          >
            <Picker.Item label="Select your country" value="" />
            <Picker.Item label="India" value="India" />
            <Picker.Item label="USA" value="USA" />
            <Picker.Item label="UK" value="UK" />
            <Picker.Item label="Canada" value="Canada" />
            <Picker.Item label="Australia" value="Australia" />
          </Picker>
        </View>
      </View>

      {/* Save & Continue Button */}
      <Pressable style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>Save & Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001f3f",
    padding: 20,
    alignItems: "center",
  },

  imageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBtn: {
    backgroundColor: "#0074D9",
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -5,
    right: -5,
  },

  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    width: "100%",
  },

  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },

  btn: {
    backgroundColor: "#39CCCC",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
