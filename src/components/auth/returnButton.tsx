import { colors } from "@/constants/Colors";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useState, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface ReturnButtonProps {
  onPress: () => void;
  page?: "login" | "signup";
  has: boolean;
}

export default function ReturnButton({ onPress, page, has }: ReturnButtonProps) {
  const [pageText] = useState(page === "login" ? "Đăng nhập" : "Đăng ký");
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.buttonContainer, animatedStyle]}>
      {has && (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Svg
          width="46"
          height="46"
          viewBox="0 0 46 46"
          style={StyleSheet.absoluteFill}
        >
          <Circle
            cx="23"
            cy="23"
            r="23"
            fill={colors._icon}
            fillOpacity="0.15"
          />
        </Svg>
        <Svg width="24" height="24" viewBox="0 0 24 24">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L9.41421 12L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071C15.3166 20.0976 14.6834 20.0976 14.2929 19.7071L7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289Z"
            fill="white"
          />
        </Svg>

      </Pressable>)}
      
      <View style={styles.pageTextContainer}>
        <Text style={styles.pageText}>{pageText}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    left: 28,
    top: 50,
    zIndex: 1000,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  pageTextContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backdropFilter: "blur(10px)",
  },
  pageText: {
    fontSize: 24,

    fontWeight: "600",
    color: "white",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
