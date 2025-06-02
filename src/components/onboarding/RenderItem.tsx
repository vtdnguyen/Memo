import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { OnboardingData } from "./data";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from 'lottie-react-native';

type Props = {
  index: number;
  x: SharedValue<number>;
  item: OnboardingData;
};

const RenderItem = ({ index, x, item }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const lottieAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(x.value === index * SCREEN_WIDTH ? 0 : 200, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  // const iconAnimationStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         translateY: withSpring(x.value === index * SCREEN_WIDTH ? 0 : 200, {
  //           damping: 15,
  //           stiffness: 100,
  //         }),
  //       },
  //     ],
  //   };
  // });

  const circleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(x.value === index * SCREEN_WIDTH ? 4 : 1, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  // const getIconName = () => {
  //   switch (index) {
  //     case 0:
  //       return "rocket-launch";
  //     case 1:
  //       return "account-group";
  //     case 2:
  //       return "message-text";
  //     default:
  //       return "rocket-launch";
  //   }
  // };

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH,
              borderRadius: SCREEN_WIDTH / 2,
              backgroundColor: item.backgroundColor,
            },
            circleAnimation,
          ]}
        />
      </View>
      <Animated.View style={lottieAnimationStyle}>
        <LottieView
          source={item.animation}
          style={{
            width: SCREEN_WIDTH * 0.9,
            height: SCREEN_WIDTH * 0.9,
          }}
          autoPlay
          loop
        />
      </Animated.View>
      <Text style={[styles.itemText, { color: item.textColor }]}>
        {item.text}
      </Text>
    </View>
  );

  // return (
  //   <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
  //     <View style={styles.circleContainer}>
  //       <Animated.View
  //         style={[
  //           {
  //             width: SCREEN_WIDTH,
  //             height: SCREEN_WIDTH,
  //             borderRadius: SCREEN_WIDTH / 2,
  //             backgroundColor: item.backgroundColor,
  //           },
  //           circleAnimation,
  //         ]}
  //       />
  //     </View>
  //     <Animated.View style={iconAnimationStyle}>
  //       <MaterialCommunityIcons
  //         name={getIconName()}
  //         size={SCREEN_WIDTH * 0.5}
  //         color={item.textColor}
  //         style={styles.icon}
  //       />
  //     </Animated.View>
  //     <Text style={[styles.itemText, { color: item.textColor }]}>
  //       {item.text}
  //     </Text>
  //   </View>
  // );
};

export default RenderItem;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 120,
  },
  itemText: {
    textAlign: "center",
    fontSize: 44,
    fontWeight: "bold",
    marginBottom: 10,
    marginHorizontal: 20,
    fontFamily: "Raleway",
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  icon: {
    marginBottom: 20,
  },
});
