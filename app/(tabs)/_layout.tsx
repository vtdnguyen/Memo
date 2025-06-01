import { Redirect, Tabs } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { TabBar } from "@/src/components/TabBar/TabBar";
import { createContext, useState, useCallback } from "react";
import { useAppSelector } from "@/src/redux/hooks";
import { colors } from "@/constants/Colors";
import { ImageProvider } from "@/src/contexts/ImageContext";

interface TabBarContextType {
  showTabBar: () => void;
  hideTabBar: () => void;
  isVisible: boolean;
  setTabBarVisible: (boolean: boolean) => void 
}

export const TabBarContext = createContext<TabBarContextType>({
  showTabBar: () => {},
  hideTabBar: () => {},
  isVisible: true,
  setTabBarVisible: (boolean) => boolean,
});

export default function TabLayout() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [tabBarVisible, setTabBarVisible] = useState<boolean>(true);
  const [zIndex, setZIndex] = useState<number>(100)


  const showTabBar = useCallback(() => {
    console.log('showTabBarshowTabBarshowTabBarshowTabBar');
    
    setTabBarVisible(true);
    setZIndex(1000)
  }, []);

  const hideTabBar = useCallback(() => {
    console.log('hideTabBarhideTabBarhideTabBarhideTabBar');
    
    setTabBarVisible(false);
    setZIndex(0)
  }, []);

  const tabBarContextValue = {
    showTabBar,
    hideTabBar,
    isVisible: tabBarVisible,
    setTabBarVisible
  };
  if (!isAuthenticated) {
    // console.log('unisAuthenticated ', isAuthenticated);
    return <Redirect href='/sign-in'/>
  }

  if (loading) {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  }



  return (
    <ImageProvider>

    <TabBarContext.Provider value={tabBarContextValue}>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
          }}
          tabBar={(props) => <TabBar {...props} visible={tabBarVisible} zIndex={zIndex} />}
        >
          <Tabs.Screen
            name="explore"
            options={{
              title: "Explore",
              tabBarLabel: "Explore",
            }}
          />
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarLabel: "Home",
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarLabel: "Profile",
            }}
          />
          <Tabs.Screen
            name="message"
            options={{
              title: "Message",
              tabBarLabel: "Message",
            }}
          />
        </Tabs>
      </View>
    </TabBarContext.Provider>
    </ImageProvider>

  );
}
