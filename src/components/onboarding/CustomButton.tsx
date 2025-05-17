import {
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import Animated, {
  AnimatedRef,
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {OnboardingData} from '@/src/components/onboarding/data';
import { router } from 'expo-router';
import { completeOnboarding } from '@/src/redux/slices/authSlice';
import { useAppDispatch } from '@/src/redux/hooks';
import { LOCAL_URL } from '@/src/redux/slices/authSlice';

type Props = {
  dataLength: number;
  flatListIndex: SharedValue<number>;
  flatListRef: AnimatedRef<FlatList<OnboardingData>>;
  x: SharedValue<number>;
};

const CustomButton = ({flatListRef, flatListIndex, dataLength, x}: Props) => {
  const {width: SCREEN_WIDTH} = useWindowDimensions();

   const dispatch = useAppDispatch();
    
  const buttonAnimationStyle = useAnimatedStyle(() => {
    return {
      width:
        flatListIndex.value === dataLength - 1
          ? withSpring(140)
          : withSpring(60),
      height: 60,
    };
  });

  const arrowAnimationStyle = useAnimatedStyle(() => {
    return {
      width: 30,
      height: 30,
      opacity:
        flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
      transform: [
        {
          translateX:
            flatListIndex.value === dataLength - 1
              ? withTiming(100)
              : withTiming(0),
        },
      ],
    };
  });

  const textAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity:
        flatListIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX:
            flatListIndex.value === dataLength - 1
              ? withTiming(0)
              : withTiming(-100),
        },
      ],
    };
  });
  const animatedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      ['#30b363', '#13143e', '#163414'],
    );

    return {
      backgroundColor: backgroundColor,
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={async () => {
        const isLastSlide = flatListIndex.value >= dataLength - 1;

        if (!isLastSlide) {
          const nextIndex = flatListIndex.value + 1;
          flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
          flatListIndex.value = nextIndex;
        } else {
          try {
            const response = await dispatch(completeOnboarding());
            if (response.type === "auth/completeOnboarding/fulfilled") {
              console.log("Onboarding completed");
              router.push(`${LOCAL_URL}/sign-in`);
            } else {
              console.error("Error completing onboarding:", response);
            }
          } catch (err) {
            console.error("Dispatch failed:", err);
          }
        }
      }}
    >
      <Animated.View style={[styles.container, buttonAnimationStyle, animatedColor]}>
        <Animated.Text style={[styles.textButton, textAnimationStyle]}>
          Get Started
        </Animated.Text>
        <Animated.Image
          source={require('@/assets/onboarding/ArrowIcon.png')}
          style={[styles.arrow, arrowAnimationStyle]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>

  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e2169',
    padding: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
  },
  textButton: {color: 'white', fontSize: 18, position: 'absolute', fontFamily:'Raleway'},
});