import { ReactElement } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { ChevronRight } from "lucide-react-native";
import { colors } from "@/constants/Colors";
import { logout } from "@/src/redux/slices/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";
interface ProfileFunctionProps {
    functionName: string;
    icon: ReactElement;
    position: 'top' | 'middle' | 'bottom';
}



export default function ProfileFunction({ functionName, icon, position }: ProfileFunctionProps) {
    const borderRadius = position === 'top' ? {borderTopLeftRadius: 20, borderTopRightRadius: 20} : position === 'bottom' ? {borderBottomLeftRadius: 20, borderBottomRightRadius: 20} : {borderRadius: 0};
    const dispatch = useAppDispatch();
    const handleFunction = () => {
        if (functionName === 'Đăng xuất') {
            dispatch(logout());
        }
        console.log(functionName);
    }

    return (
        <TouchableOpacity style={[styles.container, borderRadius]} onPress={handleFunction} activeOpacity={0.8}>
            {icon}
            <Text style={[styles.functionName, {color: functionName === 'Xóa tài khoản' ? colors._deleteAccount : colors._functionName}]}>{functionName}</Text>
            <View style={styles.iconContainer}>
                <ChevronRight size={28} color={colors._privacyPolicyText} />
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        display: 'flex',
        backgroundColor: colors._functionContainer,
        paddingHorizontal: 20,
        paddingVertical: 22,
        gap: 10,
        marginVertical: 1,
    },
    functionName: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Rounded Mplus 1c Bold',
        fontStyle: 'normal',
        lineHeight: 20,
    },
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
    }
})
