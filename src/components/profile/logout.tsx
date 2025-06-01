import { logout } from "@/src/redux/slices/authSlice";
import {
  View,
  Text,
  Animated,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useAppDispatch } from "@/src/redux/hooks";
import { colors } from "@/constants/Colors";
import { useState, useEffect } from "react";

export const LogoutPopup = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const startAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(logout());

      if (res.payload) {
        Alert.alert("Thành công", "Bạn đã đăng xuất thành công", [
          { text: "OK" },
        ]);
        closeAnimation();
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại sau.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const renderButton = (
    text: string,
    color: string,
    onPress: () => void,
    isDestructive = false
  ) => {
    return (
      <TouchableOpacity
        style={[styles.button]}
        onPress={onPress}
        disabled={isLoading}
      >
        <View style={styles.buttonBorder} />
        {isLoading ? (
          <ActivityIndicator color={color} />
        ) : (
          <Text style={[styles.buttonText, { color }]}>{text}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={true}
      animationType="fade"
      onRequestClose={closeAnimation}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Bạn có chắc chắn muốn đăng xuất?</Text>
          </View>
          {renderButton("Đăng xuất", colors._deleteAccount, handleLogout, true)}
          {renderButton("Hủy", colors.white, closeAnimation)}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    backgroundColor: colors._logoutBackground,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: "Rounded Mplus 1c Bold",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
    textAlign: "center",
    color: colors.white,
  },
  button: {
    position: "relative",
    paddingVertical: 16,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: colors._logoutBackground,
  },
  // destructiveButton: {
  //   backgroundColor: colors._deleteAccount + "20",
  // },
  buttonBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.black,
  },
  buttonText: {
    fontFamily: "Rounded Mplus 1c Bold",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 22,
    textAlign: "center",
    marginTop: 4,
  },
});
