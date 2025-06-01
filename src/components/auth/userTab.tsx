import { View, Text, StyleSheet, Image } from "react-native";
import MiniAvatar from "./miniAvatar";
import { colors } from "@/constants/Colors";

interface UserTabProps {
  username: string;
  image: string;
}

export default function UserTab({ username, image }: UserTabProps) {
  return (
    <View style={styles.container}>
      <MiniAvatar image={image}/>
      <Text style={styles.username}>{username}</Text>
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 70,
    backgroundColor: colors._input,
    borderWidth: 3,
    borderColor: colors._privacyPolicyText,
    borderRadius: 27,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 16,
    padding: 20,
  },
  image: {
    width: 42,
    height: 42,
  },
  username: {
    fontFamily: "Rounded Mplus 1c",
    fontWeight: "800",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "left",
    color: colors._confirmButton,
  },
});

