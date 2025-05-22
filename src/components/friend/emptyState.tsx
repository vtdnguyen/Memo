import React, { useRef } from "react";
import { View, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import LottieView from "lottie-react-native";
import { styles } from "./styles";

interface EmptyStateProps {
  type: "search" | "requests" | "sent";
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const emptyLottieRef = useRef<LottieView>(null);

  const getAnimationSource = () => {
    switch (type) {
      case "search":
        return require("@/assets/animations/empty-search.json");
      case "requests":
        return require("@/assets/animations/empty-friends.json");
      case "sent":
        return require("@/assets/animations/message-sent.json");
      default:
        return require("@/assets/animations/empty-search.json");
    }
  };

  const getEmptyText = () => {
    switch (type) {
      case "search":
        return "Không tìm thấy người dùng phù hợp";
      case "requests":
        return "Không có lời mời kết bạn nào";
      case "sent":
        return "Bạn chưa gửi lời mời kết bạn nào";
      default:
        return "Không có dữ liệu";
    }
  };

  const getEmptySubtext = () => {
    switch (type) {
      case "search":
        return "Hãy thử tìm kiếm với từ khóa khác";
      case "requests":
        return "Các lời mời kết bạn sẽ xuất hiện ở đây";
      case "sent":
        return "Tìm kiếm và gửi lời mời kết bạn ngay!";
      default:
        return "";
    }
  };

  return (
    <View style={styles.emptyContainer as StyleProp<ViewStyle>}>
      <LottieView
        ref={emptyLottieRef}
        source={getAnimationSource()}
        style={styles.emptyLottie as StyleProp<ViewStyle>}
        autoPlay
        loop
      />
      <Text style={styles.emptyText as StyleProp<TextStyle>}>
        {getEmptyText()}
      </Text>
      <Text style={styles.emptySubtext as StyleProp<TextStyle>}>
        {getEmptySubtext()}
      </Text>
    </View>
  );
};