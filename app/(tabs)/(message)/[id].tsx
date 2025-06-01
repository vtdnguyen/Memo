import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Message } from "@/src/types/message";
import { colors } from "@/constants/Colors";
import { useMessage } from "@/src/hooks/useMessage";
import { formatTimeAgo } from "@/src/hooks/helper";
import { useAppSelector } from "@/src/redux/hooks";
import { RootState } from "@/src/redux/store";
// import { useSocketMessage } from "@/src/contexts/SocketContext";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { TabBarContext } from "../_layout";

// Mock messages for the chat - in a real app, you'd fetch these based on the friendId
// const mockMessages: Message[] = [
//   {
//     id: "1",
//     text: "Hey, how are you doing?",
//     timestamp: "10:00 AM",
//     sender: "them",
//   },
//   {
//     id: "2",
//     text: "I'm good! Just finished my work for today. How about you?",
//     timestamp: "10:02 AM",
//     sender: "me",
//   },
//   {
//     id: "3",
//     text: "Same here. Are we still meeting tomorrow for coffee?",
//     timestamp: "10:05 AM",
//     sender: "them",
//   },
//   {
//     id: "4",
//     text: "Yes, definitely! How about 2pm at the usual place?",
//     timestamp: "10:07 AM",
//     sender: "me",
//   },
//   {
//     id: "5",
//     text: "Sounds perfect. See you then!",
//     timestamp: "10:08 AM",
//     sender: "them",
//   },
// ];

export default function ChatScreen() {
  const { id: receiverId, name, avatar } = useLocalSearchParams();
  const [messageText, setMessageText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const currentUser = useAppSelector((state: RootState) => state.auth.user);
  // const socketMessage = useSocketMessage();
  const insets = useSafeAreaInsets();

  const { showTabBar, hideTabBar } = useContext(TabBarContext);

  const {
    messages,
    loading,
    error,
    sendMessage,
    isConnected,
    fetchMessages,
    setMessages,
  } = useMessage(receiverId as string);

  useEffect(() => {
    hideTabBar();
  }, [hideTabBar]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: messageText.trim(),
        sender: currentUser!,
        senderId: currentUser!.id,
        receiverId: receiverId as string,
        receiver: {
          id: receiverId as string,
          username: name as string,
          avatarId: "temp",
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          avatar: {
            id: "temp",
            url: avatar as string,
            name: "avatar",
            format: "image",
            key: "temp",
          },
        },
        createdAt: new Date().toISOString(),
      };

      sendMessage(messageText.trim());
      setMessages((prev: Message[]) => [...prev, newMessage]);
      setMessageText("");
    }
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const toggleEmojiPicker = () => {
    Keyboard.dismiss(); // close keyboard when emoji picker opens
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onEmojiSelected = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender.id === currentUser?.id;
    const showAvatar = !isOwnMessage;

    return (
      <View
        style={[
          styles.messageWrapper,
          isOwnMessage ? styles.ownMessageWrapper : styles.otherMessageWrapper,
        ]}
      >
        {showAvatar && (
          <Image
            source={{ uri: item.sender.avatar.url }}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.messageContainer,
            isOwnMessage ? styles.ownMessage : styles.otherMessage,
          ]}
        >
          {!isOwnMessage && (
            <Text style={styles.senderName}>{item.sender.username}</Text>
          )}
          { item.fileUri &&
            <Image 
              source={{ uri: item.fileUri }} 
              style={{ width: 200, height: 200 }} 
            />
           }
          <Text style={styles.messageContent}>{item.content}</Text>
          <Text style={styles.messageTime}>
            {formatTimeAgo(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Image
            source={{ uri: avatar as string }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{name}</Text>
            <Text style={styles.headerStatus}>
              {isConnected ? "Đang hoạt động" : "Đang kết nối..."}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Chat Content */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {!isConnected && (
          <View style={styles.connectionStatus}>
            <ActivityIndicator size="small" color={colors.white} />
            <Text style={styles.connectionStatusText}>Đang kết nối lại...</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={colors.danger}
            />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchMessages}
            >
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages as unknown as Message[]}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            // onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
          />
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor={colors.grey}
              multiline
              editable={isConnected}
            />
            <TouchableOpacity
              style={styles.emojiButton}
              disabled={!isConnected}
              onPress={toggleEmojiPicker}
            >
              <Feather name="smile" size={24} color={colors.grey} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!isConnected || !messageText.trim()) &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!isConnected || !messageText.trim()}
          >
            <Ionicons
              name="send"
              size={24}
              color={
                !isConnected || !messageText.trim() ? colors.grey : colors.white
              }
            />
          </TouchableOpacity>
        </View>
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <EmojiSelector
            onEmojiSelected={onEmojiSelected}
            showSearchBar={false}
            showTabs={true}
            showHistory={false}
            category={Categories.all}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.yellow,
    padding: 8,
  },
  connectionStatusText: {
    color: colors.white,
    fontSize: 14,
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: colors.white,
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    marginTop: 12,
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "85%",
  },
  ownMessageWrapper: {
    alignSelf: "flex-end",
  },
  otherMessageWrapper: {
    alignSelf: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "100%",
  },
  ownMessage: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 4,
  },
  senderName: {
    color: colors.grey,
    fontSize: 12,
    marginBottom: 4,
  },
  messageContent: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    color: colors.grey,
    fontSize: 11,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: colors.bg,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.outline,
    marginBottom: 0,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 4,
  },
  emojiButton: {
    padding: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.bg,
    opacity: 0.5,
  },
});
