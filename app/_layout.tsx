import { AuthProvider } from '@/src/context/AuthContext';
import { Stack } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from 'react';
import { StatusBar } from 'react-native';


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
        <RootLayoutNav />
    </AuthProvider>
  );
}