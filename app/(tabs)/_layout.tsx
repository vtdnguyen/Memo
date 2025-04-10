import { Redirect, Tabs } from 'expo-router';
import { View, StatusBar, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {TabBar} from '@/components/ui/TabBar'
import { useSession } from '../auth/ctx';

export default function TabLayout() {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/onboarding" />;
  }
  return (
    
    <SafeAreaProvider>
      <View style={{ flex: 1}}>
        <Tabs tabBar={(props) => <TabBar {...props} />} >
          <Tabs.Screen name="explore" options={{title: 'Explore' , headerShown: false}} />
          <Tabs.Screen name="index" options={{title: 'Bket', headerShown: false}} />
          <Tabs.Screen name="friend" options={{title: 'Friend' , headerShown: false}} />
        </Tabs>
      </View>
    </SafeAreaProvider>
  );
}