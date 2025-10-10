import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useProfileStore from "../store/useProfileStore"; // ✅ Import the global store

type LeaderboardItem = {
  id: string;
  name: string;
  points: number;
};

type Badge = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const RewardsPage: React.FC = () => {
  // ✅ Access global profile data from Zustand store
  const { profile } = useProfileStore();
  const { name, photo } = profile;

  const [balance, setBalance] = useState<number>(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    // ✅ Example mock data — replace with API later if needed
    setBalance(2600);
    setBadges([
      { id: "1", icon: "medal" },
      { id: "2", icon: "ribbon" },
      { id: "3", icon: "trophy" },
      { id: "4", icon: "star" },
    ]);
    setLeaderboard([
      { id: "1", name: "Alice", points: 2000 },
      { id: "2", name: "Bob", points: 1800 },
      { id: "3", name: "Charlie", points: 1600 },
      { id: "4", name: name || "You", points: 1200 },
    ]);
  }, [name]);

  // ✅ Renders leaderboard rows
  const renderLeaderboard = ({
    item,
    index,
  }: {
    item: LeaderboardItem;
    index: number;
  }) => (
    <View
      style={[
        styles.leaderboardRow,
        item.name === (name || "You") && styles.youRow,
      ]}
    >
      <Text
        style={[
          styles.rankText,
          item.name === (name || "You") && styles.youRankText,
        ]}
      >
        #{index + 1}
      </Text>
      <Text
        style={[styles.name, item.name === (name || "You") && styles.youName]}
      >
        {item.name}
      </Text>
      <Text
        style={[
          styles.points,
          item.name === (name || "You") && styles.youPoints,
        ]}
      >
        {item.points} pts
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ✅ Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={{ width: 70, height: 70, borderRadius: 35 }}
            />
          ) : (
            <Ionicons name="person-circle" size={70} color="#007BFF" />
          )}
        </View>

        <Text style={styles.username}>{name || "Mr. Explore"}</Text>
        <Text style={styles.level}>LEVEL 12</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Streak Days</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Gold</Text>
            <Text style={styles.statLabel}>Current League</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{balance / 1000}K</Text>
            <Text style={styles.statLabel}>Total Coins</Text>
          </View>
        </View>
      </View>

      {/* ✅ Badges Section */}
      <Text style={styles.sectionTitle}>Badges</Text>
      <View style={styles.badgesRow}>
        {badges.map((badge) => (
          <View key={badge.id} style={styles.badge}>
            <Ionicons name={badge.icon} size={30} color="#007BFF" />
          </View>
        ))}
      </View>

      {/* ✅ Leaderboard Section */}
      <Text style={styles.sectionTitle}>Leaderboard</Text>
      <FlatList
        data={leaderboard}
        renderItem={renderLeaderboard}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        style={styles.leaderboardList}
      />
    </View>
  );
};

export default RewardsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    marginBottom: 10,
  },
  username: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
  },
  level: {
    color: "#007BFF",
    fontSize: 14,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  statBox: {
    backgroundColor: "#F2F4F8",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statValue: {
    color: "#007BFF",
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: "#555",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  badge: {
    backgroundColor: "#F2F4F8",
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leaderboardList: {
    backgroundColor: "#F2F4F8",
    borderRadius: 12,
    padding: 10,
  },
  leaderboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  rankText: {
    color: "#666",
    fontWeight: "600",
  },
  name: {
    color: "#000",
    flex: 1,
    textAlign: "center",
    fontSize: 16,
  },
  points: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  youRow: {
    backgroundColor: "#E7F0FF",
    borderRadius: 10,
  },
  youRankText: {
    color: "#007BFF",
  },
  youName: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  youPoints: {
    color: "#007BFF",
  },
});
