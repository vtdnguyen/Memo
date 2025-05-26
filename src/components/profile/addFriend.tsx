import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MiniAvatar from './../auth/miniAvatar';
import { useSelector } from 'react-redux';
import { defaultAvatar } from "@/constants/images";
import * as Clipboard from 'expo-clipboard';

export default function AddFriend() {
  const user = useSelector((state: any) => state.auth.user);
  console.log("user", user);
  const imageUrl = user.avatar ? user.avatar.url : defaultAvatar.avatarUrl;
  const link = `memo.vie/${user.username}`;

  const handleAddFriend = async () => {
    console.log("add friend");
    await Clipboard.setStringAsync(link);
    Alert.alert("Đã copy link", "Đã copy link vào clipboard");
  }

  return (
    <View style={styles.container}>
      <MiniAvatar image={imageUrl} />
      <View style={styles.textContainer}>
        <Text style={styles.textAbove}>Mời bạn bè dùng Memo</Text>
        <Text style={styles.textBelow}>memo.vie/{user.username}</Text>
      </View>
      <TouchableOpacity style={styles.iconContainer} onPress={handleAddFriend}>
        <svg width="26" height="26" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 7.33301C18.0188 7.33301 19.25 6.10179 19.25 4.58301C19.25 3.06422 18.0188 1.83301 16.5 1.83301C14.9812 1.83301 13.75 3.06422 13.75 4.58301C13.75 6.10179 14.9812 7.33301 16.5 7.33301Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.5 13.75C7.01878 13.75 8.25 12.5188 8.25 11C8.25 9.48122 7.01878 8.25 5.5 8.25C3.98122 8.25 2.75 9.48122 2.75 11C2.75 12.5188 3.98122 13.75 5.5 13.75Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.5 20.167C18.0188 20.167 19.25 18.9358 19.25 17.417C19.25 15.8982 18.0188 14.667 16.5 14.667C14.9812 14.667 13.75 15.8982 13.75 17.417C13.75 18.9358 14.9812 20.167 16.5 20.167Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.87415 12.3838L14.135 16.0321" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.1258 5.96777L7.87415 9.61611" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3A3A3A',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 16,
    marginTop: 20,
    width: '100%',
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  iconContainer: {
    backgroundColor: '#787878',
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  textAbove: {
    fontFamily: '',
    fontSize: 20,
    lineHeight: 26,
    color: '#FFFFEF',
    fontWeight: '500',
    fontStyle: 'normal',
  },
  textBelow: {
    fontFamily: '',
    fontSize: 18,
    lineHeight: 24,
    color: '#EDEDED',
    fontWeight: '400',
    fontStyle: 'normal',
  },
});

