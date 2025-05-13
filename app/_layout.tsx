import { AuthProvider } from '@/src/context/AuthContext';
import { Stack } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '@/src/redux/store';

const RootLayoutNav = () => {
  useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    }
    hideSplashScreen();
  },[])
    return (
      <>
      <Stack>
        
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
    );
  }

export default function RootLayout() {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');
  return (
    <AuthProvider>
        <Provider store={store}>
            <RootLayoutNav />
        </Provider>
    </AuthProvider>
  );
}