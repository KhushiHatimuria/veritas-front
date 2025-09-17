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
} from "react-native";

type Msg = { id: string; role: "user" | "bot"; text: string };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: "0", role: "bot", text: "👋 Hi! I’m Veritas. How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList<Msg>>(null);

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
      text: "✅ Got it! (Placeholder reply)",
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
          <View style={styles.box}>
            <Text style={styles.header}>Veritas Chatbot</Text>

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
                    style={item.role === "user" ? styles.userText : styles.botText}
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
                returnKeyType="send"
                onSubmitEditing={send}
              />
              <Pressable style={styles.send} onPress={send}>
                <Text style={styles.sendText}>Send</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      <Pressable onPress={() => setOpen(!open)} style={styles.fab}>
        <Text style={styles.fabIcon}>💬</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "absolute", bottom: 90, right: 20 },
  box: {
    width: 300,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  header: { fontWeight: "700", textAlign: "center", marginBottom: 6 },
  list: { paddingVertical: 8 },
  msg: { maxWidth: "80%", padding: 8, borderRadius: 12, marginVertical: 3 },
  user: { alignSelf: "flex-end", backgroundColor: "#007AFF" },
  bot: { alignSelf: "flex-start", backgroundColor: "#e0e0e0" },
  userText: { color: "#fff" },
  botText: { color: "#000" },
  inputRow: { flexDirection: "row", gap: 8, marginTop: "auto" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  send: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 10,
  },
  sendText: { color: "#fff", fontWeight: "600" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabIcon: { fontSize: 22, color: "#fff" },
});
