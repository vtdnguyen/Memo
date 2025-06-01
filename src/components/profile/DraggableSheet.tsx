import { View, StyleSheet, Dimensions } from "react-native";
import React, { useContext, useEffect } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useDerivedValue,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import {  TabBarContext } from "../../../app/(tabs)/_layout";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const DRAG_DISMISS_THRESHOLD = SCREEN_HEIGHT * 0.35;
const MAX_OPACITY = 1;
const MIN_OPACITY = 0.5;
const SPRING_CONFIG = {
  damping: 25,
  stiffness: 120,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};


export const DraggableSheet: React.FC<Props> = ({ onClose, children }) => {
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);
  const { hideTabBar, showTabBar } = useContext(TabBarContext);

  
  const translateYOnMount = useSharedValue(SCREEN_HEIGHT);
  
  useEffect(() => {
    translateYOnMount.value = withSpring(0, SPRING_CONFIG);
    hideTabBar()
  }, []);

  const opacity = useDerivedValue(() => {
    return interpolate(
      translateY.value,
      [0, DRAG_DISMISS_THRESHOLD],
      [MAX_OPACITY, MIN_OPACITY],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      }
    );
  });

  const scale = useDerivedValue(() => {
    return interpolate(
      translateY.value,
      [0, DRAG_DISMISS_THRESHOLD],
      [1, 0.95],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      }
    );
  });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      active.value = true;
    })
    .onUpdate((e) => {
      if (e.translationY > 0) {
        const resistance = 0.9;
        translateY.value = e.translationY * resistance;
      }
    })
    .onEnd((e) => {
      active.value = false;
      showTabBar()
      
      const shouldClose = 
        translateY.value > DRAG_DISMISS_THRESHOLD || 
        (e.velocityY > 750 && translateY.value > SCREEN_HEIGHT * 0.15);
      
      if (shouldClose) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value + translateYOnMount.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.value,
        [0, DRAG_DISMISS_THRESHOLD],
        [0.5, 0],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
        }
      ),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, overlayStyle]} />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheetContainer, animatedContainerStyle]}>
          <View style={styles.topStickContainer}>
            <View style={styles.topStick} />
          </View>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -60,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "90%",
    backgroundColor: "#333",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  topStickContainer: {
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  topStick: {
    width: 50,
    height: 5,
    backgroundColor: "#888",
    borderRadius: 2.5,
  },
});