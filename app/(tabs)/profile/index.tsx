import { colors } from "@/constants/Colors";
import AddFriend from "@/src/components/profile/addFriend";
import Subject from "@/src/components/profile/subject";
import Avatar from "@/src/components/profile/avatar";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { logout } from "@/src/redux/slices/authSlice";
import { RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Mail, User, Send, CircleAlert, LogOut, Trash2, TriangleAlert } from 'lucide-react-native'
import ProfileFunction from "@/src/components/profile/profileFunction";

export default function ProfileScreen() {
  const { height } = Dimensions.get('window');
  const screenHeight = height - 0.1*height;
  
  return (
    <View style={{flex: 1}}>
      <ScrollView style={[styles.container, {maxHeight: screenHeight}]} showsVerticalScrollIndicator={false} >
          <Avatar />
        <AddFriend />
        <View style={styles.subjectContainer}>
          <Subject subject="Tổng quát" icon={<User color={colors.white} size={28} />} />
          <ProfileFunction functionName="Thay đổi địa chỉ email" icon={<Mail color={colors.white} size={28} />} position="top" />
          <ProfileFunction functionName="Đề xuất" icon={<Send color={colors.white} size={28} />} position="middle" />
          <ProfileFunction functionName="Báo cáo vấn đề" icon={<CircleAlert color={colors.white} size={28} />} position="bottom" />
        </View>
        <View style={styles.subjectContainer}>
          <Subject subject="Thoát" icon={<TriangleAlert color={colors.white} size={28} />} />
          <ProfileFunction functionName="Đăng xuất" icon={<LogOut color={colors.white} size={28} />} position="top" />
          <ProfileFunction functionName="Xóa tài khoản" icon={<Trash2 color={colors._deleteAccount} size={28} />} position="bottom" />
        </View>
      </ScrollView>
      <View style={{height: height - screenHeight, backgroundColor: colors.background}}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 20,
  },
  subjectContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 10,
  }
});
