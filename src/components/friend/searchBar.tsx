import React, { useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { BlurView } from "expo-blur";
// import { Search, X } from "lucide-react-native";
import { colors, styles } from "./styles";
import { Feather } from "@expo/vector-icons";

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  searchBoxAnim: Animated.Value;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  setSearchText,
  searchBoxAnim,
}) => {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const clearSearch = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setSearchText("");
    Keyboard.dismiss();
  };

  const searchBoxScale = searchBoxAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <Animated.View
      style={[
        styles.searchContainer as StyleProp<ViewStyle>,
        {
          transform: [{ scale: searchBoxScale }],
        },
      ]}
    >
      <BlurView
        intensity={15}
        tint="dark"
        style={styles.searchBlur as StyleProp<ViewStyle>}
      >
        <Feather
          name='search'
          color={colors.lightGray}
          size={18}
          // style={styles.searchIcon as StyleProp<ViewStyle>}
        />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm bạn bè..."
          placeholderTextColor={colors.lightGray}
          style={styles.input as StyleProp<TextStyle>}
          underlineColorAndroid="transparent"
          onSubmitEditing={Keyboard.dismiss}
          focusable={true}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={clearSearch}
            style={styles.clearButton as StyleProp<ViewStyle>}
          >
            <Feather name='x' color={colors.lightGray} size={18} />
          </TouchableOpacity>
        )}
      </BlurView>
    </Animated.View>
  );
};