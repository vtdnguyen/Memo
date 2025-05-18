import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { colors } from "@/constants/Colors";
import AuthInput from "../auth/authInput";
import Title from "../auth/title";
import ConfirmButton from "../auth/confirmButton";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { RootState } from "@/src/redux/store";
import { updateUser } from "@/src/redux/slices/authSlice";
export const ChangeName = ({ onClose }: { onClose: () => void }) => {

    const dispatch = useAppDispatch();
    const state = useAppSelector((state: RootState) => state.auth);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [buttonActive, setButtonActive] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (firstName.length > 0 && lastName.length > 0) {
            setButtonActive(true);
        } else {
            setButtonActive(false);
        }
    }, [firstName, lastName]);

    const handleConfirm = async () => {
        console.log("Tên:", firstName);
        console.log("Họ:", lastName);
        const namePattern = /^[a-zA-Z]+$/;
        if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
            setError("Tên và họ chỉ được chứa chữ cái");
            return;
        }
        const response = await dispatch(updateUser({ firstName: firstName, lastName: lastName }));
        if (response.type === "user/update/fulfilled") {
            onClose();
        }
    }
  
    return (
      <View style={[styles.container, { width: "100%", height: "100%", borderTopLeftRadius: 60, borderTopRightRadius: 60 }]}>
            <View style={{ gap: 20 }}>
                <Title text="Nhập tên" />
                <AuthInput
                    type="name"
                    inputValue={firstName}
                    placeholder="Tên"
                    setInputValue={setFirstName}
                />
                <AuthInput
                    type="name"
                    inputValue={lastName}
                    placeholder="Họ"
                    setInputValue={setLastName}
                />
                {error && <Text style={{ color: 'red', position: 'absolute', bottom: -40, left: 0, right: 0, textAlign: 'center' }}>{error}</Text>}
            </View>
            <ConfirmButton
                buttonActive={buttonActive}
                setIsConfirmButtonPressed={handleConfirm}
            />
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
      gap: 300,
    },
  });
  