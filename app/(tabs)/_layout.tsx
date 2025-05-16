import { Redirect, Tabs } from 'expo-router';
import { View, StatusBar, Text, Keyboard } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TabBar } from '@/src/components/TabBar/TabBar';
import { useAuth } from '@/src/context/AuthContext';
import { createContext, useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '@/src/redux/hooks';
interface TabBarContextType {
  showTabBar: () => void;
  hideTabBar: () => void;
  isVisible: boolean;
}

export const TabBarContext = createContext<TabBarContextType>({
  showTabBar: () => {},
  hideTabBar: () => {},
  isVisible: true,
});

export default function TabLayout() {
  const authContext = useAuth();
  const authState = authContext?.authState;
  const isFirstTimeUser = useAppSelector(state => state.auth.isFirstTimeUser);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const loading = useAppSelector(state => state.auth.loading);
  const [tabBarVisible, setTabBarVisible] = useState<boolean>(true);

  // Handle keyboard visibility
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setTabBarVisible(false);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setTabBarVisible(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const showTabBar = useCallback(() => {
    setTabBarVisible(true);
  }, []);

  const hideTabBar = useCallback(() => {
    setTabBarVisible(false);
  }, []);

  const tabBarContextValue = {
    showTabBar,
    hideTabBar,
    isVisible: tabBarVisible,
  };

  if (loading) {
    return <Text style={{ fontSize: 100 }}>Loading...</Text>;
  }
  console.log("isAuthenticated", isAuthenticated);
  
  if (!isAuthenticated) {
    if (isFirstTimeUser) {
      return <Redirect href={'/onboarding'} />;
    } else {
      return <Redirect href={'/sign-in'} />;
    }
  }

  return (
    <TabBarContext.Provider value={tabBarContextValue}>
      <View style={{ flex: 1 }}>
        <Tabs tabBar={(props) => <TabBar {...props} visible={tabBarVisible} />}>
          <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarLabel: 'Explore', headerShown: false }} />
          <Tabs.Screen name="home" options={{ title: 'Home', tabBarLabel: 'Home', headerShown: false }} />
          <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarLabel: 'Profile', headerShown: false }} />
          <Tabs.Screen name="message" options={{ title: 'Message', tabBarLabel: 'Message', headerShown: false }} />
        </Tabs>
      </View>
    </TabBarContext.Provider>
  );
}