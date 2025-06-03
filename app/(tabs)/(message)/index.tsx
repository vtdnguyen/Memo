import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  Keyboard,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Friend } from "@/src/types/message";
import { TabBarContext } from "../_layout";
import { colors } from "@/constants/Colors";
import axios from "axios";
import { API_URL } from "@/src/redux/slices/authSlice";

// Mock data for friends with messages
// const mockFriends: Friend[] = [
//   {
//     id: "1",
//     name: "Sarah Johnson",
//     avatar: "https://randomuser.me/api/portraits/women/1.jpg",
//     unreadCount: 2,
//   },
//   {
//     id: "2",
//     name: "Mike Chen",
//     avatar: "https://randomuser.me/api/portraits/men/1.jpg",
//     unreadCount: 0,
//   },
//   {
//     id: "3",
//     name: "Emma Wilson",
//     avatar: "https://randomuser.me/api/portraits/women/2.jpg",
//     unreadCount: 1,
//   },
//   {
//     id: "4",
//     name: "Alex Rodriguez",
//     avatar: "https://randomuser.me/api/portraits/men/2.jpg",
//     unreadCount: 0,
//   },
//   {
//     id: "5",
//     name: "Lisa Taylor",
//     avatar: "https://randomuser.me/api/portraits/women/3.jpg",
//     unreadCount: 3,
//   },
// ];

export default function MessageScreen() {
  const insets = useSafeAreaInsets();
  const { setTabBarVisible, isVisible, showTabBar } =
    useContext(TabBarContext);
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const pathname = usePathname();
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setTabBarVisible(false);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      if (!pathname.includes("/message")) {
        setTabBarVisible(true);
      }
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [pathname, setTabBarVisible]);

  console.log("isVisible", isVisible);

  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    try {
    const fetchFriends = async () => {
      // setLoading(true)
      const page = 1;
      const limit = 20;
      const keyword = "";
      const response = await axios.get(
        `${API_URL}/friend?page=${page}&limit=${limit}&keyword=${keyword}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const newFriends = response.data.data.map((friend: any) => ({
        id: friend.friend.id,
        name: friend.friend.username,
        avatar: friend.friend.avatar.url,
        unreadCount: 0, // TODO: chỉnh database lưu chưa đọc
      }));
      
      setFriends((prev) => [...prev, ...newFriends]);
    };
    fetchFriends();
  } catch (e) {
    console.log(e);
    
  } finally {
    setLoading(false)
  }
  }, []);

  const handleFriendPress = (friend: Friend) => {
    console.log("friend press: ", friend);

    router.push({
      pathname: "/(tabs)/(message)/[id]",
      params: { id: friend.id, name: friend.name, avatar: friend.avatar },
    });
  };

  const handleBack = () => {
    showTabBar();
    router.back();
  };

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => handleFriendPress(item)}
    >
      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.friendContainer} activeOpacity={0.8}>
          <View
            style={[
              styles.avatarRing,
              item.unreadCount > 0
                ? { borderColor: colors.primary }
                : { borderColor: "#888888" },
            ]}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.messageInfo}>
        <View style={styles.nameTimeRow}>
          <Text style={styles.friendName}>{item.name}</Text>
          <TouchableOpacity>
            <Feather name="chevron-right" size={28} color={colors.textCol} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // const showTabBar = useCallback(() => {
  //   console.log("showTabBar called");
  //   setTabBarVisible(true);
  // }, [setTabBarVisible]);

  const hideTabBar = useCallback(() => {
    console.log("hideTabBar called");
    setTabBarVisible(false);
  }, [setTabBarVisible]);

  useEffect(() => {
    hideTabBar();
    // return () => {
    //   showTabBar();
    // };
  }, [hideTabBar,]);

  if (loading) {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textCol} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
        <View style={styles.headerRight} />
      </View>

      { friends.length > 0 ?

        <FlatList
          data={friends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        /> : ( !loading && 
        <View
          style={{
            position: 'absolute',
            top: screenHeight / 2,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white' }}>Tìm thêm bạn mới đi</Text>
        </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.textCol,
  },
  backButton: {
    padding: 5,
  },
  headerRight: {
    width: 24,
  },
  listContainer: {
    paddingVertical: 8,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
  },
  unreadText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  messageInfo: {
    flex: 1,
  },
  nameTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  friendContainer: {
    marginRight: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textCol,
  },
  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 3,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#888888",
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    color: "#888",
  },
  lastMessage: {
    fontSize: 14,
    color: "#888",
  },
  unreadMessage: {
    color: "#000",
    fontWeight: "500",
  },
});
