import { AntDesign } from "@expo/vector-icons";
import { View } from "react-native";

export default function ExpandTab() {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', height: 52, borderRadius: 20, backgroundColor: 'rgba(247, 247, 247, 0.09)' }}>
      <AntDesign name="arrowdown" size={24} color="#FFFFFF" />
    </View>
  );
}