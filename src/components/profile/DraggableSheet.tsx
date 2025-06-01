import { View, StyleSheet, Dimensions } from "react-native";
import React, { useContext, useEffect, useRef } from "react";
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
import { TabBarContext } from "../../../app/(tabs)/_layout";

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
  const tabBarContext = useContext(TabBarContext);
  
  // Sử dụng ref để tránh crash khi component unmount
  const isMountedRef = useRef(true);
  const translateYOnMount = useSharedValue(SCREEN_HEIGHT);
  
  useEffect(() => {
    translateYOnMount.value = withSpring(0, SPRING_CONFIG);
    tabBarContext?.hideTabBar?.();
    
    // Cleanup khi component unmount
    return () => {
      isMountedRef.current = false;
      // Chỉ show tab bar nếu component vẫn còn mounted và context tồn tại
      try {
        if (tabBarContext?.showTabBar) {
          tabBarContext.showTabBar();
        }
      } catch (error) {
        console.log('Error in cleanup:', error);
      }
    };
  }, []);

  const totalTranslateY = useDerivedValue(() => {
    return translateY.value + translateYOnMount.value;
  });

  const opacity = useDerivedValue(() => {
    return interpolate(
      totalTranslateY.value,
      [0, DRAG_DISMISS_THRESHOLD],
      [MAX_OPACITY, MIN_OPACITY],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  });
  
  const scale = useDerivedValue(() => {
    return interpolate(
      totalTranslateY.value,
      [0, DRAG_DISMISS_THRESHOLD],
      [1, 0.95],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  });

  // Hàm helper để handle close một cách an toàn
  const handleClose = () => {
    try {
      if (isMountedRef.current) {
        // Show tab bar trước khi close
        tabBarContext?.showTabBar?.();
        // Delay một chút để đảm bảo tab bar được show
        setTimeout(() => {
          if (isMountedRef.current) {
            onClose();
          }
        }, 50);
      }
    } catch (error) {
      console.log('Error in handleClose:', error);
      // Vẫn gọi onClose nếu có lỗi
      if (isMountedRef.current) {
        onClose();
      }
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      active.value = true;
    })
    .onUpdate((e) => {
      if (e.translationY > 0) {
        const resistance = 0.9;
        translateY.value = e.translationY * resistance;
      } else {
        // Reset về 0 nếu kéo lên
        translateY.value = 0;
      }
    })
    .onEnd((e) => {
      active.value = false;
      
      const shouldClose = 
        totalTranslateY.value > DRAG_DISMISS_THRESHOLD ||
        (e.velocityY > 750 && totalTranslateY.value > SCREEN_HEIGHT * 0.15);
    
      if (shouldClose) {
        // Không gọi showTabBar ở đây, để handleClose xử lý
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, (finished) => {
          if (finished && isMountedRef.current) {
            runOnJS(handleClose)();
          }
        });
      } else {
        // Animation spring back với callback an toàn hơn
        translateY.value = withSpring(0, SPRING_CONFIG, (finished) => {
          if (finished && isMountedRef.current && tabBarContext?.showTabBar) {
            runOnJS(() => {
              try {
                tabBarContext.showTabBar();
              } catch (error) {
                console.log('Error showing tab bar:', error);
              }
            })();
          }
        });
      }
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: totalTranslateY.value },
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
