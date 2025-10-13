import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useProfileStore from "../../store/useProfileStore";
import { LinearGradient } from "expo-linear-gradient";

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
      source={require("../../assets/bg1.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* App Name */}
        <Text style={styles.title}>Veritas</Text>

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

        {/* Inputs */}
        {activeTab === "signin" ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password with eye toggle */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#aaa"
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
                  color="#a855f7"
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
            <LinearGradient
              colors={["#7e22ce", "#a855f7", "#9333ea"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Pressable onPress={handleSignin}>
                <Text style={styles.btnText}>Sign In</Text>
              </Pressable>
            </LinearGradient>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your Name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password with eye toggle */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#aaa"
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
                  color="#a855f7"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password with eye toggle */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
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
                  color="#a855f7"
                />
              </TouchableOpacity>
            </View>

            {/* Create Account button */}
            <LinearGradient
              colors={["#7e22ce", "#a855f7", "#9333ea"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Pressable onPress={handleSignup}>
                <Text style={styles.btnText}>Create Account</Text>
              </Pressable>
            </LinearGradient>
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10,10,25,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#a855f7",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 30,
    textShadowColor: "rgba(168,85,247,0.7)",
    textShadowRadius: 12,
  },
  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 30,
    padding: 4,
    marginBottom: 25,
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#9333ea" },
  inactiveTab: { borderWidth: 1, borderColor: "#a855f7" },
  tabText: { fontSize: 16, fontWeight: "600" },
  activeTabText: { color: "white" },
  inactiveTabText: { color: "#a855f7" },

  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 12,
    width: "100%",
    marginBottom: 15,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.3)",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    paddingRight: 10,
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.3)",
  },
  passwordInput: { flex: 1, padding: 12, color: "white" },
  eyeIcon: { paddingHorizontal: 6 },

  btn: {
    padding: 14,
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#a855f7",
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  forgotText: {
    alignSelf: "flex-end",
    color: "#c084fc",
    fontSize: 14,
    marginBottom: 10,
  },
  termsText: { color: "#aaa", fontSize: 13, textAlign: "center" },
  link: { color: "#a855f7" },
});
