import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Image
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Message } from './types';
import { colors } from '@/constants/Colors';

// Mock messages for the chat - in a real app, you'd fetch these based on the friendId
const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey, how are you doing?',
    timestamp: '10:00 AM',
    sender: 'them',
  },
  {
    id: '2',
    text: 'I\'m good! Just finished my work for today. How about you?',
    timestamp: '10:02 AM',
    sender: 'me',
  },
  {
    id: '3',
    text: 'Same here. Are we still meeting tomorrow for coffee?',
    timestamp: '10:05 AM',
    sender: 'them',
  },
  {
    id: '4',
    text: 'Yes, definitely! How about 2pm at the usual place?',
    timestamp: '10:07 AM',
    sender: 'me',
  },
  {
    id: '5',
    text: 'Sounds perfect. See you then!',
    timestamp: '10:08 AM',
    sender: 'them',
  },
];

export default function ChatRoomScreen() {
  const { id, name,avatar } = useLocalSearchParams<{ id: string, name: string , avatar:string }>();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Scroll to the bottom of the messages
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      timestamp,
      sender: 'me',
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Scroll to the new message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleBack = () => {
    router.back();
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessageContainer : styles.theirMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myMessageBubble : styles.theirMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'me' ? styles.myMessageText : styles.theirMessageText
        ]}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textCol} />
        </TouchableOpacity>
        
        <View style={styles.avatarContainer}>
          <TouchableOpacity 
            style={styles.friendContainer}
            activeOpacity={0.8} // Improved tactile feedback
          >
              <View
                style={[
                styles.avatarRing
                ]}
              >
                <Image 
                  source={{ uri: avatar }}
                  style={styles.avatar}
                />
              </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.optionsButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={true}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background  ,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  backButton: {
    padding:5
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerName: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textCol
  },
  optionsButton: {
    paddingLeft: 10,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  myMessageBubble: {
    backgroundColor: '#007AFF',
  },
  theirMessageBubble: {
    backgroundColor: '#e5e5ea',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 11,
    color: '#8e8e93',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  keyboardAvoidingView: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#efefef',
  },
  textInputWrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  input: {
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 3,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#888888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});