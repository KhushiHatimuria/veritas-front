import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useProfileStore from "../../store/useProfileStore";

export default function Signin() {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateProfile = useProfileStore((state) => state.updateProfile);

  const handleSignin = () => {
    if (!email) return;
    updateProfile({ email });
    router.push("/onboarding/profile1");
  };

  const handleSignup = () => {
    if (!email || !name || password !== confirmPassword) return;
    updateProfile({ email, name });
    router.push("/onboarding/profile1");
  };

  return (
    <ImageBackground
      source={require("../../assets/background3.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Logo + App name */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/logo1.jpg")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>Veritas</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[
              styles.tab,
              activeTab === "signin" ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => setActiveTab("signin")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "signin"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              Sign In
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === "signup" ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => setActiveTab("signup")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "signup"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              Create Account
            </Text>
          </Pressable>
        </View>

        {/* ✅ Google Sign In / Sign Up */}
        <Pressable style={styles.googleBtn}>
          <Image
            source={require("../../assets/google.png")} // Local asset
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>
            {activeTab === "signin"
              ? "Sign In with Google"
              : "Sign Up with Google"}
          </Text>
        </Pressable>

        <Text style={styles.orText}>or</Text>

        {/* Inputs */}
        {activeTab === "signin" ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password with eye toggle */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#555"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#0074D9"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password link */}
            <TouchableOpacity
              onPress={() => router.push("/onboarding/forgot-password")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In button */}
            <Pressable style={styles.btn} onPress={handleSignin}>
              <Text style={styles.btnText}>Sign In</Text>
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your Name"
              placeholderTextColor="#555"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password with eye toggle */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#555"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#0074D9"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password with eye toggle */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                placeholderTextColor="#555"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#0074D9"
                />
              </TouchableOpacity>
            </View>

            {/* Create Account button */}
            <Pressable style={styles.btn} onPress={handleSignup}>
              <Text style={styles.btnText}>Create Account</Text>
            </Pressable>
          </>
        )}

        {/* Terms & Privacy */}
        <Text style={styles.termsText}>
          By signing up, you agree to the{" "}
          <Text style={styles.link}>Terms</Text> and{" "}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    overflow: "hidden",
  },
  logo: { width: "100%", height: "100%", resizeMode: "cover" },
  title: { color: "white", fontSize: 26, fontWeight: "700" },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 30,
    padding: 4,
    marginBottom: 20,
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#0074D9" },
  inactiveTab: { borderWidth: 1, borderColor: "#0074D9" },
  tabText: { fontSize: 16, fontWeight: "600" },
  activeTabText: { color: "white" },
  inactiveTabText: { color: "#0074D9" },

  // Google button
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    marginBottom: 12,
  },
  googleIcon: { width: 22, height: 22, marginRight: 10, resizeMode: "contain" },
  googleText: { fontSize: 16, color: "#333", fontWeight: "500" },

  orText: { color: "#aaa", marginBottom: 15 },

  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 15,
    color: "#000",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    paddingRight: 10,
  },
  passwordInput: { flex: 1, padding: 12, color: "#000" },
  eyeIcon: { paddingHorizontal: 6 },

  btn: {
    backgroundColor: "#0074D9",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    marginTop: 15,
    marginBottom: 20,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotText: {
    alignSelf: "flex-end",
    color: "#66b2ff",
    fontSize: 14,
    marginBottom: 10,
  },
  termsText: { color: "#aaa", fontSize: 13, textAlign: "center" },
  link: { color: "#66b2ff" },
});
