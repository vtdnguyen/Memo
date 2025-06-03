import React, {
  useState,
  useRef,
  useContext,
  // useCallback,
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
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  // ActivityIndicator,
  // ToastAndroid,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Friend, Post } from "@/src/types/message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/Colors";
import CustomButton from "@/src/components/home/IconButton";
import {  TabBarContext } from "./_layout";
import { router } from "expo-router";
import FriendModal from "@/src/components/modal/FriendModal";
import { formatTimeAgo, getUserProfileLink } from "@/src/hooks/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useSocketMessage } from "@/src/contexts/SocketContext";
import { useAppSelector } from "@/src/redux/hooks";
import { useImageContext } from "@/src/contexts/ImageContext";
import { API_URL } from "@/src/redux/slices/authSlice";
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

interface ViewableItemsChanged {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ExploreScreen(): React.JSX.Element {
  const { hideTabBar, showTabBar } = useContext(TabBarContext);
  const user = useSelector((state: RootState) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  // const [unreadMessages, setUnreadMessages] = useState<number>(3);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const [POSTS, setPOSTS] = useState<Post[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const handleAddEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
  };
  // const [receiverId, setReceiverId] = useState<string | null>(null);
  const { newPost, setNewPost } = useImageContext();
  const currentUser = useAppSelector((state: RootState) => state.auth.user);
  const socketMessage = useSocketMessage();
  // Calculate the square image size (70% of screen width, maintaining 1:1 ratio)
  const imageSize = screenWidth * 1;

  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
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

  // Calculate the total item height to ensure proper snapping
  // Each item takes the full screen height
  const itemHeight = screenHeight - insets.top - insets.bottom;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Start loading here
  
      try {
        const response = await fetch(`${API_URL}/post?limit=50`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
  
        const data = await response.json();
        console.log("data", data);
  
        const formatted = data.data.map((post: any) => ({
          id: post.id,
          imageUrl: post.fileAttach.url,
          user: {
            id: post.owner.id,
            name: post.owner.firstName + " " + post.owner.lastName,
            avatar: post.owner.avatar.url,
          },
          timePosted: formatTimeAgo(post.createdAt),
          title: post.title,
        }));
  
        setPOSTS(formatted);
        setNewPost(null);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []);
  



  // useEffect(() => {
  //   if (!(!POSTS.length || !POSTS[currentIndex]?.user?.id)) {
  //     setReceiverId(POSTS[currentIndex].user.id)
  //   }
  // }, [POSTS, currentIndex]);

  // if (!receiverId) {
  //   return <ActivityIndicator />
  // }

  const openMessage = () => {
    hideTabBar();
    router.push("/(tabs)/(message)/");
  };

  const renderPost = ({ item }: { item: Post }) => {
    // console.log("item", item);
    return (
      <View
        style={[
          styles.postContainer,
          { height: itemHeight, paddingTop: itemHeight / 5 },
        ]}
      >
        <View
          style={[
            styles.imageContainer,
            { width: imageSize, height: imageSize },
          ]}
        >
          <Image
            source={{ uri: item.imageUrl }}
            width={imageSize}
            height={imageSize}
            resizeMode="cover"
            style={styles.postImage}
          />
          <Text
            style={[
              styles.title,
              {
                left: screenWidth / 2,
                transform: [{ translateX: "-50%" }],
              },
            ]}
          >
            {item.title}
          </Text>
        </View>

        <View style={styles.userInfoContainer}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View style={styles.userTextInfo}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <Text style={styles.timePosted}>{item.timePosted}</Text>
          </View>
        </View>
        {/* {item.hashtag && <Text style={styles.title}>{item.hashtag}</Text>} */}
      </View>
    );
  };

  const fetchFriends = async () => {
    // Simulate network request
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const page = 1;
    const limit = 10;
    const keyword = "";
    const response = await fetch(
      `${API_URL}/friend?keyword=${keyword}&page=${page}&limit=${limit}`,
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
    // await new Promise((resolve) => setTimeout(resolve, 1000));

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

  console.log("current index", currentIndex);


  // const {
  //   messages,
  //   loading,
  //   error,
  //   sendMessage,
  //   isConnected,
  //   fetchMessages,
  //   setMessages,
  // } = useMessage(receiverId);

  const sendPostMessage = () => {
    if (messageText.trim() === "") return;
    console.log("messageText: ", messageText);

    const currentPost = POSTS[currentIndex];
    if (!currentPost || !user) return;

    // const newMessage: Message = {
    //   id: Date.now().toString(),
    //   content: messageText.trim(),
    //   sender: user,
    //   senderId: user.id,
    //   receiverId: currentPost.user.id,
    //   receiver: {
    //     id: currentPost.user.id,
    //     username: currentPost.user.name,
    //     avatarId: "temp",
    //     email: "",
    //     firstName: "",
    //     lastName: "",
    //     phoneNumber: "",
    //     avatar: {
    //       id: "temp",
    //       url: currentPost.user.avatar,
    //       name: "avatar",
    //       format: "image",
    //       key: "temp",
    //     },
    //   },
    //   createdAt: new Date().toISOString(),
    //   fileUri: currentPost.imageUrl,
    // };

    if (currentPost.user.id === currentUser?.id) {
      Alert.alert("Cảnh báo", "Không thể gửi tin cho chính bạn");
      return;
    }

    socketMessage?.emit("send-message", {
      receiverId: currentPost.user.id,
      content: messageText.trim(),
      // fileUri: currentPost.imageUrl,
    });
    socketMessage?.emit("send-message", {
      receiverId: currentPost.user.id,
      content: currentPost.imageUrl,
      // fileUri: currentPost.imageUrl,
    });

    // setMessages((prev: Message[]) => [...prev, newMessage]);

    setMessageText("");
    // ToastAndroid.show("Đã gửi tin nhắn", ToastAndroid.SHORT);
  };

    
  if (loading) {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  }

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
        <TouchableOpacity style={styles.messageButton} onPress={() => {
            openMessage()
            hideTabBar();
          }}>
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
      { (POSTS.length > 0 && POSTS[currentIndex].user.id !== user?.id) && <View
        style={[
          styles.messageInputContainer,
          keyboardOpen ? { bottom: Dimensions.get("window").height / 2  } : null
        ]}
      >
        <TouchableOpacity style={styles.messageInputButton} activeOpacity={1} onPress={() => { hideTabBar(); }}>
          <TextInput
            style={styles.messageInputPlaceholder}
            placeholder="Nói gì đi..."
            placeholderTextColor="gray"
            keyboardType="default"
            value={messageText}
            onChangeText={setMessageText}
          />

          <View style={styles.reactionContainer}>
            <TouchableOpacity onPress={() => handleAddEmoji("❤️")}>
              <MaterialIcons
                name="favorite"
                size={20}
                color="#FF4D67"
                style={styles.reactionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAddEmoji("🔥")}>
              <MaterialIcons
                name="local-fire-department"
                size={20}
                color="#FF8A00"
                style={styles.reactionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAddEmoji("😊")}>
              <MaterialIcons
                name="emoji-emotions"
                size={20}
                color="#FFD600"
                style={styles.reactionIcon}
              />
            </TouchableOpacity>
            <Ionicons
              name="send"
              size={24}
              onPress={sendPostMessage}
              style={{ paddingLeft: 10 }}
              color={messageText.trim() === "" ? "gray" : "cyan"}
            />
          </View>
        </TouchableOpacity>
      </View> }
      { POSTS.length === 0 ?
      <View
        style={{
          position: 'absolute',
          top: screenHeight / 2,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white' }}>Chưa có người bạn nào đăng ảnh</Text>
      </View> : null }

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
    position: "absolute",
    bottom: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 16,
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
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    position: "absolute",
    bottom: 184,
    left: 10,
    padding: 10,
    zIndex: 100,
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
    bottom: 120,
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
    color: "rgba(255, 255, 255, 1)",
    fontSize: 16,
    flex: 1,
    padding: 10,
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
