import { colors } from "@/constants/Colors";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { defaultAvatar } from "@/constants/images";
import * as ImagePicker from "expo-image-picker";
import { getCookie, getUser, uploadAvatar } from "@/src/redux/slices/authSlice";
import { useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function Avatar({ onPress }: { onPress: () => void }) {
  const user = useAppSelector((state: any) => state.auth.user);
  console.log("user", user);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const imageUrl = user.avatar ? user.avatar.url : defaultAvatar.avatarUrl;

  const checkPermissions = async () => {
    if (Platform.OS === "web") {
      return true;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cấp quyền truy cập ảnh để thay đổi avatar.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const handleChangeAvatar = async () => {
    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: false,
        exif: false,
        base64: false,
      });


      if (result.canceled) {
        return;
      }

      const image = result.assets[0];
      console.log("image", image);

      console.log('aa');
      


      let response = await fetch(image.uri);
      console.log("response", response);
      const blob = await response.blob();

      console.log("blob", blob);
      

      if (blob.size > MAX_FILE_SIZE) {
        Alert.alert("Lỗi", "Kích thước ảnh không được vượt quá 5MB", [
          { text: "OK" },
        ]);
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", blob, `avatar.jpg`);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };

      console.log("FormData:", formData);
      console.log("Config:", config);

      response = await dispatch(uploadAvatar({ formData, config })).unwrap();

      console.log("Response:", response);
      // nào response về uri thì bỏ dispatch
      dispatch(getUser());

      Alert.alert("Thành công", "Avatar đã được cập nhật", [{ text: "OK" }]);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Alert.alert("Lỗi", "Không thể tải lên avatar. Vui lòng thử lại sau.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const stick = (rotate: number) => {
    return (
      <View
        style={{
          position: "absolute",
          top: -7,
          left: -1,
          width: 3,
          height: 16,
          backgroundColor: colors.black,
          borderRadius: 999,
          transform: [{ rotate: `${rotate}deg` }],
        }}
      ></View>
    );
  };
  return (
    <View style={styles.wrapper}>
      {/* avatar */}
      <View style={styles.avatarWrapper}>
        <View style={styles.container}>
          <Image
            style={styles.avatar}
            source={{ uri: imageUrl }}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[styles.avatarPlus, isLoading && styles.disabledButton]}
            onPress={handleChangeAvatar}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.black} />
            ) : (
              <Text
                style={{ color: "black", fontSize: 30, fontWeight: "bold" }}
              >
                {stick(0)}
                {stick(90)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* name */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <Text style={styles.name}>{user.firstName}</Text>
        <Text style={styles.name}>{user.lastName}</Text>
      </View>
      {/* username and edit button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginTop: 8,
        }}
      >
        <View style={styles.username}>
          <Text style={styles.usernameText}>{user.username}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.editButtonText}>Sửa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginTop: 50,
  },
  avatarWrapper: {
    borderColor: colors._borderAvatar,
    borderWidth: 6,
    borderRadius: 999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  container: {
    borderColor: colors.black,
    borderWidth: 4,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 132,
    height: 132,
    borderRadius: 999,
  },
  avatarPlus: {
    position: "absolute",
    bottom: -2,
    right: -4,
    backgroundColor: colors._confirmButton,
    width: 36,
    height: 36,
    borderRadius: 999,
    borderColor: colors.black,
    borderWidth: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontFamily: "Rounded Mplus 1c Bold",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
    color: colors._name,
  },
  username: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors._editButton,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderRadius: 40,
    borderColor: colors._editButtonBorder,
    minWidth: 100,
  },
  usernameText: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    color: colors._usernameText,
  },
  editButton: {
    backgroundColor: colors._editButton,
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: colors._editButton,
    minWidth: 100,
    paddingHorizontal: 10,
    paddingVertical: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    fontFamily: "Rounded Mplus 1c Bold",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    color: colors._popup,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
