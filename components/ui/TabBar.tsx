import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButton from './TabBarButton';
import { useEffect, useLayoutEffect, useState } from 'react';
import Animated, { useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import {useAnimatedStyle} from 'react-native-reanimated';


export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height:20, width:100 });

  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (event: LayoutChangeEvent) => {
    setDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width
    })
  };
  
// Find the initial index of the active tab
  const initialIndex = state.index; // Use state.index to get the actual active tab
  const tabPositionX = useSharedValue(0);
  useLayoutEffect(() => {
    tabPositionX.value = withSpring(buttonWidth * initialIndex);
  }, [initialIndex, buttonWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }]
    }
  });

  return (
    <View onLayout={onTabbarLayout} style={styles.tabbar}>
      <Animated.View style={[animatedStyle, {
        position: 'absolute',
        backgroundColor: '#03396c', //30b363
        borderRadius: 35,
        marginHorizontal: 12,
        height: dimensions.height - 15,
        width: buttonWidth   - 25,
      }]}/>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index , {duration: 1200});
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
            <TabBarButton
                key = {route.name}
                onPress = {onPress}
                onLongPress = {onLongPress}
                isFocused = {isFocused}
                routeName={route.name}
                color={isFocused ? '#30b363' : '#222'}
                label ={label}
            />
//           <PlatformPressable
//             key={route.name}
//             href={buildHref(route.name, route.params)}
//             accessibilityState={isFocused ? { selected: true } : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarButtonTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             style={styles.tabbarItems}
//           >
//             {icon[route.name](isFocused ? '#673ab7' : colors.text)}
//             <Text style={{ color: isFocused ? '#673ab7' : colors.text }}>
//               {label}
//             </Text>
//           </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 35,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 5,
  }
});

