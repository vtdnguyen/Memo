import { API_URL } from "@/src/redux/slices/authSlice";
import axios from "axios";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";
import AuthInput, { AreaInput } from "@/src/components/auth/authInput";
import ConfirmButton from "@/src/components/auth/confirmButton";
import Title from "@/src/components/auth/title";

export const SendReport = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [report, setReport] = useState("");
  const [buttonActive, setButtonActive] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (email.length > 0 && report.length > 0) {
      setButtonActive(true);
    } else {
      setButtonActive(false);
    }
  }, [email, report]);

  const handleSendReport = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    console.log(email, report);
    

    // try {
    //   const response = await axios.post(`${API_URL}/report`, {
    //     email: email,
    //     report: report,
    //   });

    //   if (response.status === 200) {
    //     onClose();
    //   }
    // } catch (error) {
    //   setError("Không thể gửi báo cáo. Vui lòng thử lại sau.");
    // }
  };

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
      <View style={{ gap: 20, display: 'flex', alignItems: 'center', 'justifyContent': 'center' }}>
        <Title text="Báo cáo" margin={30} />
        <AuthInput
          type="name"
          inputValue={email}
          placeholder="Email"
          setInputValue={setEmail}
        />
        <AreaInput
          type="name"
          inputValue={report}
          placeholder="Nội dung báo cáo"
          setInputValue={setReport}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <ConfirmButton
        buttonActive={buttonActive}
        setIsConfirmButtonPressed={handleSendReport}
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
  errorText: {
    color: "red",
    position: "absolute",
    bottom: -40,
    left: 0,
    right: 0,
    textAlign: "center",
  },
});
