import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
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

  const filteredItems = savedItems.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: SavedItem }) => (
    <TouchableOpacity style={styles.item}>
      <View style={styles.iconPlaceholder} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
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
        <View style={{ width: 24 }} />
      </View>

      {/* Search bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
      />

      {/* Saved Items List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No saved items found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* View All Button */}
      <TouchableOpacity style={styles.viewAllBtn}>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  searchBar: {
    backgroundColor: "#f0f2f7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#ddd",
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  },
  viewAllBtn: {
    backgroundColor: "#3578e5",
    padding: 14,
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  viewAllText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
