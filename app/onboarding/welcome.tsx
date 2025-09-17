import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { router } from "expo-router";

export default function Welcome() {
  return (
    <View style={styles.container}>
      {/* Circle with logo */}
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/logo1.jpg")} style={styles.logo} />
      </View>

      {/* App name */}
      <Text style={styles.title}>Veritas</Text>

      {/* Get Started button */}
      <Pressable style={styles.btn} onPress={() => router.push("/onboarding/language")}>
        <Text style={styles.btnText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#001f3f" 
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    color: "white", 
    marginBottom: 40 
  },
  btn: { 
    backgroundColor: "#0074D9", 
    padding: 14, 
    marginVertical: 10, 
    borderRadius: 10, 
    width: "70%" 
  },
  btnText: { 
    color: "white", 
    fontSize: 18, 
    textAlign: "center" 
  },
});
