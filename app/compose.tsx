import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import useProfileStore from "../store/useProfileStore";

export default function ComposeScreen() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [linkPreview, setLinkPreview] = useState<string | null>(null);

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setMediaUri(result.assets[0].uri);
      setAudioUri(null);
    }
  };

  const handlePickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        const file = result.assets[0];
        setAudioUri(file.uri);
        setMediaUri(null);
      }
    } catch (error) {
      console.log("Error picking audio:", error);
      Alert.alert("Error", "Unable to pick audio file");
    }
  };

  const handleAddLink = () => {
    if (!text.includes("http")) {
      Alert.alert("No link found", "Paste a link into your post first.");
      return;
    }
    const words = text.split(" ");
    const found = words.find((w) => w.startsWith("http"));
    if (found) setLinkPreview(found);
  };

  const handlePost = () => {
    if (!text.trim() && !mediaUri && !audioUri) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("✅ Success", "Your verification request has been submitted!");
      setText("");
      setMediaUri(null);
      setAudioUri(null);
      setLinkPreview(null);
      router.back();
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#E5E7EB" />
        </Pressable>
        <Text style={styles.headerTitle}>Compose</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.prompt}>What do you want to verify?</Text>

      {/* Text Input */}
      <TextInput
        placeholder="Start typing your thoughts..."
        placeholderTextColor="#9ca3af"
        value={text}
        onChangeText={setText}
        multiline
        maxLength={280}
        style={styles.input}
      />
      <Text style={styles.charCount}>{text.length}/280</Text>

      {/* Photo Preview */}
      {mediaUri && (
        <View style={styles.attachment}>
          <Image source={{ uri: mediaUri }} style={styles.preview} />
          <Pressable style={styles.removeBtn} onPress={() => setMediaUri(null)}>
            <Ionicons name="close-circle" size={22} color="#F87171" />
          </Pressable>
        </View>
      )}

      {/* Audio Preview */}
      {audioUri && (
        <View style={styles.audioCard}>
          <Ionicons name="musical-notes-outline" size={22} color="#A78BFA" />
          <Text style={{ flex: 1, color: "#E5E7EB" }} numberOfLines={1}>
            {audioUri.split("/").pop()}
          </Text>
          <Pressable onPress={() => setAudioUri(null)}>
            <Ionicons name="close" size={20} color="#F87171" />
          </Pressable>
        </View>
      )}

      {/* Link Preview */}
      {linkPreview && (
        <View style={styles.linkCard}>
          <Ionicons name="link-outline" size={20} color="#A78BFA" />
          <Text style={styles.linkText} numberOfLines={1}>
            {linkPreview}
          </Text>
          <Pressable onPress={() => setLinkPreview(null)}>
            <Ionicons name="close" size={18} color="#F87171" />
          </Pressable>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.row}>
        <Pressable style={styles.chip} onPress={handlePickPhoto}>
          <Ionicons name="image-outline" size={18} color="#A78BFA" />
          <Text style={styles.chipText}> Photo</Text>
        </Pressable>

        <Pressable style={styles.chip} onPress={handlePickAudio}>
          <Ionicons name="musical-notes-outline" size={18} color="#A78BFA" />
          <Text style={styles.chipText}> Audio</Text>
        </Pressable>

        <Pressable style={styles.chip} onPress={handleAddLink}>
          <Ionicons name="link-outline" size={18} color="#A78BFA" />
          <Text style={styles.chipText}> Link</Text>
        </Pressable>
      </View>

      {/* Verify Button */}
      <Pressable
        style={[
          styles.postBtn,
          { opacity: text || mediaUri || audioUri ? 1 : 0.5 },
        ]}
        disabled={!text && !mediaUri && !audioUri || loading}
        onPress={handlePost}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "700" }}>Verify</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1F2937",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#374151",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#E5E7EB" },
  prompt: {
    marginTop: 16,
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  input: {
    margin: 16,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 12,
    minHeight: 140,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#374151",
    fontSize: 15,
    color: "#E5E7EB",
  },
  charCount: {
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: 8,
    color: "#9CA3AF",
    fontSize: 12,
  },
  attachment: { marginHorizontal: 16, marginBottom: 12, position: "relative" },
  preview: { width: "100%", height: 180, borderRadius: 12 },
  removeBtn: { position: "absolute", top: 6, right: 6 },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
    gap: 8,
  },
  linkText: { flex: 1, color: "#A78BFA" },
  audioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
    gap: 8,
  },
  row: { flexDirection: "row", gap: 12, paddingHorizontal: 16 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
  },
  chipText: { color: "#A78BFA", fontWeight: "500" },
  postBtn: {
    marginTop: "auto",
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
    elevation: 3,
  },
});
