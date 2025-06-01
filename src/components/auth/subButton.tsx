import { useState } from "react";
import { Text,TouchableOpacity, StyleSheet, Alert, View } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { useAppSelector } from "@/src/redux/hooks";
import { colors } from "@/constants/Colors";
import { RootState } from '@/src/redux/store';
import Svg, { Path } from "react-native-svg";

interface SubButtonProps {  
    text: string;
    setTypeUser: (type: 'email' | 'phone') => void;
    type: 'email' | 'phone' | 'password' | 'name';
    setCopiedLink?: (copiedLink: boolean) => void;
    onPress?: () => void;
}

export default function SubButton({ text, setTypeUser, type, setCopiedLink, onPress }: SubButtonProps) {
    const user = useAppSelector((state:RootState) => state.auth.user);
    
    const [sendPassword, setSendPassword] = useState(false);
    const handlePress = () => {
        if (text === 'Đăng ký mới' || text === 'Đăng nhập') {
            onPress?.();
        } else if (text === 'Quên mật khẩu') {
            // console.log('quên');
            setSendPassword(true);
        } else if (type === 'email') {
            setTypeUser('phone');
        } else if (type === 'phone') {
            setTypeUser('email');
        } else {
            // success but type === name
            Clipboard.setString('memo.vie/'+user?.username);
            setCopiedLink?.(true);
            setTimeout(() => {
                setCopiedLink?.(false);
            }, 2000);
        }
    }
    return (
        <View style={{ width: '50%', alignSelf: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {!sendPassword ? (
                <TouchableOpacity style={styles.container} onPress={handlePress}>
                    {type === 'name' && (
                    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
                        <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.8333 15.3077C17.3583 15.3077 16.0708 16.0192 15.33 17.0862L10.8675 14.7323C11.1558 14.2092 11.3333 13.6262 11.3333 13C11.3333 12.6131 11.2525 12.2469 11.1375 11.8946L15.78 9.44616C16.5408 10.2077 17.6225 10.6923 18.8333 10.6923C21.135 10.6923 23 8.97077 23 6.84615C23 4.72154 21.135 3 18.8333 3C16.5317 3 14.6667 4.72154 14.6667 6.84615C14.6667 7.23308 14.7475 7.59922 14.8625 7.9523L10.22 10.4C9.45917 9.63923 8.3775 9.15385 7.16667 9.15385C4.865 9.15385 3 10.8754 3 13C3 15.1246 4.865 16.8462 7.16667 16.8462C8.11667 16.8462 8.98249 16.5415 9.68332 16.0477L14.7125 18.7385C14.6958 18.8769 14.6667 19.0108 14.6667 19.1538C14.6667 21.2785 16.5317 23 18.8333 23C21.135 23 23 21.2785 23 19.1538C23 17.0292 21.135 15.3077 18.8333 15.3077Z"
                        fill="white"
                        />
                    </Svg>
                    )}

                    <Text style={styles.text}>{text}</Text>
                </TouchableOpacity>
            ) : (
                <Text style={styles.sended}>Mật khẩu mới đã gửi qua email</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: colors._input,
        borderRadius: 99,
        height: 52,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        display: "flex",
        flexDirection: "row",
        gap: 10,
    },
    text: {
        fontFamily: "Rounded Mplus 1c Bold",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: 18,
        lineHeight: 20,
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        letterSpacing: -0.5,
        color: colors.white,
    },
    sended: {
        height: 52,
        fontFamily: "Rounded Mplus 1c Bold",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: 18,
        lineHeight: 20,
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        letterSpacing: -0.5,
        color: colors._promptPassword,
    }
})

