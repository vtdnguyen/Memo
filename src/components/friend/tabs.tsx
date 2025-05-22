import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, styles } from "./styles";

interface TabsProps {
  activeTab: "requests" | "sent";
  setActiveTab: (tab: "requests" | "sent") => void;
  receivedRequestsCount: number;
  sentRequestsCount: number;
  tabIndicatorPosition: Animated.Value;
  headerOpacity: Animated.Value;
}

export const Tabs: React.FC<TabsProps> = ({
  activeTab,
  setActiveTab,
  receivedRequestsCount,
  sentRequestsCount,
  tabIndicatorPosition,
  headerOpacity,
}) => {
  const tabIndicatorLeft = tabIndicatorPosition.interpolate({
    inputRange: [0, 1],
    outputRange: ["2%", "52%"],
  });

  return (
    <Animated.View
      style={[
        styles.tabContainer as StyleProp<ViewStyle>,
        { opacity: headerOpacity },
      ]}
    >
      <TouchableOpacity
        style={styles.tab as StyleProp<ViewStyle>}
        onPress={() => setActiveTab("requests")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "requests" && styles.activeTabText,
          ]}
        >
          Lời mời ({receivedRequestsCount})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab as StyleProp<ViewStyle>}
        onPress={() => setActiveTab("sent")}
      >
        <Text
          style={[styles.tabText, activeTab === "sent" && styles.activeTabText]}
        >
          Đã gửi ({sentRequestsCount})
        </Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.tabIndicator as StyleProp<ViewStyle>,
          { left: tabIndicatorLeft },
        ]}
      >
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 12 }}
        />
      </Animated.View>
    </Animated.View>
  );
};