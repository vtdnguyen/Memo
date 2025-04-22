import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationProp } from '@react-navigation/native';
import { colors } from "@/constants/Colors";
type ExploreProps = {
  navigation: NavigationProp<any>;
};

export default function Explore({ navigation }: ExploreProps) {
 
  const insets = useSafeAreaInsets();
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const SCREEN_WIDTH = Dimensions.get('window').width;

  return (
    <View style={[styles.container, {
      paddingTop: insets.top + (SCREEN_HEIGHT * 1/70),
      paddingBottom: insets.bottom + (SCREEN_HEIGHT * 1/5),
      paddingLeft: insets.left + (SCREEN_WIDTH * 1/20),
      paddingRight: insets.right + (SCREEN_WIDTH * 1/20),
    }]}>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});