import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

type Msg = { id: string; role: "user" | "bot"; text: string };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: "0", role: "bot", text: "👋 Hi! I’m Verta. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList<Msg>>(null);

  // 🎬 Animation setup for chat box
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { id: Date.now().toString(), role: "user", text };
    const botMsg: Msg = {
      id: Date.now().toString() + "b",
      role: "bot",
      text: "🪐 Processing... (placeholder reply)",
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {open && (
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={styles.wrapper}
        >
          <Animated.View
            style={[
              styles.box,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.header}>🤖 Verta Chatbot</Text>

            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(m) => m.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.msg,
                    item.role === "user" ? styles.user : styles.bot,
                  ]}
                >
                  <Text
                    style={
                      item.role === "user" ? styles.userText : styles.botText
                    }
                  >
                    {item.text}
                  </Text>
                </View>
              )}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type a message…"
                placeholderTextColor="#777"
                returnKeyType="send"
                onSubmitEditing={send}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.send,
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
                onPress={send}
              >
                <Text style={styles.sendText}>Send</Text>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      )}

      <Pressable
        onPress={() => setOpen(!open)}
        style={({ pressed }) => [
          styles.fab,
          pressed && { transform: [{ scale: 0.9 }] },
        ]}
      >
        <Text style={styles.fabIcon}>💬</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 90,
    right: 20,
  },
  box: {
    width: 320,
    height: 420,
    backgroundColor: "#0d0d0d",
    borderRadius: 20,
    padding: 12,
    elevation: 10,
    shadowColor: "#a64dff",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  header: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#a64dff",
    fontSize: 16,
    letterSpacing: 1,
  },
  list: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  msg: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#6b00b6",
    shadowColor: "#a64dff",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  bot: {
    alignSelf: "flex-start",
    backgroundColor: "#1a1a1a",
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#cfcfcf",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: "auto",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#3a0066",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#fff",
    backgroundColor: "#1a1a1a",
  },
  send: {
    backgroundColor: "#a64dff",
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: "#a64dff",
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    backgroundColor: "#a64dff",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#a64dff",
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  fabIcon: {
    fontSize: 22,
    color: "#fff",
  },
});
