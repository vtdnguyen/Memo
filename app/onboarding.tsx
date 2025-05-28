import { StyleSheet, View, FlatList, ViewToken, useWindowDimensions } from "react-native";
import React, { useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  withTiming,
} from "react-native-reanimated";
import data, { OnboardingData } from "@/src/components/onboarding/data";
import Pagination from "@/src/components/onboarding/Pagination";
import CustomButton from "@/src/components/onboarding/CustomButton";
import { SharedValue } from "react-native-reanimated";
import RenderItem from "@/src/components/onboarding/RenderItem";

const OnboardingScreen = () => {
  const flatListRef = useAnimatedRef<FlatList<OnboardingData>>();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      flatListIndex.value = withTiming(viewableItems[0].index!, {
        duration: 200,
      });
    }
  };
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
      flatListIndex.value = withTiming(event.contentOffset.x / SCREEN_WIDTH, {
        duration: 200,
      });
    },
  });
  const onViewRef = useRef(onViewableItemsChanged);

  console.log("flatListIndex", flatListIndex.value);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={data}
        renderItem={({ item, index }) => {
          return <RenderItem item={item} index={index} x={x} />;
        }}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{
          minimumViewTime: 500,
          viewAreaCoveragePercentThreshold: 50,
        }}
      />
      <View style={styles.bottomContainer}>
        <Pagination data={data} x={x} />
        <CustomButton
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={data.length}
          x={x}
        />
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 30,
    paddingVertical: 30,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
});
