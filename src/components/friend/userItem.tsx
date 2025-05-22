import React from "react";
import { View, Text, Image, TouchableOpacity, Animated, StyleProp, ViewStyle, ImageStyle, TextStyle } from "react-native";
import { defaultAvatar } from "@/constants/images";
import { colors, styles } from "./styles";

import { User } from "@/src/types/auth";
import { FriendRequest } from "@/src/types/friend";

interface UserItemProps {
  item: User;
  sentRequests: User[];
  listOpacity: Animated.Value;
  listTranslateY: Animated.Value;
  handleCancelRequest: (id: string) => void;
  sendRequest: (id: string) => void;
  setSentRequests: React.Dispatch<React.SetStateAction<User[]>>;
  receivedRequests: FriendRequest[];
  setReceivedRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>;
}

export const UserItem: React.FC<UserItemProps> = ({
  item,
  sentRequests,
  listOpacity,
  listTranslateY,
  handleCancelRequest,
  sendRequest,
  receivedRequests,
  setSentRequests,
  setReceivedRequests,
}) => {
  const avatar = item.avatar ? item.avatar.url : defaultAvatar.avatarUrl;

  const isReceived = receivedRequests.some((req) => req.sender.id === item.id);
  const isSent = sentRequests.some((req) => req.id === item.id) && !isReceived;

  return (
    <Animated.View
      style={[
        styles.userCard as StyleProp<ViewStyle>,
        { opacity: listOpacity, transform: [{ translateY: listTranslateY }] },
      ]}
    >
      <View style={styles.avatarContainer as StyleProp<ViewStyle>}>
        <Image source={{ uri: avatar }} style={styles.avatar as StyleProp<ImageStyle>} />
      </View>

      <View style={styles.userInfo as StyleProp<ViewStyle>}>
        <View style={styles.nameRow as StyleProp<ViewStyle>}>
          <Text style={styles.name as StyleProp<TextStyle>}>
            {item.firstName} {item.lastName}
          </Text>
        </View>
        <Text style={styles.username as StyleProp<TextStyle>}>@{item.username}</Text>
      </View>
      {isSent && !isReceived && (
        <View style={styles.sentRequest as StyleProp<ViewStyle>}>
          <TouchableOpacity onPress={() => handleCancelRequest(item.id)}>
            <Text style={styles.sentRequestText as StyleProp<TextStyle>}>
              Xóa lời mời
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {!isSent && !isReceived && (
        <View style={styles.receivedRequest as StyleProp<ViewStyle>}>
          <TouchableOpacity
            onPress={() => {
              sendRequest(item.id);
              setSentRequests((prev) => [...prev, item]);

            }}
          >
            <Text style={styles.receivedRequestText as StyleProp<TextStyle>}>
              Kết bạn
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {isReceived && (
        <View style={[styles.receivedRequest as StyleProp<ViewStyle>, {backgroundColor: colors.borderColor}]}>
          <Text style={styles.receivedRequestText as StyleProp<TextStyle>}>
            Đã nhận lời mời
          </Text>
        </View>
      )}
    </Animated.View>
  );
};