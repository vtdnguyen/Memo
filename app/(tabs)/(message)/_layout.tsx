import React, { useEffect, useContext } from 'react';
import { Stack } from 'expo-router';
import { TabBarContext } from '@/app/(tabs)/_layout';

export default function MessageLayout() {
  const { hideTabBar } = useContext(TabBarContext);

  // Hide the tab bar when entering any message screen
  useEffect(() => {
    hideTabBar();
    
    // No need to restore tabBar here as that's handled by the _layout.tsx
    // when navigating away from these screens
  }, [hideTabBar]);

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}