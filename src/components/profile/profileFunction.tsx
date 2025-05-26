import { ReactElement } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Platform } from "react-native"
import { ChevronRight } from "lucide-react-native";
import { colors } from "@/constants/Colors";

interface ProfileFunctionProps {
    functionName: string;
    icon: ReactElement;
    position: 'top' | 'middle' | 'bottom';
    onPress?: () => void;
}



export default function ProfileFunction({ functionName, icon, position, onPress }: ProfileFunctionProps) {
    const borderRadius = position === 'top' ? {borderTopLeftRadius: 20, borderTopRightRadius: 20} : position === 'bottom' ? {borderBottomLeftRadius: 20, borderBottomRightRadius: 20} : {borderRadius: 0};
    
    const fadeAnim = new Animated.Value(1);

   

    return (
        <Animated.View style={[ { width: '100%', opacity: fadeAnim }]}>
            <TouchableOpacity style={[styles.container, borderRadius]} activeOpacity={0.8} onPress={onPress}>
                {icon}
                <Text style={[styles.functionName, {color: functionName === 'Xóa tài khoản' ? colors._deleteAccount : colors._functionName}]}>{functionName}</Text>
                <View style={styles.iconContainer}>
                    <ChevronRight size={28} color={colors._privacyPolicyText} />
                </View>
            </TouchableOpacity>
        </Animated.View>
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
