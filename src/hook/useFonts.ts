// hooks/useFonts.ts
import * as Font from 'expo-font';

export const useCustomFonts = () => {
  return Font.useFonts({
    'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
  });
};
