import { Redirect, Tabs } from "expo-router";
import { View, Text, Keyboard, ActivityIndicator } from "react-native";
import { TabBar } from "@/src/components/TabBar/TabBar";
import { createContext, useState, useEffect, useCallback } from "react";
import { useAppSelector } from "@/src/redux/hooks";
import { colors } from "@/constants/Colors";

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
  const { isFirstTimeUser, isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  const [tabBarVisible, setTabBarVisible] = useState<boolean>(true);

  // Handle keyboard visibility
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setTabBarVisible(false);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
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
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  }

  if (!isAuthenticated) {
    if (isFirstTimeUser) {
      return <Redirect href={"/onboarding"} />;
    } else {
      return <Redirect href={"/sign-in"} />;
    }
  }

  return (
    <TabBarContext.Provider value={tabBarContextValue}>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
          tabBar={(props) => <TabBar {...props} visible={tabBarVisible} />}
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
  );
}
