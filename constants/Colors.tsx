/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { StyleSheet } from 'react-native';



export const colors = 
  {
    primary: '#FFC877',
    secondary: '#88889D',
    white: '#FFFFFF',
    black: '#000000',
    grey: '#88889D',
    lightGrey: '#f2f7f4',
    darkGrey: '#333333',
    blue: '#007AFF',
    red: '#FF3B30',
    green: '#4CD964',
    yellow: '#FFCC00',
    background: '#272727',
  }


export const Colors = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6fbff',  //f2f7f4
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    fontFamily: 'Raleway',
    fontSize: 50,
  },
});
