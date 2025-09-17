import { Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Menu from "../Components/Menu";   // ✅ Drawer Menu
import LogoutModal from "../Components/LogoutModal"; // ✅ Logout modal
import Chatbot from "../Components/Chatbot"; // ✅ Floating chatbot

const TRENDING = [
  { id: "t1", title: "Trending news" },
  { id: "t2", title: "Sports news" },
  { id: "t3", title: "Tech news" },
  { id: "t4", title: "More" },
];

interface Post {
  id: string;
  content: string;
  archived: boolean;
}

export default function ArchivesScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  // Load posts (dummy + AsyncStorage)
  useEffect(() => {
    const loadPosts = async () => {
      const stored = await AsyncStorage.getItem("user_posts");
      if (stored) {
        setPosts(JSON.parse(stored));
      } else {
        const dummy: Post[] = [
          { id: "1", content: "My first post 🎉", archived: false },
          { id: "2", content: "Vacation 🏖️", archived: true },
          { id: "3", content: "Learning React Native 📱", archived: false },
        ];
        setPosts(dummy);
        await AsyncStorage.setItem("user_posts", JSON.stringify(dummy));
      }
    };
    loadPosts();
  }, []);

  // Toggle archive
  const toggleArchive = async (id: string) => {
    const updated = posts.map((p) =>
      p.id === id ? { ...p, archived: !p.archived } : p
    );
    setPosts(updated);
    await AsyncStorage.setItem("user_posts", JSON.stringify(updated));
  };

  // Filtered data (only archived posts shown here)
  const visiblePosts = posts.filter((p) => p.archived);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={visiblePosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.postText}>{item.content}</Text>
            
            {/* ✅ Changed button text to Unarchive */}
            <Pressable
              style={styles.archiveBtn}
              onPress={() => toggleArchive(item.id)}
            >
              <Text style={styles.archiveText}>Unarchive</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 10, color: "#666" }}>
            No archived posts yet
          </Text>
        }
        ListHeaderComponent={
          <>
            {/* ✅ Top bar */}
            <View style={styles.topBar}>
              <Ionicons name="home" size={22} />
              <Text style={styles.brand}>Veritas</Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  style={{ marginRight: 16 }}
                  onPress={() => router.push("/notifications")}
                >
                  <Ionicons name="notifications-outline" size={22} />
                </Pressable>

                <Pressable
                  style={{ marginRight: 16 }}
                  onPress={() => setMenuVisible(true)}
                >
                  <Ionicons name="menu-outline" size={26} />
                </Pressable>

                <Ionicons name="person-circle-outline" size={26} />
              </View>
            </View>

            {/* Prompt */}
            <Pressable
              style={styles.writeRow}
              onPress={() => router.push("/compose")}
            >
              <Ionicons name="create-outline" size={18} />
              <Text style={{ color: "#6b7280" }}>What do you want to verify?</Text>
            </Pressable>

            {/* Trending */}
            <Text style={styles.sectionTitle}>What do you want to browse?</Text>
            <FlatList
              horizontal
              data={TRENDING}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.trendCard}>
                  <Text style={styles.trendTitle}>{item.title}</Text>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              style={{ marginTop: 8 }}
            />

            {/* Section Title */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Your Posts</Text>
          </>
        }
        ListFooterComponent={
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <View style={styles.bigCard}>
              <Text style={styles.bigCardTitle}>Card 1</Text>
              <Text style={styles.bigCardText}>
                A larger promotional block or featured content area.
              </Text>
              <Link href="/compose" asChild>
                <Pressable style={styles.cta}>
                  <Text style={styles.ctaText}>Open composer</Text>
                </Pressable>
              </Link>
            </View>

            <View style={styles.bigCard}>
              <Text style={styles.bigCardTitle}>Card 2</Text>
              <Text style={styles.bigCardText}>
                Another content block underneath.
              </Text>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Chatbot */}
      <Chatbot />

      {/* Drawer Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
          <Menu
            onClose={() => setMenuVisible(false)}
            setShowLogout={setShowLogout}
          />
        </View>
      </Modal>

      {/* Logout Modal */}
      <LogoutModal visible={showLogout} onClose={() => setShowLogout(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  brand: { fontSize: 20, fontWeight: "700" },
  writeRow: {
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    marginTop: 6,
    marginLeft: 16,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  trendCard: {
    height: 120,
    width: 140,
    borderRadius: 14,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  trendTitle: { fontWeight: "700", textAlign: "center" },
  postCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  postText: { fontSize: 16, marginBottom: 8 },
  archiveBtn: {
    backgroundColor: "#111827",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  archiveText: { color: "#fff", fontWeight: "600" },
  bigCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  bigCardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  bigCardText: { color: "#374151", marginBottom: 12 },
  cta: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#111827",
  },
  ctaText: { color: "white", fontWeight: "600" },
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
