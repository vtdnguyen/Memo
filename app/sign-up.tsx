import {
  View,
  StyleSheet,
  Text,
  Animated,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Title from "@/src/components/auth/title";
import Privacy from "@/src/components/auth/privacy";
import ReturnButton from "@/src/components/auth/returnButton";
import AuthInput from "@/src/components/auth/authInput";
import ConfirmButton from "@/src/components/auth/confirmButton";
import SubButton from "@/src/components/auth/subButton";
import { useEffect, useState, useRef } from "react";
import { useCustomFonts } from "@/src/hooks/useFonts";
import * as SplashScreen from "expo-splash-screen";
import AuthPopup from "@/src/components/auth/authPopup";
import UserTab from "@/src/components/auth/userTab";
import LoadingIndicator from "@/src/components/auth/loadingIndicator";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { signup, clearError, LOCAL_URL } from "@/src/redux/slices/authSlice";
import { RootState } from "@/src/redux/store";
import { router } from "expo-router";
import { colors } from "@/constants/Colors";
import { defaultAvatar } from "@/constants/images";

// SplashScreen.preventAutoHideAsync();

type Step = "input" | "password" | "name" | "success";

export default function SignUpScreen() {
  const [fontsLoaded] = useCustomFonts();
  const [error, setError] = useState("");
  const [isConfirmButtonPressed, setIsConfirmButtonPressed] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [typeUser, setTypeUser] = useState<"email" | "phone">("email");
  const [isVisiblePopup, setIsVisiblePopup] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("input");
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const { avatarUrl } = defaultAvatar;

  const dispatch = useAppDispatch();
  const {
    loading,
    error: authError,
    user,
    isAuthenticated,
  } = useAppSelector((state: RootState) => state.auth);

  const inputRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)
  const fnameRef = useRef<TextInput>(null)
  const lnameRef = useRef<TextInput>(null)
  const unameRef = useRef<TextInput>(null)

  // useEffect(() => {
  //   async function prepare() {
  //     if (fontsLoaded) {
  //       await SplashScreen.hideAsync();
  //     }
  //   }
  //   prepare();
  // }, [fontsLoaded]);

  useEffect(() => {
    const handleSignup = async (data: any) => {
      const response = await dispatch(signup(data));
      if (response.type === "auth/register/fulfilled") {
        setCurrentStep("success");
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
          setButtonActive(!!password);
        }
      } else if (currentStep === "password") {
        if (password.length < 8) {
          setError("Mật khẩu phải có ít nhất 8 ký tự");
          isValid = false;
        }
        if (isValid) {
          setError("");
          setCurrentStep("name");
          setButtonActive(!!(firstName && lastName));
        }
      } else if (currentStep === "name") {
        if (!firstName.trim() || !lastName.trim()) {
          setError("Vui lòng nhập đầy đủ họ và tên");
          isValid = false;
        }
        const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-1234567890]/;
        if (
          specialCharRegex.test(firstName) ||
          specialCharRegex.test(lastName)
        ) {
          setError("Tên họ không được sử dụng ký tự đặc biệt và chữ số");
          isValid = false;
        }
        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
        if (!usernameRegex.test(username)) {
          setError("Tên người dùng không hợp lệ");
          isValid = false;
        }

        if (isValid) {
          if (typeUser === "email") {
            setError("");
            const data = {
              email: userIdentifier,
              password,
              firstName,
              lastName,
              username,
            };
            console.log('data signup', data);
            
            handleSignup(data);
          } else {
            setError("");
            const data = {
              phoneNumber: "+84" + (userIdentifier[0] === "0" ? userIdentifier.slice(1) : userIdentifier),
              password,
              firstName,
              lastName,
              username,
            };

            console.log('data signup', data);

            handleSignup(data);
          }
        }
      }
      setIsConfirmButtonPressed(false);
    }
  }, [
    isConfirmButtonPressed,
    typeUser,
    currentStep,
    userIdentifier,
    password,
    firstName,
    lastName,
    username,
    dispatch
  ]);

  useEffect(() => {
    if (authError) {
      setError(authError);
      setIsVisiblePopup(true);
      dispatch(clearError());
    }
  }, [authError, dispatch]);

  useEffect(() => {
    if (userIdentifier || password || firstName || lastName) {
      setError("");
    }
  }, [userIdentifier, password, firstName, lastName]);

  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (copiedLink) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 100,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [copiedLink, translateY, opacity]);

  const setNext = () => {
    setIsConfirmButtonPressed(true)
    return
  }

  const renderContent = () => {
    switch (currentStep) {
      case "input":
        return (
          <View style={{ gap: 20, display: 'flex', alignItems: 'center', 'justifyContent': 'center' }}>
            <Title
              text={`Nhập ${typeUser === "email" ? "email" : "SĐT"} của bạn`} mgB={0} mgT={80} pd={0}
            />
            <View style={styles.errorContainer}>
              <AuthInput
                type={typeUser}
                inputValue={userIdentifier}
                setInputValue={setUserIdentifier}
                placeholder={typeUser === "email" ? "Email" : "Số điện thoại"}
                setButtonActive={setButtonActive}
                typeUser={typeUser}
                key="input-step"
                ref={inputRef as React.RefObject<TextInput>}
                nextRef={passwordRef as React.RefObject<TextInput>}
                setNext={setNext}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
            <View style={{ flexDirection: "column", gap: 10, width: "100%", alignItems: "center" }}>
              <SubButton
                text={`Sử dụng ${typeUser === "email" ? "SĐT" : "email"}`}
                setTypeUser={setTypeUser}
                type={typeUser}
              />
              <SubButton
                text={`Đăng nhập`}
                setTypeUser={() => {}}
                type={typeUser}
                onPress={() => router.push(`/sign-in`)}
              />
            </View>
          </View>
        );
      case "password":
        return (
          <View style={{ gap: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Title text="Tạo mật khẩu" />
            <View style={styles.errorContainer}>
              <AuthInput
                type="password"
                inputValue={password}
                setInputValue={setPassword}
                placeholder="Mật khẩu"
                setButtonActive={setButtonActive}
                typeUser={typeUser}
                ref={passwordRef as React.RefObject<TextInput>}
                key="password-step"
                setNext={setNext}
                nextRef={fnameRef as React.RefObject<TextInput>}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
            <Text style={styles.promptPassword}>
              Mật khẩu phải có ít nhất{" "}
              <Text style={styles.promptPasswordNotice}>8 ký tự</Text>
            </Text>
          </View>
        );
      case "name":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Title text="Tên người dùng" />
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0,
                marginBottom: 10,
              }}
            >
              <AuthInput
                type="name"
                inputValue={firstName}
                setInputValue={setFirstName}
                placeholder="Tên"
                setButtonActive={setButtonActive}
                typeUser={typeUser}
                key="name-first-step"
                // setNext={setNext}
                ref={fnameRef as React.RefObject<TextInput>}
                nextRef={lnameRef as React.RefObject<TextInput>}
                mainRef={fnameRef as React.RefObject<TextInput>}
              />
              <AuthInput
                type="name"
                inputValue={lastName}
                setInputValue={setLastName}
                placeholder="Họ"
                setButtonActive={setButtonActive}
                typeUser={typeUser}
                key="name-last-step"
                // setNext={setNext}
                ref={lnameRef as React.RefObject<TextInput>}
                nextRef={unameRef as React.RefObject<TextInput>}
                mainRef={fnameRef as React.RefObject<TextInput>}
              />
              <AuthInput
                type="name"
                inputValue={username}
                setInputValue={setUsername}
                placeholder="Tên người dùng"
                setButtonActive={setButtonActive}
                typeUser={typeUser}
                key="name-username-step"
                setNext={setNext}
                ref={unameRef as React.RefObject<TextInput>}
                nextRef={undefined}
                mainRef={fnameRef as React.RefObject<TextInput>}

              />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        );
      case "success":
        console.log("user", user);

        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {user ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <UserTab username={user?.username || ""} image={avatarUrl} />

                <Text style={styles.successText}>Thành công</Text>
                <Text style={styles.findFriendText}>
                  Bây giờ bạn bè của bạn có thể tìm kiếm tài khoản của bạn.
                </Text>
                <SubButton
                  text="Link kết bạn"
                  setTypeUser={() => {}}
                  type="name"
                  setCopiedLink={setCopiedLink}
                />
                {copiedLink && (
                  <Animated.View
                    style={[
                      styles.copiedLink,
                      {
                        transform: [{ translateY }],
                        opacity,
                      },
                    ]}
                  >
                    <Text style={styles.copiedLinkText}>Copied link</Text>
                  </Animated.View>
                )}
                <TouchableOpacity
                  style={{
                    backgroundColor: colors._background,
                    padding: 10,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    router.push(`/sign-in`);
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "Rounded Mplus 1c",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Đăng nhập
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ color: "red" }}>Đăng ký thất bại</Text>
            )}
          </View>
        );
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      {(currentStep !== "success" || !isAuthenticated) && (
        <ReturnButton
          onPress={() => {
            if (currentStep === "password") {
              setCurrentStep("input");
              setTypeUser(
                userIdentifier.match(/^[0-9]{10}$/) ? "phone" : "email"
              );
              setButtonActive(!!userIdentifier);
            } else if (currentStep === "name") {
              setCurrentStep("password");
              setButtonActive(!!password);
            } else if (currentStep === "success") {
              setCurrentStep("input");
            } else {
              router.push(`/sign-in`);
            }
          }}
          has={currentStep === "input" ? false : true}
          page="signup"
        />
      )}

      <View
        style={{
          flex: 1,
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
          ...(isVisiblePopup && { pointerEvents: "none" }),
        }}
      >
        {renderContent()}
      </View>

      {currentStep !== "success" && (
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
      )}

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
          title={`${
            typeUser === "email" ? "Email" : "SĐT"
          } đã có người sử dụng`}
          description={`Vui lòng sử dụng ${
            typeUser === "email" ? "email" : "số điện thoại"
          } khác`}
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
    gap: 10,
  },
  error: {
    position: "absolute",
    bottom: 0,
    color: colors._error,
    fontSize: 12,
    fontFamily: "Rounded Mplus 1c Bold",
  },
  promptPassword: {
    fontSize: 18,
    fontFamily: "Rounded Mplus 1c Bold",
    textAlign: "center",
    letterSpacing: -0.5,
    color: colors._promptPassword,
    marginBottom: 10,
    marginTop: 10,
  },
  promptPasswordNotice: {
    color: colors._promptPasswordNotice,
  },
  successText: {
    fontFamily: "Rounded Mplus 1c",
    fontWeight: "800",
    fontSize: 29,
    lineHeight: 46,
    textAlign: "center",
    color: colors.white,
  },
  findFriendText: {
    fontFamily: "Rounded Mplus 1c",
    fontWeight: "800",
    fontSize: 16,
    lineHeight: 26,
    textAlign: "center",
    color: colors.textCol,
    paddingHorizontal: 37,
  },
  copiedLink: {
    position: "absolute",
    bottom: -100,
    alignSelf: "center",
    backgroundColor: colors._background,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  copiedLinkText: {
    fontFamily: "Rounded Mplus 1c",
    fontWeight: "800",
    fontSize: 16,
    lineHeight: 26,
    color: colors._copied,
    textAlign: "center",
  },
});
