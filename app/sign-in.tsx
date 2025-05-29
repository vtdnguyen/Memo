import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import Title from "@/src/components/auth/title";
import Privacy from "@/src/components/auth/privacy";
import ReturnButton from "@/src/components/auth/returnButton";
import AuthInput from "@/src/components/auth/authInput";
import ConfirmButton from "@/src/components/auth/confirmButton";
import SubButton from "@/src/components/auth/subButton";
import AuthPopup from "@/src/components/auth/authPopup";
import { useEffect, useState, useCallback } from "react";
import { useCustomFonts } from "@/src/hooks/useFonts";
import * as SplashScreen from "expo-splash-screen";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { login, clearError, getUser } from "@/src/redux/slices/authSlice";
import { RootState } from "@/src/redux/store";
import { useRouter } from "expo-router";
import { colors } from "@/constants/Colors";
import { LOCAL_URL } from "@/src/redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

type Step = "input" | "password";

export default function SignInScreen() {
  const [fontsLoaded] = useCustomFonts();
  const [error, setError] = useState("");
  const [isConfirmButtonPressed, setIsConfirmButtonPressed] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [password, setPassword] = useState("");
  const [typeUser, setTypeUser] = useState<"email" | "phone">("email");
  const [isVisiblePopup, setIsVisiblePopup] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("input");
  const [userIdentifier, setUserIdentifier] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    loading,
    error: authError,
    isAuthenticated,
    user,
  } = useAppSelector((state: RootState) => state.auth);

  const prepareApp = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    prepareApp();
  }, [prepareApp]);

  const handleGetUser = useCallback(async () => {
    try {
      const response = await dispatch(getUser());
      if (response.type === "user/me/fulfilled") {
        console.log("User retrieved:", response.payload);
      }
    } catch (e) {
      console.log("Failed to fetch user", e);
    }
  }, [dispatch]);

  const handleLogin = useCallback(
    async (data: { account: string; password: string }) => {
      const response = await dispatch(login(data));
      if (response.type === "auth/login/fulfilled") {
        console.log("Login thành công");
        setIsLoggedIn(true);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (isAuthenticated) {
      handleGetUser();
    }
  }, [isAuthenticated, handleGetUser]);

  useEffect(() => {
    const checkPersistedStorage = async () => {
      const data = await AsyncStorage.getItem("persist:root");
      console.log("AsyncStorage:", data);
    };
    checkPersistedStorage();
  }, []);

  useEffect(() => {
    if (user) {

      router.push(`${LOCAL_URL}/(home)/`);
    }
  }, [user, router]);

  useEffect(() => {
    if (authError) {
      setError(authError);
      setIsVisiblePopup(true);
      dispatch(clearError());
    }
  }, [authError, dispatch]);

  useEffect(() => {
    if (!isConfirmButtonPressed) return;

    let isValid = true;

    if (currentStep === "input") {
      if (typeUser === "email") {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(userIdentifier)) {
          setError("Email không hợp lệ");
          isValid = false;
        }
      } else {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(userIdentifier)) {
          setError("Số điện thoại không hợp lệ");
          isValid = false;
        }
      }

      if (isValid) {
        setError("");
        setCurrentStep("password");
        setButtonActive(false);
      }
    } else if (currentStep === "password") {
      if (password.length < 8) {
        setError("Mật khẩu phải có ít nhất 8 ký tự");
        isValid = false;
      }

      if (isValid) {
        console.log("userIdentifier", userIdentifier);
        console.log("password", password);

        handleLogin({
          account:
            typeUser === "email"
              ? userIdentifier
              : "+84" + userIdentifier.slice(1),
          password,
        });
        setError("");
        setUserIdentifier("");
        setPassword("");
        setButtonActive(false);
      }
    }

    setIsConfirmButtonPressed(false);
  }, [
    isConfirmButtonPressed,
    currentStep,
    userIdentifier,
    password,
    typeUser,
    handleLogin,
  ]);

  if (!fontsLoaded || loading || isLoggedIn) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <ReturnButton
          onPress={() => {
            if (currentStep === "password") {
              setCurrentStep("input");
              setButtonActive(userIdentifier.length > 0);
              setError("");
            } else {
              router.push(`${LOCAL_URL}/sign-up`);
            }
          }}
          page='login'
          has={currentStep === "input" ? false : true}
        />

      <View style={styles.contentContainer}>
        <Title
          text={
            currentStep === "input"
              ? `Nhập ${typeUser === "email" ? "email" : "SĐT"} của bạn`
              : "Nhập mật khẩu"
          }
        />
        <View style={styles.errorContainer}>
          <AuthInput
            type={currentStep === "input" ? typeUser : "password"}
            inputValue={currentStep === "input" ? userIdentifier : password}
            setInputValue={
              currentStep === "input" ? setUserIdentifier : setPassword
            }
            placeholder={
              currentStep === "input"
                ? typeUser === "email"
                  ? "Email"
                  : "Số điện thoại"
                : "Mật khẩu"
            }
            setButtonActive={setButtonActive}
            typeUser={typeUser}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        {currentStep === "input" ? (
          <View style={{ flexDirection: "column", gap: 10, width: "100%", alignItems: "center" }}>
            <SubButton
              text={`Sử dụng ${typeUser === "email" ? "SĐT" : "email"}`}
              setTypeUser={setTypeUser}
              type={typeUser}
            />
            <SubButton
              text={`Đăng ký mới`}
              setTypeUser={() => {}}
              type={typeUser}
              onPress={() => router.push(`${LOCAL_URL}/sign-up`)}
          />
          </View>
        ) : (
          <SubButton
            text="Quên mật khẩu"
            setTypeUser={() => {}}
            type={typeUser}
          />
        )}
      </View>

      <View style={styles.bottomContainer}>
        <Privacy />
        <ConfirmButton
          setIsConfirmButtonPressed={setIsConfirmButtonPressed}
          buttonActive={buttonActive}
        />
      </View>

      {isVisiblePopup && (
        <View style={styles.overlay}>
          <AuthPopup
            title="Lỗi đăng nhập"
            description="Thông tin tài khoản hoặc mật khẩu không chính xác"
            setIsVisiblePopup={setIsVisiblePopup}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  errorContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: colors._error,
    fontSize: 12,
    fontFamily: "Rounded Mplus 1c Bold",
    marginTop: 5,
  },
  bottomContainer: {
    width: "100%",
    gap: 20,
    marginBottom: 36,
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(135, 135, 135, 0.18)",
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
