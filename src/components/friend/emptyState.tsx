import React from "react";
import { View, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./styles";

interface EmptyStateProps {
  type: "search" | "requests" | "sent";
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const getIconName = () => {
    switch (type) {
      case "search":
        return "magnify-close";
      case "requests":
        return "account-multiple-outline";
      case "sent":
        return "send-outline";
      default:
        return "magnify-close";
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
      <MaterialCommunityIcons
        name={getIconName()}
        size={120}
        color="#666"
        style={styles.emptyIcon}
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
