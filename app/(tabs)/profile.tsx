import { Text, View,  StyleSheet, Modal, Alert, Pressable, TouchableOpacity, Image } from 'react-native';
import { useFonts,Raleway_400Regular } from '@expo-google-fonts/dev';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '@/constants/Colors';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, } from '@/src/context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function Profile() {
  SplashScreen.hideAsync();
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const authContext = useAuth();
  const onLogout = authContext?.onLogout;
  const signOut = async () => {
    try {
      onLogout && await onLogout();
      Alert.alert("Success", "You have been logged out successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };
  return (
    <View style={[{ flex: 1 ,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
     }, styles.container]}>
      {/* Floating Avatar */}
      <Pressable style={[styles.avatarContainer]} onPress={() => setModalVisible(true)}>
        <View style={styles.avatarWrapper}>
        <Image
          source={require('@/assets/images/download.jpg')}
          style={{ width: 100, height: 100, borderRadius: 50 }}
          resizeMode="cover"
          
        />
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: colors.background,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    zIndex: 10,
    top: 100,
  },
  avatarWrapper: {
    padding: 5, // Add padding to create space between the border and the content
    borderColor: colors.primary,
    borderRadius: 60, // Adjust to match the outer border radius
    borderWidth: 3,
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