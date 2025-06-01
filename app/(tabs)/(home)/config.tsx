import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  ToastAndroid,
  Dimensions,
} from "react-native";
import { useImageContext } from "@/src/contexts/ImageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  withTiming,
  useDerivedValue,
  Easing,
} from "react-native-reanimated";
import StatusRender from "@/src/hooks/StatusRender";
import axios from "axios";
import { API_URL } from "@/src/redux/slices/authSlice";
import { useDispatch } from "react-redux";
// import { completeOnboarding } from "@/src/redux/slices/onboardingSlice";
import * as FileSystem from "expo-file-system";
// import { ImageManipulator } from "expo-image-manipulator";

// Define proper types
interface Friend {
  id: string;
  name: string;
  avatar: string;
}

interface Group {
  id: string;
  name: string;
  avatar: string;
}

// Sample data - replace with your API fetching logic
// const sampleFriends: Friend[] = [
//   { id: '1', name: 'Minh', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
//   { id: '2', name: 'Linh', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
//   { id: '3', name: 'Nam', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
//   { id: '4', name: 'Hue', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
//   { id: '5', name: 'Tuan', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
// ];

// const sampleGroups: Group[] = [
//   { id: '1', name: 'Family', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
//   { id: '2', name: 'Coworkers', avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
//   { id: '3', name: 'School', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
//   { id: '4', name: 'Neighbors', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
// ];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Spring animation config for smoother animations
const SPRING_CONFIG = {
  damping: 12, // Increased damping for less oscillation
  stiffness: 100, // Moderate stiffness for responsive but smooth animation
  mass: 0.8, // Slightly lower mass for quicker movement
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

// Color transition config
const COLOR_TIMING_CONFIG = {
  duration: 250,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export default function ConfigScreen(): React.ReactNode {
  const router = useRouter();
  const {
    capturedImage,
    selectedStatus,
    selectedHashtag,
    setNewPost,
    clearAll,
  } = useImageContext();
  const insets = useSafeAreaInsets();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [everyoneSelected, setEveryoneSelected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // Move navigation logic to useEffect - this fixes the setState during render problem
  useEffect(() => {
    if (!capturedImage) {
      router.push("/(tabs)/(home)/");
    }
  }, [capturedImage, router]);

  // Keep track of previous selections to detect changes
  const prevSelectedFriends = useRef<string[]>([]);
  const prevSelectedGroups = useRef<string[]>([]);
  const prevEveryoneSelected = useRef<boolean>(false);

  // Reference to hold items that need animation
  const animatingItems = useRef<Set<string>>(new Set());

  // Update animating items when selections change
  useEffect(() => {
    // Find newly selected friends
    selectedFriends.forEach((id) => {
      if (!prevSelectedFriends.current.includes(id)) {
        animatingItems.current.add(`friend-${id}`);
      }
    });

    // Find newly deselected friends
    prevSelectedFriends.current.forEach((id) => {
      if (!selectedFriends.includes(id)) {
        animatingItems.current.add(`friend-${id}`);
      }
    });

    // Keep track of current selection for next comparison
    prevSelectedFriends.current = [...selectedFriends];

    // Clean animation flags after a delay - extended time for smoother feel
    const timer = setTimeout(() => {
      animatingItems.current = new Set();
    }, 100); // Increased from 300ms

    return () => clearTimeout(timer);
  }, [selectedFriends]);

  // Similar effect for groups
  useEffect(() => {
    // Find newly selected/deselected groups
    selectedGroups.forEach((id) => {
      if (!prevSelectedGroups.current.includes(id)) {
        animatingItems.current.add(`group-${id}`);
      }
    });

    prevSelectedGroups.current.forEach((id) => {
      if (!selectedGroups.includes(id)) {
        animatingItems.current.add(`group-${id}`);
      }
    });

    prevSelectedGroups.current = [...selectedGroups];

    const timer = setTimeout(() => {
      animatingItems.current = new Set();
    }, 100); // Increased from 300ms

    return () => clearTimeout(timer);
  }, [selectedGroups]);

  // Effect for everyone selection
  useEffect(() => {
    if (everyoneSelected !== prevEveryoneSelected.current) {
      animatingItems.current.add("everyone");
      prevEveryoneSelected.current = everyoneSelected;

      const timer = setTimeout(() => {
        animatingItems.current = new Set();
      }, 100); // Increased from 300ms

      return () => clearTimeout(timer);
    }
  }, [everyoneSelected]);

  // Improved Friend Item component with better animations
  const FriendItem = ({
    friend,
    isSelected,
    onPress,
  }: {
    friend: Friend;
    isSelected: boolean;
    onPress: () => void;
  }) => {
    const scale = useSharedValue(isSelected ? 1.2 : 1);
    const borderColorValue = useSharedValue(isSelected ? 1 : 0);
    const itemId = `friend-${friend.id}`;

    // Use derived value for smoother transitions
    const animatedBorderColor = useDerivedValue(() => {
      return interpolateColor(
        borderColorValue.value,
        [0, 1],
        ["#888888", colors.primary]
      );
    });

    // Only animate when selection changes
    useEffect(() => {
      // Animate color transition with timing for smooth effect
      borderColorValue.value = withTiming(
        isSelected ? 1 : 0,
        COLOR_TIMING_CONFIG
      );

      // Determine if we should animate this transition
      const shouldAnimate = animatingItems.current.has(itemId);

      if (shouldAnimate) {
        // Use optimized spring configuration
        scale.value = withSpring(isSelected ? 1.2 : 1, SPRING_CONFIG);
      } else {
        // Direct value assignment for items previously selected
        scale.value = isSelected ? 1.2 : 1;
      }
    }, [isSelected]);

    // Animated styles using derived values
    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
        borderColor: animatedBorderColor.value,
      };
    }, []);

    return (
      <TouchableOpacity
        style={styles_fix.friendContainer}
        onPress={onPress}
        activeOpacity={0.8} // Improved tactile feedback
      >
        <Animated.View style={[styles_fix.avatarRing, animatedStyles]}>
          <Image source={{ uri: friend.avatar }} style={styles_fix.avatar} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Improved Everyone button with animation
  const EveryoneButton = ({
    isSelected,
    onPress,
  }: {
    isSelected: boolean;
    onPress: () => void;
  }) => {
    const scale = useSharedValue(isSelected ? 1.2 : 1);
    const borderColorValue = useSharedValue(isSelected ? 1 : 0);

    // Use derived value for smoother color transitions
    const animatedBorderColor = useDerivedValue(() => {
      return interpolateColor(
        borderColorValue.value,
        [0, 1],
        ["#888888", colors.primary]
      );
    });

    useEffect(() => {
      // Smooth color transition
      borderColorValue.value = withTiming(
        isSelected ? 1 : 0,
        COLOR_TIMING_CONFIG
      );

      if (animatingItems.current.has("everyone")) {
        scale.value = withSpring(isSelected ? 1.2 : 1, SPRING_CONFIG);
      } else {
        scale.value = isSelected ? 1.2 : 1;
      }
    }, [isSelected]);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
        borderColor: animatedBorderColor.value,
      };
    }, []);

    console.log("friends", friends);

    return (
      <TouchableOpacity
        style={styles_fix.friendContainer}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles_fix.avatarRing, animatedStyles]}>
          <View style={styles_fix.everyoneAvatar}>
            <FontAwesome5 name="users" size={18} color={colors.white} />
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Improved Group item with animation
  const GroupItem = ({
    group,
    isSelected,
    onPress,
  }: {
    group: Group;
    isSelected: boolean;
    onPress: () => void;
  }) => {
    const scale = useSharedValue(isSelected ? 1.1 : 1);
    const borderColorValue = useSharedValue(isSelected ? 1 : 0);
    const itemId = `group-${group.id}`;

    // Use derived value for smoother transitions
    const animatedBorderColor = useDerivedValue(() => {
      return interpolateColor(
        borderColorValue.value,
        [0, 1],
        ["#888888", colors.primary]
      );
    });

    useEffect(() => {
      // Smooth color transition
      borderColorValue.value = withTiming(
        isSelected ? 1 : 0,
        COLOR_TIMING_CONFIG
      );

      if (animatingItems.current.has(itemId)) {
        scale.value = withSpring(isSelected ? 1.1 : 1, SPRING_CONFIG);
      } else {
        scale.value = isSelected ? 1.1 : 1;
      }
    }, [isSelected]);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
        borderColor: animatedBorderColor.value,
      };
    }, []);

    return (
      <TouchableOpacity
        style={styles_fix.friendContainer}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles_fix.groupAvatarRing, animatedStyles]}>
          <Image
            source={{ uri: group.avatar }}
            style={styles_fix.groupAvatar}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Simulate API fetch
  useEffect(() => {
    // Replace this with actual API calls
    // const fetchData = async (): Promise<void> => {
    //   try {
    //     // Simulate network delay
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     setFriends(sampleFriends);
    //     setGroups(sampleGroups);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchData();

    const fetchFriends = async () => {
      const page = 1;
      const limit = 10;
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
      for (const friend of response.data.data) {
        console.log("friend", friend);

        setFriends((prev) => [
          ...prev,
          {
            id: friend.friend.id,
            name: friend.friend.username,
            avatar: friend.friend.avatar.url,
            unreadCount: 0,
          },
        ]);
      }
    };
    fetchFriends();
  }, []);

  const toggleEveryoneSelection = (): void => {
    if (everyoneSelected) {
      // If 'Everyone' is already selected, deselect it
      setEveryoneSelected(false);
    } else {
      // If 'Everyone' is selected, clear other selections
      setEveryoneSelected(true);
      setSelectedFriends([]);
    }
  };

  const toggleFriendSelection = (friendId: string): void => {
    // If a specific friend is selected, make sure "Everyone" is off
    if (everyoneSelected) {
      setEveryoneSelected(false);
    }

    // Toggle the selected friend
    const newSelection = [...selectedFriends];
    if (newSelection.includes(friendId)) {
      setSelectedFriends(newSelection.filter((id) => id !== friendId));
    } else {
      newSelection.push(friendId);
      setSelectedFriends(newSelection);
    }
  };

  const toggleGroupSelection = (groupId: string): void => {
    const newSelection = [...selectedGroups];
    if (newSelection.includes(groupId)) {
      setSelectedGroups(newSelection.filter((id) => id !== groupId));
    } else {
      newSelection.push(groupId);
      setSelectedGroups(newSelection);
    }
  };

  const sendPicture = async () => {
    if (!capturedImage) {
      Alert.alert("Lỗi", "Không tìm thấy ảnh");
      return;
    }
  
    try {
      setLoading(true);
  
      // Kiểm tra kích thước file trước khi upload
      const fileInfo = await FileSystem.getInfoAsync(capturedImage);
      console.log('File info:', fileInfo);
      
      if (fileInfo.exists && fileInfo.size && fileInfo.size > MAX_FILE_SIZE) {
        Alert.alert("Lỗi", "Kích thước ảnh không được vượt quá 5MB");
        setLoading(false);
        return;
      }
  
      // Tạo FormData cho React Native
      const formData = new FormData();
      
      // Thêm file vào FormData - cách đúng cho React Native
      formData.append('file', {
        uri: capturedImage,
        type: 'image/jpeg', // hoặc 'image/png' tùy theo file
        name: 'image.jpg',
      } as any);
  
      // Thêm title nếu có
      if (title !== "") {
        formData.append("title", title);
      }
  
      console.log("FormData content:", {
        uri: capturedImage,
        title: title,
      });
  
      // Gửi request
      const response = await axios.post(`${API_URL}/post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Không cần set boundary manually, axios sẽ tự động set
        },
        withCredentials: true,
        timeout: 30000, // 30 seconds timeout
      });
  
      console.log("Upload response:", response.data);
  
      setNewPost(capturedImage);
      clearAll();
      
      // Hiển thị thông báo thành công
      ToastAndroid.show("Đã gửi thành công!", ToastAndroid.SHORT);
      
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1000);
  
    } catch (error: any) {
      console.error("Upload Error:", error);
      
      let errorMessage = "Không thể tải ảnh lên. Vui lòng thử lại";
      
      if (error.response) {
        // Server responded with error status
        console.log("Error response:", error.response.data);
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        console.log("Network error:", error.request);
        errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra internet";
      } else {
        // Something else happened
        console.log("Other error:", error.message);
      }
      
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("capturedImage", capturedImage);
    setLoading(false);
  }, [capturedImage]);

  // Render loading state if data is still loading
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar style="light" />

      <View style={[styles.topRow, { paddingBottom: 20 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={34} color={colors.primary} />
        </TouchableOpacity>
        {/* <Text style={styles_fix.title}>#{selectedHashtag}</Text> */}
        <TouchableOpacity
          onPress={() => {
            sendPicture();
          }}
        >
          <Feather name="send" size={34} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.previewContainer, { width: '100%', maxHeight: screenWidth }]}>
        <Image
          source={{ uri: capturedImage as string }}
          style={styles.camera}
          resizeMode="cover"
        />
        {selectedStatus && (
          <View style={styles_fix.statusButton}>
            <StatusRender statusName={selectedStatus.name} onPress={() => {}} />
          </View>
        )}
        {/* <TouchableOpacity
          onPress={() => router.push("/(tabs)/(home)/edit")}
          style={styles_fix.editButton}
        >
          <Feather name="edit" size={44} color={colors.white} />
        </TouchableOpacity> */}
      </View>

      {/* <View style={styles_fix.chooseSharing}>
        <Text style={styles_fix.shareText}>Chia sẻ với</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles_fix.scrollContainer}
          contentContainerStyle={styles_fix.scrollContent}
        >
          <EveryoneButton
            isSelected={everyoneSelected}
            onPress={toggleEveryoneSelection}
          />

          {friends.map((friend: Friend) => (
            <FriendItem
              key={friend.id}
              friend={friend}
              isSelected={selectedFriends.includes(friend.id)}
              onPress={() => toggleFriendSelection(friend.id)}
            />
          ))}
        </ScrollView>

        <Text style={styles_fix.shareText}>hoặc nhóm:</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles_fix.scrollContainer}
          contentContainerStyle={styles_fix.scrollContent}
        >
          {groups.map((group: Group) => (
            <GroupItem
              key={group.id}
              group={group}
              isSelected={selectedGroups.includes(group.id)}
              onPress={() => toggleGroupSelection(group.id)}
            />
          ))}
        </ScrollView>
      </View> */}

      <TextInput
        style={styles_fix.input}
        placeholder="Nhập tiêu đề..."
        placeholderTextColor={colors.grey}
        value={title}
        onChangeText={setTitle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
    marginBottom: 80,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 40
  },
  camera: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  editButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

const styles_fix = StyleSheet.create({
  title: {
    fontSize: 20,
    color: colors.white,
    fontStyle: "italic",
  },
  editButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  statusButton: {
    position: "absolute",
    top: 15,
    left: 15,
  },
  chooseSharing: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    width: "100%",
    maxHeight: "30%",
  },
  shareText: {
    fontSize: 20,
    color: colors.white,
    marginBottom: 10,
    marginLeft: 5,
  },
  scrollContainer: {
    flexGrow: 0,
    marginBottom: 15,
    paddingVertical: 5,
    maxHeight: 100,
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  friendContainer: {
    marginRight: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarRing: {
    width: 40,
    height: 40,
    borderRadius: 25,
    padding: 3,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#888888",
    justifyContent: "center",
    alignItems: "center",
  },
  groupAvatarRing: {
    width: 60,
    height: 40,
    borderRadius: 10,
    padding: 3,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#888888",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRing: {
    borderColor: colors.primary,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  everyoneAvatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  groupAvatar: {
    width: 50,
    height: 30,
    borderRadius: 7,
  },
  input: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    color: colors.black,
    marginHorizontal: 20,
    marginTop: 60,
  },
});
