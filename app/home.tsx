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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, AnimatePresence } from "moti";

import Menu from "../Components/Menu";
import LogoutModal from "../Components/LogoutModal";
import RatingModal from "../Components/RatingModal";
import Chatbot from "../Components/Chatbot";
import useProfileStore from "../store/useProfileStore";

const CATEGORIES = [
  { id: "c1", title: "Trending", icon: "flame-outline", color: "#8A2BE2" },
  { id: "c2", title: "Sports", icon: "football-outline", color: "#7B68EE" },
  { id: "c3", title: "Technology", icon: "hardware-chip-outline", color: "#9370DB" },
  { id: "c4", title: "Entertainment", icon: "film-outline", color: "#9B59B6" },
  { id: "c5", title: "Science", icon: "planet-outline", color: "#663399" },
];

interface Post {
  id: string;
  content: string;
  archived: boolean;
}

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showRating, setShowRating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null); // ✅ For highlighting

  const { profile } = useProfileStore();

  useEffect(() => {
    const loadPosts = async () => {
      const stored = await AsyncStorage.getItem("user_posts");
      if (stored) {
        setPosts(JSON.parse(stored));
      } else {
        const dummy: Post[] = [
          { id: "1", content: "Breaking: New AI tech trends 🤖", archived: false },
          { id: "2", content: "Sports update: Underdog victory 🏆", archived: false },
          { id: "3", content: "Community thoughts: React Native tips 📱", archived: false },
        ];
        setPosts(dummy);
        await AsyncStorage.setItem("user_posts", JSON.stringify(dummy));
      }
    };
    loadPosts();
  }, []);

  const toggleArchive = async (id: string) => {
    const updated = posts.map((p) =>
      p.id === id ? { ...p, archived: !p.archived } : p
    );
    setPosts(updated);
    await AsyncStorage.setItem("user_posts", JSON.stringify(updated));
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowRating(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Example navigation — you can adjust this route
    router.push(`/category/${categoryId}`);
    setTimeout(() => setActiveCategory(null), 400); // reset highlight
  };

  const renderHeader = () => (
    <>
      {/* 🔮 Gradient Top Bar */}
      <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }}>
        <LinearGradient colors={["#4B0082", "#8A2BE2"]} style={styles.topBar}>
          <Text style={styles.brand}> Veritas</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              style={{ marginRight: 16 }}
              onPress={() => router.push("/notifications")}
            >
              <Ionicons name="notifications-outline" size={22} color="#EAEAEA" />
            </Pressable>

            <Pressable
              style={{ marginRight: 16 }}
              onPress={() => setMenuVisible(true)}
            >
              <Ionicons name="menu-outline" size={26} color="#EAEAEA" />
            </Pressable>

            <Image
              source={{
                uri:
                  profile?.photo ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              style={styles.avatar}
            />
          </View>
        </LinearGradient>
      </MotiView>

      {/* 💬 Prompt */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500, delay: 200 }}
      >
        <Pressable
          style={styles.writeRow}
          onPress={() => router.push("/compose")}
        >
          <Ionicons name="create-outline" size={18} color="#B197FC" />
          <Text style={{ color: "#D1C4E9", marginLeft: 8 }}>
            What do you want to verify today?
          </Text>
        </Pressable>
      </MotiView>

      {/* 🌐 Full-Width Browse Section */}
      <Text style={styles.sectionTitle}>Browse Categories</Text>
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((item, index) => {
          const isActive = activeCategory === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => handleCategoryPress(item.id)}
              onPressIn={() => setActiveCategory(item.id)}
              onPressOut={() => setActiveCategory(null)}
            >
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: isActive ? 1.1 : 1,
                  shadowOpacity: isActive ? 0.9 : 0.6,
                }}
                transition={{ type: "timing", duration: 200 }}
                style={[
                  styles.categoryBox,
                  {
                    backgroundColor: item.color,
                    shadowColor: isActive ? "#D8B4FE" : "#8A2BE2",
                  },
                ]}
              >
                <Ionicons name={item.icon as any} size={28} color="white" />
                <Text style={styles.categoryText}>{item.title}</Text>
              </MotiView>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
        Trending News & Community Posts
      </Text>
      <Text style={styles.subText}>
        The more you engage, the more your posts get seen 👀
      </Text>
    </>
  );

  const renderFooter = () => (
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 600 }}>
      <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
        <View style={styles.bigCard}>
          <Text style={styles.bigCardTitle}>⭐ Stay Active</Text>
          <Text style={styles.bigCardText}>
            Interact more to climb the community spotlight!
          </Text>
          <Link href="/compose" asChild>
            <Pressable style={styles.cta}>
              <Text style={styles.ctaText}>Create Post</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </MotiView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f1a" }}>
      <FlatList
        data={posts.filter((p) => !p.archived)}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400, delay: index * 120 }}
          >
            <View style={styles.postCard}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{
                    uri:
                      profile?.photo ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                  }}
                  style={styles.postAvatar}
                />
                <Text style={styles.postUser}>
                  {profile?.name || "CommunityUser"}
                </Text>
              </View>

              <Text style={styles.postText}>{item.content}</Text>

              <View style={styles.postActions}>
                <Pressable>
                  <Ionicons name="heart-outline" size={20} color="#9B59B6" />
                </Pressable>
                <Pressable style={{ marginLeft: 16 }}>
                  <Ionicons name="chatbubble-outline" size={20} color="#8A2BE2" />
                </Pressable>
                <Pressable
                  style={{ marginLeft: "auto" }}
                  onPress={() => toggleArchive(item.id)}
                >
                  <Ionicons name="archive-outline" size={20} color="#EAEAEA" />
                </Pressable>
              </View>
            </View>
          </MotiView>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 10, color: "#AAA" }}>
            No posts yet
          </Text>
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

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
          <Menu onClose={() => setMenuVisible(false)} setShowLogout={setShowLogout} />
        </View>
      </Modal>

      <LogoutModal visible={showLogout} onClose={() => setShowLogout(false)} />
      <RatingModal visible={showRating} onClose={() => setShowRating(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { fontSize: 20, fontWeight: "700", color: "#EAEAEA" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#B197FC",
  },
  writeRow: {
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#2E2E3A",
    borderRadius: 12,
    backgroundColor: "#1C1C2A",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    marginTop: 6,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#EAEAEA",
  },
  subText: {
    marginLeft: 16,
    color: "#B197FC",
    fontSize: 13,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 10,
  },
  categoryBox: {
    width: "48%",
    height: 110,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#8A2BE2",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  categoryText: {
    color: "white",
    fontWeight: "700",
    marginTop: 8,
    fontSize: 15,
  },
  postCard: {
    backgroundColor: "#1C1C2A",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2E2E3A",
    shadowColor: "#8A2BE2",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  postAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  postUser: { fontWeight: "600", fontSize: 14, color: "#DADADA" },
  postText: { fontSize: 15, marginVertical: 10, color: "#EAEAEA" },
  postActions: { flexDirection: "row", alignItems: "center" },
  bigCard: {
    backgroundColor: "#1C1C2A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2E2E3A",
    marginBottom: 16,
  },
  bigCardTitle: { fontSize: 18, fontWeight: "700", color: "#EAEAEA" },
  bigCardText: { color: "#B8B8B8", marginBottom: 12 },
  cta: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#8A2BE2",
  },
  ctaText: { color: "white", fontWeight: "600" },
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
