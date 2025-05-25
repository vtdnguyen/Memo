import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  SafeAreaView,
  StatusBar,
  Alert,
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from "react-native";
import axios from "axios";
import { API_URL } from "@/src/redux/slices/authSlice";
import { colors, styles } from "@/src/components/friend/styles";
import { Header } from "@/src/components/friend/header";
import { SearchBar } from "@/src/components/friend/searchBar";
import { Tabs } from "@/src/components/friend/tabs";
import { UserItem } from "@/src/components/friend/userItem";
import { RequestItem } from "@/src/components/friend/requestItem";
import { EmptyState } from "@/src/components/friend/emptyState";
import { FlatList, Text, TextStyle } from "react-native";

import moment from "moment";
import { FriendRequest } from "@/src/types/friend";
import { User } from "@/src/types/auth";
import { formatTimeAgo } from "@/src/hooks/helper";

interface FriendRequestScreenProps {
  onClose: () => void;
}

export const FriendRequestScreen: React.FC<FriendRequestScreenProps> = ({
  onClose,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<User[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"requests" | "sent">("requests");

  const searchAnim = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const listTranslateY = useRef(new Animated.Value(20)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const screenEntryAnim = useRef(new Animated.Value(0)).current;
  const searchBoxAnim = useRef(new Animated.Value(0)).current;

  const animationsInitialized = useRef(false);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");

    if (!animationsInitialized.current) {
      Animated.sequence([
        Animated.timing(screenEntryAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(listTranslateY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(listOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(searchBoxAnim, {
            toValue: 1,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      startPulseAnimation();
      startShimmerAnimation();
      animationsInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    Animated.spring(tabIndicatorPosition, {
      toValue: activeTab === "requests" ? 0 : 1,
      friction: 8,
      tension: 60,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const startShimmerAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (searchText.trim() === "") {
      setSearchResults([]);
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(searchAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    setLoading(true);
    const handlerFindFriend = async () => {
      try {
        let response = await axios.get(
          `${API_URL}/user?keyword=${searchText}&page=1&limit=10`,
          { withCredentials: true }
        );
        let result = response.data;

        if (result.data.length > 0) {
          result = result.data
            .filter(
              (u: User) =>
                u.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
                u.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
                u.username.toLowerCase().includes(searchText.toLowerCase())
            )
            .sort((a: User, b: User) => {
              const aNameMatch = a.firstName
                .toLowerCase()
                .indexOf(searchText.toLowerCase());
              const bNameMatch = b.firstName
                .toLowerCase()
                .indexOf(searchText.toLowerCase());

              if (aNameMatch >= 0 && bNameMatch >= 0) {
                return aNameMatch - bNameMatch;
              }
              return 0;
            });

          setSearchResults(result);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
        Animated.sequence([
          Animated.timing(listOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(listTranslateY, {
            toValue: 10,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(listOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(listTranslateY, {
              toValue: 0,
              friction: 6,
              tension: 50,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }
    };

    const timeoutId = setTimeout(() => {
      handlerFindFriend();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const sendRequest = (id: string) => {
    const buttonScale = new Animated.Value(1);

    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1.15,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const handlerSendRequest = async () => {
      let response = await axios.post(
        `${API_URL}/friend/request`,
        { receiverId: id },
        { withCredentials: true }
      );
      console.log("send request response", response.data);
    };
    handlerSendRequest();

    Alert.alert(
      "Đã gửi lời mời kết bạn",
      "Chúng tôi sẽ thông báo khi người dùng chấp nhận lời mời của bạn.",
      [{ text: "OK", style: "default" }]
    );
  };

  const handleAcceptRequest = async (id: string, userId: string) => {
    const response = await axios.post(
      `${API_URL}/friend/request/${id}`,
      { action: "accept" },
      { withCredentials: true }
    );
    console.log("accept request response", response);

    if (response.status === 201) {
      setReceivedRequests((prev) =>
        prev.filter((req) => req.sender.id !== userId)
      );

      Alert.alert(
        "Đã chấp nhận lời mời",
        "Người dùng đã được thêm vào danh sách bạn bè của bạn!",
        [{ text: "OK", style: "default" }]
      );

      const fadeAnim = new Animated.Value(1);
      const scaleAnim = new Animated.Value(1);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        console.log("accept request for id, userId:", id, userId);
      });
    }
  };

  const handleRejectRequest = async (id: string, userId: string) => {
    const response = await axios.post(
      `${API_URL}/friend/request/${id}`,
      { action: "reject" },
      { withCredentials: true }
    );
    console.log("reject request response", response);

    if (response.status === 201) {
      setReceivedRequests((prev) =>
        prev.filter((req) => req.sender.id !== userId)
      );

      Alert.alert(
        "Đã từ chối lời mời",
        "Người dùng đã từ chối lời mời của bạn!",
        [{ text: "OK", style: "default" }]
      );
      const scaleAnim = new Animated.Value(1);
      const moveAnim = new Animated.Value(0);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(moveAnim, {
          toValue: 500,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        console.log("reject request for id, userId:", id, userId);
      });
    }
  };

  const handleCancelRequest = async (id: string) => {
    // TODO: handle cancel request
    const scaleAnim = new Animated.Value(1);
    const rotateAnim = new Animated.Value(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSentRequests((prev) => prev.filter((req) => req.id !== id));
    });

    console.log("cancel request for id:", id);
  };

  useEffect(() => {
    const handlerGetSentRequests = async () => {
      let response = await axios.get(
        `${API_URL}/friend/request?collection=requests-sent&page=1&limit=10`,
        { withCredentials: true }
      );
      const pagination = response.data;
      const data = pagination.data;
      let users: User[] = [];
      for (const item of data) {
        const user = item.receiver as User;
        users.push(user);
      }
      console.log("sent requests response", users);
      setSentRequests(users);
    };
    handlerGetSentRequests();
  }, []);

  useEffect(() => {
    const handlerGetReceivedRequests = async () => {
      let response = await axios.get(
        `${API_URL}/friend/request?collection=requests-received&page=1&limit=10`,
        { withCredentials: true }
      );
      const pagination = response.data;
      const data = pagination.data;
      console.log("received requests response", data);

      let users: FriendRequest[] = [];
      for (const item of data) {
        console.log("item", item);

        const user = item.sender;
        const time = item.createdAt;
        const timeAgoText = formatTimeAgo(time);
        console.log("timeAgoText", timeAgoText);

        users.push({ id: item.id, sender: user, timeAgo: timeAgoText });
      }
      console.log("users", users);

      setReceivedRequests(users);
    };
    handlerGetReceivedRequests();
  }, []);

  const screenScale = screenEntryAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  return (
    <SafeAreaView style={styles.safeArea as StyleProp<ViewStyle>}>
      <Animated.View
        style={[
          styles.container as StyleProp<ViewStyle>,
          {
            opacity: screenEntryAnim,
            transform: [{ scale: screenScale }],
          },
        ]}
      >
        <Header
          onClose={onClose}
          receivedRequestsCount={receivedRequests.length}
        />
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          searchBoxAnim={searchBoxAnim}
        />
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          receivedRequestsCount={receivedRequests.length}
          sentRequestsCount={sentRequests.length}
          tabIndicatorPosition={tabIndicatorPosition}
          headerOpacity={headerOpacity}
        />
        {loading ? (
          <View style={styles.loadingContainer as StyleProp<ViewStyle>}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
          </View>
        ) : searchText.trim() !== "" ? (
          <Animated.View
            style={[
              styles.resultsContainer as StyleProp<ViewStyle>,
              { opacity: searchAnim },
            ]}
          >
            <Text style={styles.resultTitle}>
              Kết quả tìm kiếm
              <Text style={styles.resultCount}> ({searchResults.length})</Text>
            </Text>
            {searchResults.length === 0 ? (
              <EmptyState type="search" />
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <UserItem
                    item={item}
                    sentRequests={sentRequests}
                    listOpacity={listOpacity}
                    listTranslateY={listTranslateY}
                    handleCancelRequest={handleCancelRequest}
                    sendRequest={sendRequest}
                    receivedRequests={receivedRequests}
                    setReceivedRequests={setReceivedRequests}
                    setSentRequests={setSentRequests}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            )}
          </Animated.View>
        ) : activeTab === "requests" ? (
          <View style={styles.resultsContainer as StyleProp<ViewStyle>}>
            <Text style={styles.resultTitle}>
              Lời mời kết bạn
              <Text style={styles.resultCount}>
                {" "}
                ({receivedRequests.length})
              </Text>
            </Text>
            {receivedRequests.length === 0 ? (
              <EmptyState type="requests" />
            ) : (
              <FlatList
                data={receivedRequests}
                keyExtractor={(item) => item.sender.id}
                renderItem={({ item, index }) => (
                  <RequestItem
                    item={item}
                    index={index}
                    pulseAnim={pulseAnim}
                    onReject={handleRejectRequest}
                    onAccept={handleAcceptRequest}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        ) : (
          <View style={styles.resultsContainer as StyleProp<ViewStyle>}>
            <Text style={styles.resultTitle}>
              Lời mời đã gửi
              <Text style={styles.resultCount}> ({sentRequests.length})</Text>
            </Text>
            {sentRequests.length === 0 ? (
              <EmptyState type="sent" />
            ) : (
              <FlatList
                data={sentRequests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <UserItem
                    item={item}
                    sentRequests={sentRequests}
                    listOpacity={listOpacity}
                    listTranslateY={listTranslateY}
                    handleCancelRequest={handleCancelRequest}
                    sendRequest={sendRequest}
                    receivedRequests={receivedRequests}
                    setReceivedRequests={setReceivedRequests}
                    setSentRequests={setSentRequests}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};
