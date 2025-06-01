import { Stack } from "expo-router";
import { ImageProvider } from "@/src/contexts/ImageContext"; // Add this import

export default function HomeLayout() {
  return (
    <ImageProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="config" />
        <Stack.Screen name="edit" />
      </Stack>
    </ImageProvider>
  );
}
