import { View, Text, StyleSheet } from "react-native";
import MiniAvatar from './../auth/miniAvatar';
import { useSelector } from 'react-redux';

export default function AddFriend() {
  const user = useSelector((state: any) => state.user);
  const link = `memo.vie/${user.username}` ;
  return (
    <View style={styles.container}>
      <MiniAvatar image="https://i.pinimg.com/736x/49/22/1a/49221aedd90e2a61db6a50de9bf0c173.jpg" />
      <View style={styles.textContainer}>
        <Text style={styles.textAbove}>Mời bạn bè dùng Memo</Text>
        <Text style={styles.textBelow}>{user.name}</Text>
      </View>
      <View style={styles.iconContainer}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 7.33301C18.0188 7.33301 19.25 6.10179 19.25 4.58301C19.25 3.06422 18.0188 1.83301 16.5 1.83301C14.9812 1.83301 13.75 3.06422 13.75 4.58301C13.75 6.10179 14.9812 7.33301 16.5 7.33301Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.5 13.75C7.01878 13.75 8.25 12.5188 8.25 11C8.25 9.48122 7.01878 8.25 5.5 8.25C3.98122 8.25 2.75 9.48122 2.75 11C2.75 12.5188 3.98122 13.75 5.5 13.75Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.5 20.167C18.0188 20.167 19.25 18.9358 19.25 17.417C19.25 15.8982 18.0188 14.667 16.5 14.667C14.9812 14.667 13.75 15.8982 13.75 17.417C13.75 18.9358 14.9812 20.167 16.5 20.167Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.87415 12.3838L14.135 16.0321" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.1258 5.96777L7.87415 9.61611" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3A3A3A',
    borderRadius: 20,
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#787878',
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAbove: {
    fontFamily: 'Poppins',
    fontSize: 16,
    lineHeight: 26,
    color: '#FFFFEF',
    fontWeight: '400',
    fontStyle: 'normal',
  },
  textBelow: {
    fontFamily: 'Poppins',
    fontSize: 14,
    lineHeight: 22,
    color: '#EDEDED',
    fontWeight: '400',
    fontStyle: 'normal',
  },
});

