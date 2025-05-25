import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import {
  Camera,
  FlashMode,
  useCameraPermissions,
  CameraType,
  CameraView,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as ImageManipulator from "expo-image-manipulator";
import { colors } from "@/constants/Colors";
import ExpandTab from "@/src/components/home/expand";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useImageContext } from "@/src/contexts/ImageContext";
import { router } from "expo-router";

export default function PhotoScreen() {
  // All useState hooks
  const [type, setType] = useState<CameraType>("back");
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const [zoom, setZoom] = useState(0);

  // All useRef hooks
  const cameraRef = useRef<CameraView>(null);

  // All other hooks
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();
  const { setCapturedImage } = useImageContext();

  // useEffect hooks
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert("Permission required", "Camera access is needed");
      }
      const imgPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (imgPerm.status !== "granted") {
        return Alert.alert("Permission required", "Gallery access is needed");
      }
    })();
  }, []);

  if (!permission)
    return (
      <View style={styles.container}>
        <Text>Requesting permissions…</Text>
      </View>
    );
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (!photo) {
        Alert.alert("Error", "No photo captured");
        return;
      }
      // const { uri, width, height } = photo;
      // const size = Math.min(width, height);
      // // Crop to center square
      // const manipResult = await ImageManipulator.manipulateAsync(
      //   uri,
      //   [{
      //     crop: {
      //       originX: (width - size) / 2,
      //       originY: (height - size) / 2,
      //       width: size,
      //       height: size,
      //     }
      //   }],
      //   { format: ImageManipulator.SaveFormat.PNG, compress: 1 }
      // );
      setCapturedImage(photo.uri);
      //setCapturedImage(manipResult.uri);
      router.push("/(tabs)/(home)/config");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not take picture");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  // Other functions
  const toggleCameraType = () => {
    setType((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlashMode((current) => {
      if (current === "off") return "on";
      if (current === "on") return "auto";
      return "off";
    });
  };

  const toggleZoom = () => {
    setZoom((current) => (current === 0 ? 0.5 : 0));
  };

  const getFlashIcon = () => {
    if (flashMode === "on") return "flash-on";
    if (flashMode === "off") return "flash-auto";
    return "flash-off";
  };

  const getZoomIcon = () => {
    if (zoom === 0) return "zoom-in";
    if (zoom === 0.5) return "zoom-out";
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar style="light" />

      <View style={styles.topRow}>
        <Image
          source={require("@/assets/logo/MEMO_light.png")}
          style={{ width: 50, height: 50 }}
        />
        <View style={styles.cameraControlsContainer}>
          <TouchableOpacity
            style={[styles.flashButton, { paddingRight: 20 }]}
            onPress={toggleZoom}
          >
            <MaterialIcons name={getZoomIcon()} size={36} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
            <MaterialIcons name={getFlashIcon()} size={36} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.previewContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={type}
          flash={flashMode}
          zoom={zoom}
          mirror={true}
        />
      </View>

      <TouchableOpacity>
        <ExpandTab />
      </TouchableOpacity>

      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
          <Ionicons name="images-outline" size={40} color="#F5F5F5" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleCameraType}
        >
          <Feather name="rotate-cw" size={40} color="#F5F5F5" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  previewContainer: {
    width: "100%",
    aspectRatio: "1",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
    marginTop: 5,
  },
  camera: {
    flex: 1,
    position: "relative",
  },
  cameraControlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flashButton: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  zoomButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    marginTop: 5,
  },
  captureButton: {
    width: 90,
    height: 90,
    borderRadius: 100,
    //backgroundColor: colors.outline,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    padding: 5,
  },
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 100,
    opacity: 1,
    backgroundColor: "#F5F5F5",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
});
