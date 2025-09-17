import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type LeaderboardItem = {
  id: string;
  rank: number;
  name: string;
  points: number;
};

export default function RewardsPage() {
  const balance = 300;

  const badges = [
    { id: "1", icon: "ribbon-outline" },
    { id: "2", icon: "ribbon-outline" },
    { id: "3", icon: "ribbon-outline" },
  ];

  const leaderboard: LeaderboardItem[] = [
    { id: "1", rank: 1, name: "Alice", points: 2000 },
    { id: "2", rank: 2, name: "Bob", points: 1500 },
    { id: "3", rank: 3, name: "Charlie", points: 1400 },
  ];

  const yourRank = { rank: 94, points: 125 };

  const renderLeaderboard = ({ item }: { item: LeaderboardItem }) => (
    <View
      style={[
        styles.row,
        item.rank === 1
          ? styles.firstPlace
          : item.rank === 2
          ? styles.secondPlace
          : item.rank === 3
          ? styles.thirdPlace
          : styles.otherPlaces,
      ]}
    >
      <Text style={styles.rank}>{item.rank}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.points}>{item.points} pts</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Coins */}
      <Text style={styles.sectionTitle}>Coins</Text>
      <View style={styles.balanceContainer}>
        {/* Circle placeholder for coin image */}
        <View style={styles.coinPlaceholder}>
          {/* Replace with Image later */}
          {/* Example: <Image source={require("../assets/coin.png")} style={styles.coinImage}/> */}
          <Ionicons name="logo-bitcoin" size={28} color="#007BFF" />
        </View>
        <Text style={styles.balance}>{balance}</Text>
      </View>

      {/* Badges */}
      <Text style={styles.sectionTitle}>Badges</Text>
      <View style={styles.badgesRow}>
        {badges.map((badge) => (
          <View key={badge.id} style={styles.badge}>
            <Ionicons name={badge.icon as any} size={28} color="#007BFF" />
          </View>
        ))}
      </View>

      {/* Leaderboard */}
      <Text style={styles.sectionTitle}>Leaderboard</Text>
      <View style={styles.table}>
        <FlatList
          data={leaderboard}
          renderItem={renderLeaderboard}
          keyExtractor={(item) => item.id}
        />
        <View style={[styles.row, styles.youRow]}>
          <Text style={styles.rank}>You:</Text>
          <Text style={styles.name}>#{yourRank.rank}</Text>
          <Text style={styles.points}>{yourRank.points} pts</Text>
        </View>
      </View>
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
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 10,
  },
  coinPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#02080eff",
  },
  coinImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  balance: {
    fontSize: 28,
    fontWeight: "700",
    marginLeft: 5,
    color: "black",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
    color: "#003366",
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
    gap: 20,
  },
  badge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6F0FF",
  },
  table: {
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#F8FBFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E6F0FF",
    borderRadius: 6,
  },
  rank: {
    width: 40,
    fontWeight: "700",
    color: "#003366",
  },
  name: {
    flex: 1,
    textAlign: "left",
    color: "#004080",
    fontWeight: "500",
  },
  points: {
    width: 90,
    textAlign: "right",
    fontWeight: "600",
    color: "#0059B3",
  },
  // Leaderboard colors
  firstPlace: {
    backgroundColor: "#CCE5FF",
  },
  secondPlace: {
    backgroundColor: "#D9ECFF",
  },
  thirdPlace: {
    backgroundColor: "#E6F2FF",
  },
  otherPlaces: {
    backgroundColor: "#F2F8FF",
  },
  youRow: {
    backgroundColor: "#B3D9FF",
    marginTop: 6,
    borderRadius: 6,
  },
});
