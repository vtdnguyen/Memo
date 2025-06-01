import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, View, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { persistor, store } from "@/src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { SocketMessageProvider } from "@/src/contexts/SocketContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const RootLayoutNav = () => {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default function RootLayout() {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor("transparent");
  
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>

    <SocketMessageProvider>
      <Provider store={store}>
        <PersistGate
          loading={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          }
          persistor={persistor}
          onBeforeLift={async () => {
            await SplashScreen.hideAsync();
          }}
        >

            <RootLayoutNav />

        </PersistGate>
      </Provider>
    </SocketMessageProvider>
    </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});