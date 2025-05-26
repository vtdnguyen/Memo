import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, StyleProp, ViewStyle, ImageStyle, TextStyle, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Clock, UserMinus, UserPlus } from "lucide-react-native";
import { colors, styles } from "./styles";
import { defaultAvatar } from "@/constants/images";
import { FriendRequest } from "@/src/types/friend";

interface RequestItemProps {
  item: FriendRequest;
  index: number;
  pulseAnim: Animated.Value;
  onReject: (id: string, userId: string) => void;
  onAccept: (id: string, userId: string) => void;
}

export const RequestItem: React.FC<RequestItemProps> = ({ item, index, pulseAnim, onReject, onAccept }) => {
  const avatar = item.sender.avatar ? item.sender.avatar.url : defaultAvatar.avatarUrl;
  const itemAnim = useRef(new Animated.Value(0)).current;
  const itemAnimDelay = index * 120;
  

  useEffect(() => {
    Animated.spring(itemAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      delay: itemAnimDelay,
      useNativeDriver: true,
    }).start();
  }, []);

  const itemStyle = {
    opacity: itemAnim,
    transform: [
      {
        translateY: itemAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
      {
        scale: itemAnim.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [0.8, 1.05, 1],
        }),
      },
    ],
  };

  const isPulsing = index === 0;
  const pulseStyle = isPulsing ? { transform: [{ scale: pulseAnim }] } : {};

  return (
    <View
      style={[styles.requestCard as StyleProp<ViewStyle>, itemStyle, pulseStyle]}
    >
      <BlurView
        intensity={10}
        tint="dark"
        style={styles.cardBlur as StyleProp<ViewStyle>}
      >
        <View style={styles.requestHeader as StyleProp<ViewStyle>}>
          <View style={styles.avatarContainer as StyleProp<ViewStyle>}>
            <Image
              source={{ uri: avatar }}
              style={styles.avatar as StyleProp<ImageStyle>}
            />
            {/* <View style={styles.onlineIndicator as StyleProp<ViewStyle>} /> */}
          </View>

          <View style={styles.requestInfo as StyleProp<ViewStyle>}>
            <Text style={styles.name as StyleProp<TextStyle>}>
              {item.sender.firstName} {item.sender.lastName}
            </Text>
            <Text style={styles.username as StyleProp<TextStyle>}>@{item.sender.username}</Text>
            <View style={styles.requestTimeContainer as StyleProp<ViewStyle>}>
              <Clock
                size={12}
                color={colors.lightGray}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.requestTime as StyleProp<TextStyle>}>{item.timeAgo}</Text>
            </View>
          </View>
        </View>

        <View style={styles.messageContainer as StyleProp<ViewStyle>}>
          <View style={styles.quoteBar as StyleProp<ViewStyle>} />
          <Text style={styles.message as StyleProp<TextStyle>}>
            Xin chào! Tôi muốn kết bạn với bạn để cùng chia sẻ những bài viết thú vị.
          </Text>
        </View>

        <View style={styles.actionButtons as StyleProp<ViewStyle>}>
          <TouchableOpacity style={[styles.rejectButton, { borderRadius: 10 }]} onPress={() =>  onReject(item.id, item.sender.id)}>
            <LinearGradient
              colors={[colors.dangerGradientStart, colors.dangerGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />
            
            <Text style={styles.buttonText as StyleProp<TextStyle>}>
              <UserMinus size={16} color={colors.white} /> 
              Từ chối
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.acceptButton, { borderRadius: 10 }]} onPress={() => onAccept(item.id, item.sender.id)}>
            <LinearGradient
              colors={[colors.successGradientStart, colors.successGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />
            <Text style={styles.buttonText as StyleProp<TextStyle>}>
              <UserPlus size={16} color={colors.white} />
              Chấp nhận
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};