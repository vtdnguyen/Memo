import { View, StyleSheet, Text } from "react-native";
import Title from "@/src/components/auth/title";
import Privacy from "@/src/components/auth/privacy";
import ReturnButton from "@/src/components/auth/returnButton";
import AuthInput from "@/src/components/auth/authInput";
import ConfirmButton from "@/src/components/auth/confirmButton";
import SubButton from "@/src/components/auth/subButton";
import { useEffect, useState } from "react";
import { useCustomFonts } from "@/src/hook/useFonts";
import * as SplashScreen from "expo-splash-screen";
import AuthPopup from "@/src/components/auth/authPopup";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { login, clearError } from "@/src/redux/slices/authSlice";
import { RootState } from "@/src/redux/store";
import { router } from "expo-router";
import { API_URL_LOCAL } from "@/src/redux/slices/authSlice";

SplashScreen.preventAutoHideAsync();

type Step = "input" | "password";

export default function SignInScreen() {
  const [fontsLoaded] = useCustomFonts();
  const [error, setError] = useState("");
  const [isConfirmButtonPressed, setIsConfirmButtonPressed] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [password, setPassword] = useState("");
  const [typeUser, setTypeUser] = useState<
    "email" | "phone" | "name" | "password"
  >("email");
  const [isVisiblePopup, setIsVisiblePopup] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("input");
  const [userIdentifier, setUserIdentifier] = useState("");

  const dispatch = useAppDispatch();
  const {
    loading,
    error: authError,
    isAuthenticated,
  } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    const handleLogin = async (data: any) => {
      const response = await dispatch(login(data));
      console.log("login response", response);
      if (response.type === "auth/login/fulfilled") {
        console.log("login fulfilled");
        // router.push(`${API_URL_LOCAL}/profile`);
      }
    };
    if (isConfirmButtonPressed) {
      let isValid = true;

      if (currentStep === "input") {
        if (typeUser === "email") {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(userIdentifier)) {
            setError("Email không hợp lệ");
            isValid = false;
          }
        }

        if (typeUser === "phone") {
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
          const data = {
            account: userIdentifier,
            password: password,
          };
          handleLogin(data);
          
          setError("");
          setUserIdentifier("");
          setPassword("");
          setButtonActive(false);
        }
      }

      setIsConfirmButtonPressed(false);
    }
  }, [isConfirmButtonPressed, password, typeUser, currentStep, userIdentifier]);

  useEffect(() => {
    if (authError) {
      setError(authError);
      setIsVisiblePopup(true);
      dispatch(clearError());
    }
  }, [authError, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/profile`);
    }
  }, [isAuthenticated]);

  if (!fontsLoaded) return null;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#272727",
      }}
    >
      <ReturnButton
        onPress={() => {
          if (currentStep === "password") {
            setCurrentStep("input");
            setButtonActive(userIdentifier.length > 0);
            setTypeUser(typeUser === "email" ? "email" : "phone");
            setError("");
            setIsVisiblePopup(false);
            setIsConfirmButtonPressed(false);
          } else {
            console.log("return to onboarding");
            router.push(`${API_URL_LOCAL}/onboarding`);
          }
        }}
      />

      <View
        style={{
          flex: 1,
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
          ...(isVisiblePopup && { pointerEvents: "none" }),
        }}
      >
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
        {currentStep === "input" && (
          <SubButton
            text={`Sử dụng ${typeUser === "email" ? "SĐT" : "email"}`}
            setTypeUser={setTypeUser}
            type={typeUser}
          />
        )}
        {currentStep === "password" && (
          <SubButton
            text={`Quên mật khẩu`}
            setTypeUser={() => {}}
            type={typeUser}
          />
        )}
      </View>

      <View
        style={{
          width: "100%",
          gap: 20,
          marginBottom: 36,
          alignItems: "center",
          ...(isVisiblePopup && { pointerEvents: "none" }),
        }}
      >
        <Privacy />
        <ConfirmButton
          setIsConfirmButtonPressed={setIsConfirmButtonPressed}
          buttonActive={buttonActive}
        />
      </View>

      {isVisiblePopup && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(135, 135, 135, 0.18)",
            zIndex: 10,
          }}
          pointerEvents="auto"
        />
      )}

      {isVisiblePopup && (
        <AuthPopup
          title={`Lỗi đăng nhập`}
          description={`Thông tin tài khoản hoặc mật khẩu không chính xác`}
          setIsVisiblePopup={setIsVisiblePopup}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    position: "absolute",
    bottom: -2,
    color: "#FF6B6B",
    fontSize: 12,
    fontFamily: "Rounded Mplus 1c Bold",
  },
});
