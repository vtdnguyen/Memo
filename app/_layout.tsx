import { Stack } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from 'react';
import { SessionProvider } from './auth/ctx';

export default function RootLayout() {
  useEffect(() => {
    async function hideSplashScreen() {
      await SplashScreen.preventAutoHideAsync(); // Ensure it's prevented first
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      await SplashScreen.hideAsync(); // Hide it
    }
    hideSplashScreen();
  }, []);
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SessionProvider>
  );
}