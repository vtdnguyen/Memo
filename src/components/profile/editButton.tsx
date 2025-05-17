import { colors } from "@/constants/Colors";
import { View, Text, StyleSheet } from "react-native";

export default function EditButton() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sửa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors._borderAvatar,
    borderRadius: 20,
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    color: colors._popup,
  },
});

