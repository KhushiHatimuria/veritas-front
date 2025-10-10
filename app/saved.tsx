import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type SavedItem = {
  id: string;
  title: string;
  subtitle: string;
};

export default function SavedPage() {
  const [search, setSearch] = useState("");
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    { id: "1", title: "Climate change article", subtitle: "Aug 28" },
    { id: "2", title: "Political fact check", subtitle: "Aug 26" },
    { id: "3", title: "Viral tweet verification", subtitle: "Aug 25" },
  ]);

  // Filter items
  const filteredItems = savedItems.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  // Handle deleting item
  const handleDelete = (id: string) => {
    Alert.alert("Remove Item", "Do you want to remove this saved item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setSavedItems((prev) => prev.filter((i) => i.id !== id)),
      },
    ]);
  };

  // Render each card
  const renderItem = ({ item }: { item: SavedItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/details/${item.id}`)} // navigate to details page
      onLongPress={() => handleDelete(item.id)} // hold to delete
    >
      <View style={styles.iconContainer}>
        <Ionicons name="bookmark" size={22} color="#3578e5" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#aaa" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved</Text>
        <Ionicons name="bookmark" size={22} color="#3578e5" />
      </View>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color="#666" style={{ marginLeft: 8 }} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search saved items"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Saved Items List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={60} color="#bbb" />
            <Text style={styles.emptyText}>No saved items yet.</Text>
            <Text style={styles.emptySubText}>Your saved articles will appear here.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* View All Button */}
      {savedItems.length > 0 && (
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/saved/all")}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f7",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    fontSize: 14,
    marginLeft: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#e9f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#777",
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },
  viewAllBtn: {
    backgroundColor: "#3578e5",
    padding: 16,
    borderRadius: 12,
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    elevation: 3,
  },
  viewAllText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
