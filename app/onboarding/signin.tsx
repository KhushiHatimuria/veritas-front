import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { router } from "expo-router";

export default function Signin() {
  return (
    <View style={styles.container}>
      {/* Logo + App name */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/logo1.jpg")} style={styles.logo} />
        </View>
        <Text style={styles.title}>Veritas</Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Sign In To Your Account</Text>
      <Text style={styles.smallText}>
        Access your account to manage settings, explore features.
      </Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
      />

      {/* Sign In button */}
      <Pressable
        style={styles.btn}
        onPress={() => router.push("/onboarding/profile1")}
      >
        <Text style={styles.btnText}>Sign In</Text>
      </Pressable>

      {/* Forgot password + Remember me row */}
      <View style={styles.row}>
        <View style={styles.remember}>
          <View style={styles.circle} />
          <Text style={styles.rememberText}>Remember me</Text>
        </View>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001f3f",
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
    overflow: "hidden", // ensures image stays inside circle
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // fills circle
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 4,
    textAlign: "center",
  },
  smallText: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#0074D9",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  remember: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "white",
    marginRight: 6,
  },
  rememberText: { color: "white", fontSize: 14 },
  forgotText: { color: "#00aced", fontSize: 14 },
});
