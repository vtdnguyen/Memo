import React, {
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ViewToken,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Friend } from "@/src/types/message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/Colors";
import CustomButton from "@/src/components/home/IconButton";
import { TabBarContext } from "./_layout";
import { router } from "expo-router";
import FriendModal from "@/src/components/modal/FriendModal";
import { formatTimeAgo, getUserProfileLink } from "@/src/hooks/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

// Mock data for posts
// const POSTS = [
//   {
//     id: '1',
//     imageUrl: 'https://picsum.photos/id/1/400/600',
//     user: {
//       name: 'Sarah Johnson',
//       avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
//     },
//     timePosted: '5m ago',
//     hashtag:'#2025'
//   },
//   {
//     id: '2',
//     imageUrl: 'https://picsum.photos/id/20/400/600',
//     user: {
//       name: 'Mike Chen',
//       avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//     },
//     timePosted: '20m ago',
//   },
//   {
//     id: '3',
//     imageUrl: 'https://picsum.photos/id/37/400/600',
//     user: {
//       name: 'Aisha Patel',
//       avatar: 'https://randomuser.me/api/portraits/women/66.jpg',
//     },
//     timePosted: '1h ago',
//   },
//   {
//     id: '4',
//     imageUrl: 'https://picsum.photos/id/42/400/600',
//     user: {
//       name: 'Carlos Rodriguez',
//       avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
//     },
//     timePosted: '2h ago',
//   },
// ];

// Types
interface Post {
  id: string;
  imageUrl: string;
  user: {
    name: string;
    avatar: string;
  };
  timePosted: string;
  hashtag?: string;
}

interface ViewableItemsChanged {
  viewableItems: Array<ViewToken>;
  changed: Array<ViewToken>;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ExploreScreen(): React.JSX.Element {
  const { hideTabBar, showTabBar } = useContext(TabBarContext);
  const user = useSelector((state: RootState) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<number>(3);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const [POSTS, setPOSTS] = useState<Post[]>([]);

  // Calculate the square image size (70% of screen width, maintaining 1:1 ratio)
  const imageSize = screenWidth * 1;

  // Calculate the total item height to ensure proper snapping
  // Each item takes the full screen height
  const itemHeight = screenHeight - insets.top - insets.bottom;

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("https://memo-app-be.onrender.com/post", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log("data", data);

      for (const post of data.data) {
        setPOSTS((prevPosts) => [
          ...prevPosts,
          {
            id: post.id,
            imageUrl: post.fileAttach.url,
            user: {
              name: post.owner.firstName + " " + post.owner.lastName,
              avatar: post.owner.avatar.url,
            },
            timePosted: formatTimeAgo(post.createdAt),
          },
        ]);
      }
    };
    fetchPosts();
  }, []);

  const onViewableItemsChanged = ({ viewableItems }: ViewableItemsChanged) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const openMessage = () => {
    hideTabBar();
    router.push("/(tabs)/(message)");
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View
      style={[
        styles.postContainer,
        { height: itemHeight, paddingTop: itemHeight / 4 },
      ]}
    >
      <View
        style={[styles.imageContainer, { width: imageSize, height: imageSize }]}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        <View style={styles.userInfoContainer}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View style={styles.userTextInfo}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <Text style={styles.timePosted}>{item.timePosted}</Text>
          </View>
        </View>
      </View>
      {item.hashtag && <Text style={styles.title}>{item.hashtag}</Text>}
    </View>
  );

