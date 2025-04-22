import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
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
  }

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps): JSX.Element {

    const primaryColor = '#FFC877';
    const greyColor = '#88889D';
    
    return (
      <View style={styles.tabbar}>
        {state.routes.map((route, index) => {
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
      </View>
    );
};

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute', 
        bottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background,
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        borderCurve: 'continuous',
        
    },
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }
})
