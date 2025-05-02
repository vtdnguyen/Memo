import { View, Text, TouchableOpacity, StyleSheet, Animated as RNAnimated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { AntDesign, Feather } from '@expo/vector-icons';
import { NavigationState, ParamListBase } from '@react-navigation/native';
import { colors } from '@/constants/Colors';
import TabBarButton from './TabBarButton';

interface BottomTabBarProps {
  state: NavigationState;
  descriptors: {
    [key: string]: {
      options: {
        tabBarLabel?: string;
        title?: string;
      };
    };
  };
  navigation: {
    emit: (event: {
      type: string;
      target: string;
      canPreventDefault?: boolean;
    }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string, params?: object) => void;
  };
  visible: boolean;
}

export function TabBar({ state, descriptors, navigation, visible }: BottomTabBarProps): JSX.Element {
  const primaryColor = '#FFC877';
  const greyColor = '#88889D';
  
  // Animation for showing/hiding tab bar
  const translateY = useRef(new RNAnimated.Value(0)).current;
  
  useEffect(() => {
    RNAnimated.spring(translateY, {
      toValue: visible ? 0 : 100,
      useNativeDriver: true,
      tension: 100,
      friction: 12,
    }).start();
  }, [visible]);

  return (
    <RNAnimated.View 
      style={[
        styles.tabbar, 
        { transform: [{ translateY }] }
      ]}
    >
      {state.routes.map((route, index) => {
        if (route.name === '(message)') {
          return null;
        }
        const { options } = descriptors[route.key];
        
        // Handle the label properly with the correct type
        let label: string = route.name;
        if (typeof options.tabBarLabel === 'string') {
          label = options.tabBarLabel;
        } else if (typeof options.title === 'string') {
          label = options.title;
        }

        if(['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate(route.name, { merge: true });
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
            key={route.name}
            style={styles.tabbarItem}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? primaryColor : greyColor}
            label={label}
          />
        );
      })}
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute', 
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: 'continuous',
    zIndex: 1000,
  },
  tabbarItem: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  }
});