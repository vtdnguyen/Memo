import { colors } from '@/constants/Colors';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface AuthPopupProps {
    title: string;
    description: string;
    setIsVisiblePopup: (state: boolean) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function AuthPopup({ title, description, setIsVisiblePopup }: AuthPopupProps) {
    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => setIsVisiblePopup(false)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: Math.min(screenWidth - 40, 350),
        backgroundColor: colors._popup || '#ffffff',
        borderRadius: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
    },
    content: {
        padding: 24,
    },
    titleContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'left',
        fontFamily: 'Poppins',
        lineHeight: 28,
        letterSpacing: -0.3,
        color: colors.black || '#1a1a1a',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        textAlign: 'left',
        fontFamily: 'Inter',
        fontWeight: '400',
        lineHeight: 24,
        letterSpacing: -0.2,
        color: colors.black ? `${colors.black}CC` : '#4a4a4a',
    },
    buttonContainer: {
        alignItems: 'flex-end',
        marginTop: 8,
    },
    button: {
        backgroundColor: colors.primary || '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins',
        color: '#ffffff',
        letterSpacing: -0.2,
    },
});