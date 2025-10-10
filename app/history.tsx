import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Image,
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
    {
      id: "1",
      title: "Fact checked: Climate change news",
      subtitle: "Aug 29",
      status: "true",
    },
    {
      id: "2",
      title: "Verified: Viral tweet",
      subtitle: "Aug 25",
      status: "false",
    },
    {
      id: "3",
      title: "Checked: Political claim",
      subtitle: "Aug 21",
      status: "pending",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "true" | "false" | "pending">("all");
  const [showFilter, setShowFilter] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current; // list animation
  const modalSlide = useRef(new Animated.Value(0)).current; // modal slide

  const filteredHistory =
    filter === "all" ? history : history.filter((item) => item.status === filter);

  // Animate list when filter changes
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [filter, history]);

  // Animate modal slide up/down
  useEffect(() => {
    Animated.timing(modalSlide, {
      toValue: showFilter ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [showFilter]);

  const clearHistory = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setHistory([]));
  };

  const getStatusDetails = (status: "true" | "false" | "pending") => {
    switch (status) {
      case "true":
        return { color: "#4CAF50", icon: "checkmark-circle", label: "True" };
      case "false":
        return { color: "#E53935", icon: "close-circle", label: "False" };
      case "pending":
        return { color: "#FFC107", icon: "time", label: "Pending" };
      default:
        return { color: "#ccc", icon: "help-circle", label: "Unknown" };
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const { color, icon, label } = getStatusDetails(item.status);
    return (
      <Animated.View
        style={{
          transform: [{ scale: fadeAnim }],
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.item}
        >
          <Ionicons name={icon as any} size={28} color={color} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          <View
            style={[styles.badge, { backgroundColor: color + "20" }]}
          >
            <Text style={[styles.badgeText, { color }]}>{label}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <TouchableOpacity
          onPress={() => setShowFilter(true)}
          style={styles.iconBtn}
        >
          <Ionicons name="filter-outline" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Sub-header */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>
          Claims verified in last 30 days
        </Text>
      </View>

      {/* Animated List */}
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        }}
      >
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/4076/4076509.png",
                }}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>No history found</Text>
              <Text style={styles.emptySubText}>
                Start verifying claims to see them here.
              </Text>
            </View>
          }
        />
      </Animated.View>

      {/* Clear button */}
      {history.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.clearBtnText}>Clear History</Text>
        </TouchableOpacity>
      )}

      {/* Animated Filter Modal */}
      <Modal
        visible={showFilter}
        transparent
        animationType="none"
        onRequestClose={() => setShowFilter(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowFilter(false)}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: modalSlide.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
                opacity: modalSlide,
              },
            ]}
          >
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
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 55,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  subHeader: {
    backgroundColor: "#f1f3f8",
    padding: 10,
    borderRadius: 10,
    marginBottom: 18,
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
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  emptySubText: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  clearBtn: {
    flexDirection: "row",
    backgroundColor: "#3578e5",
    padding: 14,
    borderRadius: 10,
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  clearBtnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
  },
  filterOption: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
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
