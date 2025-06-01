import { colors } from '@/constants/Colors';
import { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

interface AuthPopupProps {
    title: string;
    description: string;
    setIsVisiblePopup: (state: boolean) => void;
}

export default function AuthPopup({ title, description, setIsVisiblePopup }: AuthPopupProps) {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
            <Text style={styles.button} onPress={() => setIsVisiblePopup(false)}>OK</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 100,
        top: '50%',
        left: '50%',
        width: 330,
        height: 150,
        transform: [
          { translateX: -165 },
          { translateY: -75 }
        ],
        backgroundColor: colors._popup,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        alignItems: 'stretch',
        justifyContent: 'space-around',
      },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'left',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        lineHeight: 28,
        letterSpacing: -0.5,
        color: colors.black,
        display: 'flex',
        alignItems: 'center',
    },
    description: {
        paddingHorizontal: 6,
        fontSize: 20,
        textAlign: 'left',
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '300',
        lineHeight: 20,
        letterSpacing: -0.5,
        color: colors.black,
    },
    button: {
        borderRadius: 5,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        color: colors.black,
        display: 'flex',
        alignItems: 'center',
        letterSpacing: -0.5,
        lineHeight: 14,
        textAlignVertical: 'center',
        // marginHorizontal: 270,
        marginRight: 50,
        marginBottom: 8,
        // minHeight: 50,
        // zIndex: 100
    } 
});
