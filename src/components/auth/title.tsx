import { View, Text, StyleSheet } from "react-native";

interface TitleProps {
  text: string;
}

export default function Title({ text }: TitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Poppins-SemiBold",
    fontWeight: "600",
    fontStyle: "normal",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
