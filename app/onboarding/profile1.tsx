import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  Image,
  Modal,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
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

  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#7b2ff7", "#f107a3"], // shifting neon gradient
  });

  const handleSave = () => {
    if (!name || !gender || !dob || !country) {
      Alert.alert("Incomplete", "Please fill in all fields before continuing.");
      return;
    }
    setProfile({ name, gender, dob, country, photo: profileImage });
    router.push("/onboarding/profile2");
  };

  // Camera and Gallery
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
    if (!result.canceled) setProfileImage(result.assets[0].uri);
    setModalVisible(false);
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
    setModalVisible(false);
  };

  const removeProfile = () => {
    setProfileImage(null);
    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/bg1.jpg")} // 🌌 sci-fi bg
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <View style={styles.profileCircle}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person" size={50} color="#bbb" />
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
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#888"
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
              dropdownIconColor="#a85fff"
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
            placeholderTextColor="#888"
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
              dropdownIconColor="#a85fff"
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

        {/* Animated Button */}
        <Animated.View
          style={[
            styles.glowBtnWrapper,
            { shadowColor: glowInterpolation },
          ]}
        >
          <LinearGradient
            colors={["#7b2ff7", "#f107a3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btn}
          >
            <Pressable onPress={handleSave}>
              <Text style={styles.btnText}>Save & Continue </Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 0, 25, 0.6)", // dark violet overlay
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  profileCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#a85fff",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
  },
  cameraBtn: {
    backgroundColor: "#a85fff",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -5,
    right: -5,
    shadowColor: "#a85fff",
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 14,
  },
  label: {
    color: "#e0d8ff",
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "#4b0082",
  },
  dropdown: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#4b0082",
  },
  glowBtnWrapper: {
    width: "100%",
    borderRadius: 10,
    shadowOpacity: 0.9,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    marginTop: 25,
  },
  btn: {
    padding: 15,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
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
