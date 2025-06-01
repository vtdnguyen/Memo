import { colors } from "@/constants/Colors";
import AddFriend from "@/src/components/profile/addFriend";
import Subject from "@/src/components/profile/subject";
import Avatar from "@/src/components/profile/avatar";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { logout } from "@/src/redux/slices/authSlice";
import { RootState } from "@/src/redux/store";
import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
// import { Mail, User, Send, CircleAlert, LogOut, Trash2, TriangleAlert } from 'lucide-react-native'
import { Feather } from "@expo/vector-icons";
import {  TabBarContext } from "../_layout";

import ProfileFunction from "@/src/components/profile/profileFunction";
import { FriendRequestScreen } from "@/src/components/profile/friendRequestScreen";
import { getUser } from "@/src/redux/slices/authSlice";
import { ChangeEmail } from "@/src/components/profile/changeEmail";
import { DraggableSheet } from "@/src/components/profile/DraggableSheet";
import { ChangeName } from "@/src/components/profile/changeName";
import { SendSuggest } from "@/src/components/profile/sendSuggest";
import { SendReport } from "@/src/components/profile/sendReport";
import { LogoutPopup } from "@/src/components/profile/logout";

export default function ProfileScreen() {
  const { hideTabBar, showTabBar } = useContext(TabBarContext);

  const { height } = Dimensions.get('window');
  const screenHeight = height - 90;

  const [friendRequestVisible, setFriendRequestVisible] = useState(false);
  const [changeEmailVisible, setChangeEmailVisible] = useState(false);
  const [changeNameVisible, setChangeNameVisible] = useState(false);

  const [sendSuggestVisible, setSendSuggestVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);

  const [logoutVisible, setLogoutVisible] = useState(false);


  const handleOpenFriendRequest = () => {
    setFriendRequestVisible(true);
  };

  const handleOpenChangeEmail = () => {
    setChangeEmailVisible(true);
  };

  const handleOpenChangeName = () => {
    setChangeNameVisible(true);
  };

  const handleOpenSendSuggest = () => {
    setSendSuggestVisible(true);
  };

  const handleOpenReport = () => {
    setReportVisible(true);
  };

  const handleOpenLogout = () => {
    setLogoutVisible(true);
  };

  const visible = changeEmailVisible || friendRequestVisible || changeNameVisible || sendSuggestVisible || reportVisible || logoutVisible;



  
  return (
    <View style={{flex: 1, position: 'relative'}}>
      <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: visible ? 'flex' : 'none'}}>
        {
          changeEmailVisible ? 
            <DraggableSheet onClose={() => setChangeEmailVisible(false)}>
              <ChangeEmail onClose={() => setChangeEmailVisible(false)} />
            </DraggableSheet> : 
          friendRequestVisible ? 
            <FriendRequestScreen onClose={() => setFriendRequestVisible(false)} /> : 
          changeNameVisible ? 
            <DraggableSheet onClose={() => setChangeNameVisible(false)}>
              <ChangeName onClose={() => setChangeNameVisible(false)} />
            </DraggableSheet> : 
          sendSuggestVisible ? 
            <DraggableSheet onClose={() => setSendSuggestVisible(false)}>
              <SendSuggest onClose={() => setSendSuggestVisible(false)} />
            </DraggableSheet> : 
          reportVisible ? 
            <DraggableSheet onClose={() => setReportVisible(false)}>
              <SendReport onClose={() => setReportVisible(false)} />
            </DraggableSheet> : null
        }
      </View>
        {logoutVisible && <LogoutPopup onClose={() => setLogoutVisible(false)} />}
      <ScrollView style={[styles.container, {height: screenHeight}]} showsVerticalScrollIndicator={false} >
        <Avatar onPress={handleOpenChangeName} />
        <TouchableOpacity onPress={handleOpenFriendRequest} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <AddFriend />
        </TouchableOpacity>
        <View style={styles.subjectContainer}>
          <Subject subject="Tổng quát" icon={<Feather name='user' color={colors.white} size={28} />} />
          <ProfileFunction onPress={handleOpenChangeEmail} functionName="Thay đổi địa chỉ email" icon={<Feather name='mail' color={colors.white} size={28} />} position="top" />
          <ProfileFunction onPress={handleOpenSendSuggest} functionName="Đề xuất" icon={<Feather name='send' color={colors.white} size={28} />} position="middle" />
          <ProfileFunction onPress={handleOpenReport} functionName="Báo cáo vấn đề" icon={<Feather name="alert-circle" color={colors.white} size={28} />} position="bottom" />
        </View>
        <View style={styles.subjectContainer}>
          <Subject subject="Thoát" icon={<Feather name="alert-triangle" color={colors.white} size={28} />} />
          <ProfileFunction onPress={handleOpenLogout} functionName="Đăng xuất" icon={<Feather name='log-out' color={colors.white} size={28} />} position="top" />
          <ProfileFunction functionName="Xóa tài khoản" icon={<Feather name='trash-2' color={colors._deleteAccount} size={28} />} position="bottom" />
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
    paddingHorizontal: 20,
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
