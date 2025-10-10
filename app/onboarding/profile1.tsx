import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground, Image, Modal, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import useProfileStore from "../../store/useProfileStore";

export default function Profile1() {
  const { setProfile } = useProfileStore();

  // Local states
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = () => {
   setProfile({ name, gender, dob, country, photo: profileImage });

    router.push("/onboarding/profile2");
  };

  // Open Camera
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  // Open Gallery
  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  // Remove profile image
  const removeProfile = () => {
    setProfileImage(null);
    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/background3.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Profile Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.profileCircle}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person" size={50} color="#ccc" />
            )}
          </View>
          <Pressable style={styles.cameraBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="camera" size={20} color="white" />
          </Pressable>
        </View>

        {/* Modal for options */}
        <Modal
          transparent
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Pressable style={styles.modalBtn} onPress={openCamera}>
                <Text style={styles.modalText}>📷 Take Photo</Text>
              </Pressable>
              <Pressable style={styles.modalBtn} onPress={openGallery}>
                <Text style={styles.modalText}>🖼️ Choose from Gallery</Text>
              </Pressable>
              {profileImage && (
                <Pressable style={styles.modalBtn} onPress={removeProfile}>
                  <Text style={[styles.modalText, { color: "red" }]}>❌ Remove Profile Photo</Text>
                </Pressable>
              )}
              <Pressable style={[styles.modalBtn, { backgroundColor: "#ccc" }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Input Fields */}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
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
    backgroundColor: "#3859ebff",
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalBtn: {
    padding: 15,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
  },
});
