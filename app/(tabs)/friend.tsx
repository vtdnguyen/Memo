import { Text, View,  StyleSheet, Modal, Alert, Pressable, TouchableOpacity } from 'react-native';
import { useFonts,Raleway_400Regular } from '@expo-google-fonts/dev';
import * as SplashScreen from 'expo-splash-screen';
import {} from '@/constants/Colors';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Colors} from '@/constants/Colors';
import { useSession } from '../auth/ctx';

SplashScreen.preventAutoHideAsync();

export default function Friend() {
  SplashScreen.hideAsync();
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Raleway: Raleway_400Regular, // Assign a string name for use in styles
  });
  const { signOut } = useSession();
  return (
    <View style={[{ flex: 1 ,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
     }, Colors.container]}>
      {/* Floating Avatar */}
      <Pressable style={[styles.avatarContainer,{
        top: insets.top + 10,
        right: 20,
      }]} onPress={() => setModalVisible(true)}>
        <Feather name="smile" size={50} color="#fff" />
      </Pressable>
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => console.log('Edit Profile')} style={styles.modalButton}>
              <Text style={styles.modalText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Settings')} style={styles.modalButton}>
              <Text style={styles.modalText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => signOut()} style={styles.modalButton}>
              <Text style={[styles.modalText, { color: 'red' }]}>Logout</Text>
            </TouchableOpacity>
          </View> 
        </Pressable>
      </Modal>
      <Text style={[Colors.text]}>FRIENDS WW</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'absolute',
    zIndex: 10,
    borderColor: '#f6fbff',
    borderRadius: 50,
    borderWidth: 2,
    backgroundColor: '#03396c',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: '600',
  },
});