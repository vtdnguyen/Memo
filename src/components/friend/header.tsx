import React from "react";
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";
import { colors, styles } from "./styles";

interface HeaderProps {
  onClose: () => void;
  receivedRequestsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onClose, receivedRequestsCount }) => {
  return (
    <LinearGradient
      colors={[colors.background, "rgba(15, 22, 35, 0.8)"]}
      style={styles.headerGradient as StyleProp<ViewStyle>}
    >
      <View style={styles.header as StyleProp<ViewStyle>}>
        <TouchableOpacity
          style={styles.backButton as StyleProp<ViewStyle>}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <ArrowLeft color={colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bạn bè</Text>
        <View style={styles.headerBadge as StyleProp<ViewStyle>}>
          <Text style={styles.headerBadgeText}>{receivedRequestsCount}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};