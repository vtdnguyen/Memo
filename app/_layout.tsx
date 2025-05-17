import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { Provider } from "react-redux";
import { persistor, store } from "@/src/redux/store";
import { PersistGate } from 'redux-persist/integration/react';

const RootLayoutNav = () => {
  useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplashScreen();
  }, []);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default function RootLayout() {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor("transparent");
  return (
    <Provider store={store}>
      <PersistGate loading={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      } persistor={persistor}>
        <RootLayoutNav />
      </PersistGate>
    </Provider>
  );
}
