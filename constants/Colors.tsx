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
    outline: '#C8A673',
    textCol: 'rgba(255, 255, 255, 0.7)',
    bg: 'rgba(255, 255, 255, 0.1)'

    _error: '#FF6B6B',
    _background: '#1f1f1f',
    _copied: '#DDDDDD',
    _promptPassword: '#848080',
    _promptPasswordNotice: '#F58F0A',
    _icon: '#AFACAC',
    _input: '#454343',
    _popup: '#D9D9D9',
    _confirmButton: '#FFC877',
    _overlay: 'rgba(135, 135, 135, 0.18)',
    _privacyPolicy: '#454343',
    _privacyPolicyText: '#979797',
    _borderAvatar: '#3A3A3A',
    _subject: '#787878',

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
