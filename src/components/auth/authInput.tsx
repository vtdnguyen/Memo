import { colors } from "@/constants/Colors";
import { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native";

interface AuthInputProps {
  type: string;
  inputValue: string;
  placeholder?: string;
  setButtonActive?: (isActive: boolean) => void;
  setInputValue: (value: string) => void;
  typeUser?: "email" | "phone";
}

export default function AuthInput({
  type,
  inputValue,
  placeholder = "",
  setButtonActive,
  setInputValue,
  typeUser,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (text: string) => {
    if (text.length > 0) {
      setButtonActive?.(true);
    } else {
      setButtonActive?.(false);
    }
    setInputValue(text);
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={{
          width: 320,
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {type === "phone" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              left: 10,
              top: 20,
              gap: 4,
            }}
          >
            <Image
              source={require("@/assets/images/VietnamFlag.png")}
              style={{ width: 34, height: 22 }}
            />
            <Text
              style={{
                color: colors.white,
                fontSize: 18,
                fontWeight: "700",
                fontFamily: "Rounded Mplus 1c Bold",
                lineHeight: 14,
                letterSpacing: -0.5,
                textAlign: "left",
              }}
            >
              +84
            </Text>
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: inputValue ? colors.white : colors._promptPassword,
              paddingLeft: type === "phone" ? 90 : 20,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors._promptPassword}
          value={inputValue}
          onChangeText={handleChange}
          autoCapitalize={type === "name" ? "words" : "none"}
          secureTextEntry={type === "password" && !showPassword}
        />
        {type === "password" && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 10, top: 19 }}
          >
            {!showPassword ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.06202 12.3481C1.97868 12.1236 1.97868 11.8766 2.06202 11.6521C2.87372 9.68397 4.25153 8.00116 6.02079 6.81701C7.79004 5.63287 9.87106 5.00073 12 5.00073C14.129 5.00073 16.21 5.63287 17.9792 6.81701C19.7485 8.00116 21.1263 9.68397 21.938 11.6521C22.0214 11.8766 22.0214 12.1236 21.938 12.3481C21.1263 14.3163 19.7485 15.9991 17.9792 17.1832C16.21 18.3674 14.129 18.9995 12 18.9995C9.87106 18.9995 7.79004 18.3674 6.02079 17.1832C4.25153 15.9991 2.87372 14.3163 2.06202 12.3481Z"
                  stroke={colors._icon}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke={colors._icon}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.7329 5.07599C13.0623 4.7984 15.4185 5.29081 17.4418 6.47804C19.465 7.66527 21.0441 9.48207 21.9379 11.651C22.0213 11.8755 22.0213 12.1225 21.9379 12.347C21.5704 13.238 21.0847 14.0755 20.4939 14.837"
                  stroke={colors._icon}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.0841 14.158C13.5183 14.7045 12.7605 15.0069 11.9739 15C11.1873 14.9932 10.4349 14.6777 9.87868 14.1215C9.32245 13.5652 9.00695 12.8128 9.00011 12.0262C8.99328 11.2396 9.29566 10.4818 9.84214 9.91602"
                  stroke={colors._icon}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.479 17.499C16.1525 18.2848 14.6725 18.7761 13.1394 18.9394C11.6063 19.1028 10.056 18.9345 8.59365 18.4459C7.13133 17.9573 5.79121 17.1599 4.66423 16.1078C3.53725 15.0556 2.64977 13.7734 2.06202 12.348C1.97868 12.1235 1.97868 11.8765 2.06202 11.652C2.94865 9.50189 4.50869 7.69728 6.50802 6.50903"
                  stroke={colors._icon}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 2L22 22"
                  stroke={colors._icon}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export function AreaInput({
  type,
  inputValue,
  placeholder = "",
  setButtonActive,
  setInputValue,
  typeUser,
}: AuthInputProps) {
  const handleChange = (text: string) => {
    if (text.length > 0) {
      setButtonActive?.(true);
    } else {
      setButtonActive?.(false);
    }
    setInputValue(text);
  };

  return (
    <View style={styles.areaWrapper}>
      <TextInput
        multiline={true}
        numberOfLines={4}
        style={[
          styles.areaInput,
          { color: inputValue ? colors.white : colors._promptPassword },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors._promptPassword}
        value={inputValue}
        onChangeText={handleChange}
        autoCapitalize={type === "name" ? "words" : "none"}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 320,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 320,
    height: 60,
    borderRadius: 10,
    backgroundColor: colors._input,
    fontFamily: "Rounded Mplus 1c Bold",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 14,
    letterSpacing: -0.5,
    textAlign: "left",
  },
  areaWrapper: {
    width: 320,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  areaInput: {
    width: 320,
    height: 180,
    borderRadius: 10,
    backgroundColor: colors._input,
    fontFamily: "Rounded Mplus 1c Bold",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.5,
    padding: 20,
  },
});
