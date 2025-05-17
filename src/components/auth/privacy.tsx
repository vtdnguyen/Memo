import { colors } from "@/constants/Colors";
import { View, Text, StyleSheet } from "react-native";

export default function Privacy() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Bằng việc nhấn tiếp tục, Bạn đang{"\n"}
        đồng ý với <Text style={styles.link}>Chính Sách</Text> và <Text style={styles.link}>Điều Khoản</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Rounded Mplus 1c Bold",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.5,
    textAlign: "center",
    color: colors._privacyPolicy,
  },
  link: {
    color: colors._privacyPolicyText,
  },
});
