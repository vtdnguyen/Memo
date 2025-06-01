import { API_URL } from "@/src/redux/slices/authSlice";
import axios from "axios";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";
import AuthInput, { AreaInput } from "@/src/components/auth/authInput";
import ConfirmButton from "@/src/components/auth/confirmButton";
import Title from "@/src/components/auth/title";

export const SendSuggest = ({ onClose }: { onClose: () => void }) => {
    const [email, setEmail] = useState("");
    const [suggestion, setSuggestion] = useState("");

    const [buttonActive, setButtonActive] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (email.length > 0 && suggestion.length > 0) {
            setButtonActive(true);
        } else {
            setButtonActive(false);
        }
    }, [email, suggestion]);

    const handleSendSuggest = async () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Email không hợp lệ");
            return;
        }
        console.log(email, suggestion);
        
        // try {
        //     const response = await axios.post(`${API_URL}/suggest`, {
        //         email: email,
        //         suggestion: suggestion
        //     });

        //     if (response.status === 200) {
        //         onClose();
        //     }
        // } catch (error) {
        //     setError("Không thể gửi đề xuất. Vui lòng thử lại sau.");
        // }

    }
    return (
        <View style={[styles.container, { width: "100%", height: "100%", borderTopLeftRadius: 60, borderTopRightRadius: 60 }]}>
            <View style={{ gap: 10, display: 'flex', alignItems: 'center', 'justifyContent': 'center' }}>
                <Title text="Đề xuất" margin={30} />
                <AuthInput
                    type="name"
                    inputValue={email}
                    placeholder="Email"
                    setInputValue={setEmail}
                />
                <AreaInput
                    type="name"
                    inputValue={suggestion}
                    placeholder="Nội dung"
                    setInputValue={setSuggestion}
                />
                {error && <Text style={{ color: 'red', position: 'absolute', bottom: -40, left: 0, right: 0, textAlign: 'center' }}>{error}</Text>}
            </View>
            <ConfirmButton
                buttonActive={buttonActive}
                setIsConfirmButtonPressed={handleSendSuggest}
            />
      </View>
    )
}

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
  