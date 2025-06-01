import { View, Text, StyleSheet, TouchableOpacity, Alert, ToastAndroid, Platform } from "react-native";
import Title from "@/src/components/auth/title";
import AuthInput from "@/src/components/auth/authInput";
import { useState } from "react";
import { colors } from "@/constants/Colors";
import ConfirmButton from "@/src/components/auth/confirmButton";
import { login, updateUser } from "@/src/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { RootState } from "@/src/redux/store";
// import { ArrowLeft } from "lucide-react-native";
import { Feather } from "@expo/vector-icons";

// const TopStick = ({ onClose }: { onClose: () => void }) => {
//   return (
//     <TouchableOpacity onPress={onClose} style={{ backgroundColor: 'red', width: '20%', height: 40}}>
//         <Feather name='arrow-left size={24} color={colors.white} />
//     </TouchableOpacity>
//   )
// }

const EnterPassword = ({
  setCurrentStep,
}: {
  setCurrentStep: (step: "password" | "email") => void;
}) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state: RootState) => state.auth);
  const [password, setPassword] = useState("");
  const [buttonActive, setButtonActive] = useState(false);

  const handleConfirm = async () => {
    const account = state.user?.email || state.user?.phoneNumber || "";
    console.log("account: ", account, "password: ", password);
    setCurrentStep("email");
    // const response = await dispatch(login({ account, password }));
    // if (response.type === "auth/login/fulfilled") {
    //   setCurrentStep("email");
    // }
  };

  return (
    <View style={[styles.container, { height: "100%" }]}>
      <View style={{ gap: 20, marginVertical: 100 }}>
        <Title text="Nhập mật khẩu" />
        <AuthInput
          type="password"
          inputValue={password}
          placeholder="Mật khẩu"
          setInputValue={setPassword}
          setButtonActive={setButtonActive}
          typeUser={state.user?.email ? "email" : "phone"}
        />
      </View>
      <ConfirmButton
        buttonActive={buttonActive}
        setIsConfirmButtonPressed={handleConfirm}
      />
    </View>
  );
};

const EnterNewEmail = ({ onClose }: { onClose: () => void }) => {
  const [newEmail, setNewEmail] = useState("");
  const [buttonActive, setButtonActive] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const state = useAppSelector((state: RootState) => state.auth);
  console.log("state: ", state);

  const handleConfirm = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
      setError("Email không hợp lệ");
      return;
    }
    console.log("Email mới:", newEmail);
    const response = await dispatch(updateUser({ email: newEmail }));
    if (response.type === "user/update/fulfilled") {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Đã đổi email thành công', ToastAndroid.SHORT);
      } else {
        Alert.alert('Thông báo', 'Đã đổi email thành công');
      }
      onClose();
    }
  };

  return (
    <View style={[styles.container, { height: "100%" }]}>
      <View style={{ gap: 20, marginVertical: 100 }}>
        <Title text="Nhập email mới" />
        <AuthInput
          type="email"
          inputValue={newEmail}
          placeholder="Email mới"
          setInputValue={setNewEmail}
          setButtonActive={setButtonActive}
        />
        {error && (
          <Text
            style={{
              color: "red",
              position: "absolute",
              bottom: -40,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        )}
      </View>
      <ConfirmButton
        buttonActive={buttonActive}
        setIsConfirmButtonPressed={handleConfirm}
      />
    </View>
  );
};

export const ChangeEmail = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState<"password" | "email">(
    "password"
  );

  return (
    <View
      style={[
        styles.container,
        {
          width: "100%",
          height: "100%",
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
        },
      ]}
    >
      {/* <TopStick onClose={onClose} /> */}
      {currentStep === "password" ? (
        <EnterPassword setCurrentStep={setCurrentStep} />
      ) : (
        <EnterNewEmail onClose={onClose} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: colors.darkGrey,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 200,
  },
});