  const fetchFriends = async () => {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const page = 1;
    const limit = 10;
    const keyword = "";
    const response = await fetch(
      `https://memo-app-be.onrender.com/friend?keyword=${keyword}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log("data friend: ", data);
    const friends: Friend[] = [];

    for (const friend of data.data) {
      const id = friend.friend.id;
      const name = friend.friend.username;
      const avatar = friend.friend.avatar.url;
      const unreadCount = 0;

      friends.push({ id, name, avatar, unreadCount });
    }

    return friends;

    // return [
    //   {
    //     id: 'friend1',
    //     name: 'Jane Smith',
    //     avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    //   },
    //   {
    //     id: 'friend2',
    //     name: 'John Doe',
    //     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    //   },
    //   {
    //     id: 'friend3',
    //     name: 'Alex Johnson',
    //     avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    //   },
    //   {
    //     id: 'friend4',
    //     name: 'Mike Wilson',
    //     avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    //   },
    //   {
    //     id: 'friend5',
    //     name: 'Sarah Parker',
    //     avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    //   },
    // ];
  };

  const fetchUserData = async (): Promise<{
    profileLink: string;
    userId: string;
  }> => {
    console.log("Explore: fetchUserData started");
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Explore: Current user state:", user);
    if (!user) {
      console.error("Explore: User not found in state");
      throw new Error("User not found");
    }

    const result = {
      profileLink: getUserProfileLink(user.username),
      userId: user.id,
    };
    console.log("Explore: Returning user data:", result);
    return result;
  };

  return (
    <View style={[styles.container]}>
      <StatusBar style="light" />

      {/* Main Content - Post Scroller */}
      <FlatList
        ref={flatListRef}
        data={POSTS}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        getItemLayout={(data, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
      />

      {/* Header */}
      <View style={styles.headerLeft}>
        <CustomButton
          text={"Bạn bè"}
          textColor={"#dfdfdf"}
          textStyle={{ fontSize: 20 }}
          iconName="user-friends"
          iconType="FontAwesome5"
          iconSize={22}
          iconColor={"#dfdfdf"}
          iconPosition="left"
          backgroundColor={"rgba(255, 255, 255, 0.1)"}
          borderRadius={30}
          onPress={() => {
            setModalVisible(true);
            hideTabBar();
          }}
          style={{ marginRight: 10, height: 50 }}
        />
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.messageButton} onPress={openMessage}>
          <Ionicons name="chatbubble-outline" size={36} color="#dfdfdf" />
          {/* {unreadMessages > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </Text>
            </View>
          )} */}
        </TouchableOpacity>
      </View>

      {/* Bottom Message Input */}
      <View
        style={[
          styles.messageInputContainer,
          { paddingBottom: insets.bottom + 70 },
        ]}
      >
        <TouchableOpacity style={styles.messageInputButton}>
          <Text style={styles.messageInputPlaceholder}>Send a message...</Text>
          <View style={styles.reactionContainer}>
            <MaterialIcons
              name="favorite"
              size={20}
              color="#FF4D67"
              style={styles.reactionIcon}
            />
            <MaterialIcons
              name="local-fire-department"
              size={20}
              color="#FF8A00"
              style={styles.reactionIcon}
            />
            <MaterialIcons
              name="emoji-emotions"
              size={20}
              color="#FFD600"
              style={styles.reactionIcon}
            />
          </View>
        </TouchableOpacity>
      </View>

      <FriendModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          showTabBar();
        }}
        fetchUserData={fetchUserData}
        fetchFriends={fetchFriends}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerLeft: {
    position: "absolute",
    top: 70,
    paddingHorizontal: 16,
  },
  headerRight: {
    position: "absolute",
    top: 70,
    right: 0,
    paddingHorizontal: 16,
  },
  friendButton: {
    padding: 8,
  },
  friendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  messageButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    right: -2,
    top: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF4D67",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  postContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: "#dfdfdf",
    fontStyle: "italic",
    paddingTop: 10,
  },
  imageContainer: {
    borderRadius: 50,
    elevation: 5,
    overflow: "hidden",
    position: "relative",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  userInfoContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "white",
  },
  userTextInfo: {
    marginLeft: 12,
  },
  userName: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  timePosted: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  messageInputContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    width: "100%",
    padding: 16,
  },
  messageInputButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    height: 60,
  },
  messageInputPlaceholder: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
  },
  reactionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  reactionIcon: {
    marginLeft: 8,
  },
});
