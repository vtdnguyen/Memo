import { colors } from "@/constants/Colors";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Clipboard,
  ToastAndroid,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import CoreModal from "./CoreModal";
import { Feather } from "@expo/vector-icons";

// Define the Friend interface
interface Friend {
  id: string;
  name: string;
  avatar: string;
}

// Define the props for the FriendModal component
interface FriendModalProps {
  visible: boolean;
  onClose: () => void;
  fetchUserData: () => Promise<{
    profileLink: string;
    userId: string;
  }>;
  fetchFriends: () => Promise<Friend[]>;
}

const FriendModal: React.FC<FriendModalProps> = ({
  visible,
  onClose,
  fetchUserData,
  fetchFriends,
}) => {
  // State for user data and friends
  const [userData, setUserData] = useState<{
    profileLink: string;
    userId: string;
  } | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load data when modal becomes visible
  useEffect(() => {
    const loadData = async () => {
      if (visible) {
        console.log("FriendModal: Starting to load data");
        setIsLoading(true);
        setError(null);

        try {
          console.log("FriendModal: Fetching user data and friends");
          // const [userDataResult, friendsResult] = await Promise.all([
          //   fetchUserData(),
          //   fetchFriends(),
          // ]);
          // console.log("FriendModal: Data fetched successfully", {
          //   userData: userDataResult,
          //   friends: friendsResult,
          // });
          const userDataResult = await fetchUserData();
          const friendsResult = await fetchFriends();

          setUserData(userDataResult);
          setFriends(friendsResult);
          console.log("userData: ", userDataResult);
          console.log("friends: ", friendsResult);
        } catch (err) {
          console.error("FriendModal: Error loading data:", err);
          setError("Failed to load data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [visible]);

  // Define a function to copy the profile link to clipboard
  const copyToClipboard = () => {
    if (userData?.profileLink) {
      Clipboard.setString(userData.profileLink);

      // Show toast on Android
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Profile link copied to clipboard!",
          ToastAndroid.SHORT
        );
      } else {
        // Show alert on iOS
        Alert.alert("Copied", "Profile link copied to clipboard!");
      }
    }
  };

  // Create the profile section component
  const ProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={{ flexDirection: "row" }}>
        <Feather
          name={"link"}
          size={24}
          style={{ paddingRight: 10, color: "white" }}
        />
        <Text style={styles.sectionTitle}>My Profile</Text>
      </View>
      {userData ? (
        <>
          <View style={styles.linkContainer}>
            <Text
              style={styles.linkText}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {userData.profileLink}
            </Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={copyToClipboard}
            >
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );

  // Create the friend list item component
  const FriendItem = ({ friend }: { friend: Friend }) => {
    console.log("friend: ", friend);
    return (
      <View style={styles.friendItem}>
        <Image source={{ uri: friend.avatar }} style={styles.avatar} />
        <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friend.name}</Text>
        <Text style={styles.friendId}>ID: {friend.id}</Text>
      </View>
    </View>
    );
  }

  // Create the friends list component
  const FriendsList = () => (
    <View style={styles.friendsListContainer}>
      <Text style={styles.sectionTitle}>My Friends</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading friends...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : friends.length === 0 ? (
        <Text style={styles.emptyListText}>
          You don't have any friends yet.
        </Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FriendItem friend={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.friendsList}
        />
      )}
    </View>
  );

  // Configure the single tab for CoreModal
  const tabs = [
    {
      key: "friends",
      title: "Friends",
      content: (
        <View style={styles.container}>
          <ProfileSection />
          <FriendsList />
        </View>
      ),
    },
  ];

  return (
    <CoreModal
      visible={visible}
      onClose={onClose}
      tabs={tabs}
      initialTab="friends"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  profileSection: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    minHeight: 120,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: colors.white,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: colors.white,
  },
  copyButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  copyButtonText: {
    color: "#FFF",
    fontWeight: "500",
    fontSize: 14,
  },
  userIdText: {
    fontSize: 14,
    color: colors.white,
  },
  friendsListContainer: {
    flex: 1,
  },
  friendsList: {
    paddingBottom: 20,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.bg,
  },
  friendInfo: {
    marginLeft: 12,
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
    marginBottom: 4,
  },
  friendId: {
    fontSize: 12,
    color: colors.white,
  },
  emptyListText: {
    textAlign: "center",
    paddingVertical: 20,
    color: colors.white,
    fontStyle: "italic",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.white,
  },
  errorText: {
    textAlign: "center",
    paddingVertical: 15,
    color: "#FF3B30",
    fontSize: 14,
  },
});

export default FriendModal;
