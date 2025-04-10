import { Pressable, View, Platform, StyleSheet, Text } from 'react-native';
import { icon } from '@/constants/icon';  // Ensure correct import
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import { useEffect } from 'react';
import { AnimatedText } from 'react-native-reanimated/lib/typescript/component/Text';
import { useFonts, Raleway_500Medium } from '@expo-google-fonts/dev';

type IconType = {
    [key: string]: (props: { color: string }) => JSX.Element;
};

const TabBarButton = (
    {onPress, onLongPress, isFocused, routeName, color, label}:
    {onPress: () => void, onLongPress: () => void, isFocused: boolean, routeName: string, color: string, label: any}
) => {
    const icons: IconType = icon;

    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused , 
        {duration  : 400});
    }, [scale, isFocused]);

    const AnimatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return {
            opacity,
        };
    });

    const AnimatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);

        const top = interpolate(scale.value, [0, 1], [0, 9]);
        return {
            transform: [{ scale : scaleValue }],
            top
        };
    });

    const [fontsLoaded] = useFonts({
        Raleway: Raleway_500Medium, // Assign a string name for use in styles
      });

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItems}
        >
            <Animated.View style={[AnimatedIconStyle]}>
                {icons[routeName]({ color: isFocused ? '#FaFaFa' : '#222' })}
            </Animated.View>
            <Animated.Text style={[{ color: isFocused ? '#FaFaFa' : '#222', fontFamily: 'Raleway', fontSize: 12 } ,AnimatedTextStyle]}>
                {label}
            </Animated.Text>
        </Pressable>
    );
};

export default TabBarButton; 

const styles = StyleSheet.create({
    tabbarItems: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
    },
});
