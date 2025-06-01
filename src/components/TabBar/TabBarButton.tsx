import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import {icons} from './icons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';

interface TabBarButtonProps {
    isFocused: boolean;
    label: string;
    routeName: string;
    color: string;
    style?: object;
    onPress: () => void;
    onLongPress: () => void;
  }

const TabBarButton: React.FC<TabBarButtonProps> = (props) => {
  const { isFocused, label, routeName, color, ...rest } = props;

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : 0,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      scale.value,
      [0, 1.1],
      [1, 1.5]
    );
    const top = interpolate(
      scale.value,
      [0, 10],
      [0, 2]
    );

    return {
      transform: [{ scale: scaleValue }],
      top
    };
  });
  
//   const animatedTextStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(
//       scale.value,
//       [0, 1],
//       [1, 0]
//     );

//     return {
//       opacity
//     };
//   });
  const renderIcon = () => {
    if (icons[routeName as keyof typeof icons]) {
      return icons[routeName as keyof typeof icons]({ color });
    } else {
      // Fallback icon when the routeName doesn't exist in the icons object
      console.warn(`No icon found for route: ${routeName}`);
      return <AntDesign name="question" size={30} color={color} />;
    }
  };

  return (
    <Pressable {...rest} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
      {renderIcon()}
      </Animated.View>
      
      {/* <Animated.Text style={[{ 
        color,
        fontSize: 11
      }, animatedTextStyle]}>
        {label}
      </Animated.Text> */}
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4
    }
})