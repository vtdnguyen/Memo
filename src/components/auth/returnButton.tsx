import { colors } from "@/constants/Colors";
import { TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

interface ReturnButtonProps {
  onPress: () => void;
}

export default function ReturnButton({ onPress }: ReturnButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Svg width="46" height="46" viewBox="0 0 46 46" style={StyleSheet.absoluteFill}>
        <Circle cx="23" cy="23" r="23" fill={colors._icon} fillOpacity="0.2" />
      </Svg>
      <Svg width="24" height="24" viewBox="0 0 24 24">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L9.41421 12L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071C15.3166 20.0976 14.6834 20.0976 14.2929 19.7071L7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289Z"
          fill="white"
        />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    width: 46,
    height: 46,
    left: 28,
    top: 60,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
});
