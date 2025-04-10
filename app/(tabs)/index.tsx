import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function App() {
  
  const insets = useSafeAreaInsets();
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const SCREEN_WIDTH = Dimensions.get('window').width;
  return (
    <View style={[styles.container , 
      {
        paddingTop: insets.top + SCREEN_HEIGHT*1/25,
        paddingBottom: insets.bottom +  SCREEN_HEIGHT*1/5,
        paddingLeft: insets.left + SCREEN_WIDTH*1/12,
        paddingRight: insets.right + SCREEN_WIDTH*1/12,
      }
     ]}>
      <Text>CAMERA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6fbff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  camera: {
    flex: 1,
    width: "100%",
    borderRadius: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 5,
  },
  shutterContainer: {
    position: "absolute",
    flexDirection: "row",
    flex: 1,
    bottom: 20,
    left: 0,
    width: "100%",
    alignItems: "center",
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