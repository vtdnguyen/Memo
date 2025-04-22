import { Redirect, Tabs } from 'expo-router';
import { View, StatusBar, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {TabBar} from '@/src/components/TabBar/TabBar'
import { useAuth } from '@/src/context/AuthContext';
import { createContext } from 'react';
export const TabBarContext = createContext({
  showTabBar: () => {},
  hideTabBar: () => {},
});

export default function TabLayout() {
  const authContext = useAuth();
  const authState = authContext?.authState;
  const isFirstTimeUser = authContext?.isFirstTimeUser;
  const loading = authContext?.loading;

  if (loading){
    return <Text style={{fontSize: 100}}>Loading...</Text>;
  }
     if (!authState?.authenticated) {
      if (isFirstTimeUser) {
        return <Redirect href={'/onboarding'} />;
      } else {
        return <Redirect href={'/sign-in'} />;
      }
    }

  return (
      <View style={{ flex: 1}}>
        <Tabs tabBar={(props) => <TabBar {...props} />} >
          <Tabs.Screen name="explore" options={{title: 'Explore' , headerShown: false}} />
          <Tabs.Screen name="index" options={{title: 'Bket', headerShown: false}} />
          <Tabs.Screen name="profile" options={{title: 'Profile' , headerShown: false}} />
        </Tabs>
      </View>
  );
}