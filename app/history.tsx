import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type HistoryItem = {
  id: string;
  title: string;
  subtitle: string;
  status: "true" | "false" | "pending";
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: "1", title: "Fact checked: Climate change news", subtitle: "Aug 29", status: "true" },
    { id: "2", title: "Verified: Viral tweet", subtitle: "Aug 25", status: "false" },
    { id: "3", title: "Checked: Political claim", subtitle: "Aug 21", status: "pending" },
  ]);

  const [filter, setFilter] = useState<"all" | "true" | "false" | "pending">("all");
  const [showFilter, setShowFilter] = useState(false);

  const clearHistory = () => setHistory([]);

  const filteredHistory =
    filter === "all" ? history : history.filter((item) => item.status === filter);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity style={styles.item}>
      <View style={styles.iconPlaceholder} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#555" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <TouchableOpacity onPress={() => setShowFilter(true)}>
          <Ionicons name="filter-outline" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Sub-header */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>
          Claims verified in last 30 days
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No history found.</Text>
        }
      />

      {/* Clear button */}
      {history.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
          <Text style={styles.clearBtnText}>Clear history</Text>
        </TouchableOpacity>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilter(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowFilter(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Status</Text>

            {["all", "true", "false", "pending"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterOption,
                  filter === option && styles.filterSelected,
                ]}
                onPress={() => {
                  setFilter(option as any);
                  setShowFilter(false);
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === option && styles.filterTextSelected,
                  ]}
                >
                  {option === "all"
                    ? "All"
                    : option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  subHeader: {
    backgroundColor: "#f0f2f7",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  subHeaderText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
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
  clearBtn: {
    backgroundColor: "#3578e5",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  clearBtnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  filterOption: {
    paddingVertical: 12,
  },
  filterSelected: {
    backgroundColor: "#f0f2f7",
    borderRadius: 8,
  },
  filterText: {
    fontSize: 16,
    color: "#333",
  },
  filterTextSelected: {
    color: "#3578e5",
    fontWeight: "600",
  },
});
