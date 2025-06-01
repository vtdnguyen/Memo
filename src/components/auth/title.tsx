import { colors } from "@/constants/Colors";
import { View, Text, StyleSheet } from "react-native";

interface TitleProps {
  text: string;
  mgB?: number;
  mgT?: number;
  pd?: number;
}

export default function Title({ text, mgB, mgT, pd }: TitleProps) {
  return (
    <View style={[styles.container, { marginBottom: mgB, marginTop: mgT, paddingVertical: pd }]}>
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
    fontFamily: "Rounded Mplus 1c Bold",
    fontWeight: "800",
    fontStyle: "normal",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: colors.white,
    textAlign: "center",
  },
});
