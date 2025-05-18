import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Animated,
  Dimensions,
  SafeAreaView,
  Alert
} from 'react-native';
import { colors } from "@/constants/Colors";
import { ArrowLeft, Search, X, UserPlus, Check, UserMinus, UserCheck } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

// Kiểu dữ liệu người dùng mở rộng
interface User {
  id: string;
  name: string;
  avatar: string;
  username: string;
  mutualFriends?: number;
  online?: boolean;
  lastActive?: string;
}

// Kiểu dữ liệu lời mời kết bạn
interface FriendRequest {
  id: string;
  user: User;
  date: string;
  message?: string;
}

// Dữ liệu giả lập phong phú hơn
const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Nguyễn Văn A', 
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg', 
    username: 'nguyenvana',
    mutualFriends: 5,
    online: true
  },
  { 
    id: '2', 
    name: 'Trần Thị B', 
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg', 
    username: 'tranthib',
    mutualFriends: 2,
    online: false,
    lastActive: '10 phút trước'
  },
  { 
    id: '3', 
    name: 'Lê Văn C', 
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg', 
    username: 'levanc',
    mutualFriends: 0,
    online: false,
    lastActive: '2 giờ trước'
  },
  { 
    id: '4', 
    name: 'Phạm Thị D', 
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg', 
    username: 'phamthid',
    mutualFriends: 8,
    online: true
  },
  { 
    id: '5', 
    name: 'Hoàng Văn E', 
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg', 
    username: 'hoangvane',
    mutualFriends: 1,
    online: false,
    lastActive: '1 ngày trước'
  },
];

const mockRequests: FriendRequest[] = [
  { 
    id: '1', 
    user: { 
      id: '6', 
      name: 'Dương Văn F', 
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg', 
      username: 'duongvanf',
      mutualFriends: 3,
      online: true
    },
    date: '2 giờ trước',
    message: 'Chào bạn, mình là Dương!'
  },
  { 
    id: '2', 
    user: { 
      id: '7', 
      name: 'Ngô Thị G', 
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg', 
      username: 'ngothig',
      mutualFriends: 7,
      online: false,
      lastActive: '5 phút trước'
    },
    date: '1 ngày trước'
  },
];

// Đề xuất kết bạn dựa trên bạn chung
const mockSuggestions: User[] = [
  { 
    id: '8', 
    name: 'Trịnh Văn H', 
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg', 
    username: 'trinhvanh',
    mutualFriends: 12,
    online: true
  },
  { 
    id: '9', 
    name: 'Lý Thị I', 
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg', 
    username: 'lythii',
    mutualFriends: 9,
    online: false,
    lastActive: '30 phút trước'
  },
];

export const FriendRequestScreen = ({ onClose }: { onClose: () => void }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(mockRequests);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'suggestions'>('requests');
  
  // Animated values
  const searchAnim = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const listTranslateY = useRef(new Animated.Value(20)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;
  
  // Refs để kiểm soát animation
  const animationsInitialized = useRef(false);

  useEffect(() => {
    if (!animationsInitialized.current) {
      // Animation ban đầu khi màn hình hiển thị
      Animated.parallel([
        Animated.timing(listTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(listOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
      animationsInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setSearchResults([]);
      
      // Animation khi xóa tìm kiếm
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(searchAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
      
      return;
    }

    // Animation khi bắt đầu tìm kiếm
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    setLoading(true);
    const handler = setTimeout(() => {
      // Tìm kiếm nâng cao: ưu tiên kết quả có tên chính xác hơn
      const result = mockUsers
        .filter(u => 
          u.name.toLowerCase().includes(searchText.toLowerCase()) ||
          u.username.toLowerCase().includes(searchText.toLowerCase())
        )
        .sort((a, b) => {
          // Ưu tiên người dùng có bạn chung
          if (a.mutualFriends !== b.mutualFriends) {
            return (b.mutualFriends || 0) - (a.mutualFriends || 0);
          }
          
          // Ưu tiên người dùng đang online
          if (a.online !== b.online) {
            return a.online ? -1 : 1;
          }
          
          // Sau đó ưu tiên theo độ chính xác khi tìm tên
          const aNameMatch = a.name.toLowerCase().indexOf(searchText.toLowerCase());
          const bNameMatch = b.name.toLowerCase().indexOf(searchText.toLowerCase());
          
          if (aNameMatch >= 0 && bNameMatch >= 0) {
            return aNameMatch - bNameMatch;
          }
          
          return 0;
        });
        
      setSearchResults(result);
      setLoading(false);

      // Animation khi hiển thị kết quả tìm kiếm
      Animated.sequence([
        Animated.timing(listOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(listTranslateY, {
          toValue: 10,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(listOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(listTranslateY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ])
      ]).start();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText]);

  const sendRequest = (id: string) => {
    // Animation khi gửi lời mời
    const buttonScale = new Animated.Value(1);
    
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
    
    setSentRequests(prev => ({ ...prev, [id]: true }));
    
    // Thông báo gửi lời mời thành công
    Alert.alert(
      "Đã gửi lời mời kết bạn",
      "Chúng tôi sẽ thông báo khi người dùng chấp nhận lời mời của bạn.",
      [{ text: "OK" }]
    );
  };

  const cancelRequest = (id: string) => {
    // Xác nhận trước khi hủy
    Alert.alert(
      "Hủy lời mời kết bạn",
      "Bạn có chắc muốn hủy lời mời kết bạn này?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xác nhận", 
          style: "destructive",
          onPress: () => {
            const updated = { ...sentRequests };
            delete updated[id];
            setSentRequests(updated);
          }
        }
      ]
    );
  };

  const handleFriendRequest = (requestId: string, accepted: boolean) => {
    // Animation khi xử lý lời mời
    const fadeAnim = new Animated.Value(1);
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Cập nhật danh sách lời mời sau khi animation hoàn thành
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      
      // Hiển thị thông báo phù hợp
      if (accepted) {
        Alert.alert(
          "Đã chấp nhận lời mời",
          "Người dùng đã được thêm vào danh sách bạn bè của bạn!",
          [{ text: "OK" }]
        );
      }
    });
  };

  const clearSearch = () => {
    setSearchText('');
    Keyboard.dismiss();
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const isSent = sentRequests[item.id];

    return (
      <Animated.View style={[styles.userCard, { opacity: listOpacity, transform: [{ translateY: listTranslateY }] }]}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {item.online && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <Text style={styles.username}>@{item.username}</Text>
          
          {item.mutualFriends !== undefined && item.mutualFriends > 0 && (
            <Text style={styles.mutualFriends}>{item.mutualFriends} bạn chung</Text>
          )}
          
          {!item.online && item.lastActive && (
            <Text style={styles.lastActive}>Hoạt động: {item.lastActive}</Text>
          )}
        </View>
        
        {isSent ? (
          <TouchableOpacity 
            style={styles.sentButton} 
            onPress={() => cancelRequest(item.id)}
            activeOpacity={0.7}
          >
            <UserCheck size={16} color={colors.white} />
            <Text style={styles.sentButtonText}>Đã gửi</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => sendRequest(item.id)}
            activeOpacity={0.7}
          >
            <UserPlus size={16} color={colors.white} />
            <Text style={styles.addButtonText}>Kết bạn</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  const renderRequestItem = ({ item }: { item: FriendRequest }) => {
    return (
      <Animated.View style={[styles.requestCard, { opacity: listOpacity, transform: [{ translateY: listTranslateY }] }]}>
        <View style={styles.requestHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            {item.user.online && <View style={styles.onlineIndicator} />}
          </View>
          
          <View style={styles.requestInfo}>
            <Text style={styles.name}>{item.user.name}</Text>
            <Text style={styles.username}>@{item.user.username}</Text>
            
            {item.user.mutualFriends !== undefined && item.user.mutualFriends > 0 && (
              <Text style={styles.mutualFriends}>{item.user.mutualFriends} bạn chung</Text>
            )}
            
            <Text style={styles.requestTime}>{item.date}</Text>
          </View>
        </View>
        
        {item.message && (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.rejectButton} 
            onPress={() => handleFriendRequest(item.id, false)}
            activeOpacity={0.7}
          >
            <UserMinus size={16} color={colors.white} />
            <Text style={styles.buttonText}>Từ chối</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.acceptButton} 
            onPress={() => handleFriendRequest(item.id, true)}
            activeOpacity={0.7}
          >
            <UserPlus size={16} color={colors.white} />
            <Text style={styles.buttonText}>Chấp nhận</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.white} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bạn bè</Text>
        </View>
        
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Search color={colors.lightGray} size={18} style={styles.searchIcon} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Tìm bạn bè..."
            placeholderTextColor={colors.lightGray}
            style={styles.input}
            onSubmitEditing={Keyboard.dismiss}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X color={colors.lightGray} size={18} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Tab navigation when not searching */}
        <Animated.View style={[styles.tabContainer, { opacity: headerOpacity }]}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
            onPress={() => setActiveTab('requests')}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
              Lời mời ({friendRequests.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]}
            onPress={() => setActiveTab('suggestions')}
          >
            <Text style={[styles.tabText, activeTab === 'suggestions' && styles.activeTabText]}>
              Gợi ý
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Content based on state */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
          </View>
        ) : searchText.trim() !== '' ? (
          // Search results
          <View style={styles.resultsContainer}>
            <Text style={styles.resultTitle}>Kết quả tìm kiếm</Text>
            {searchResults.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Image 
                  source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/free-search-not-found-1-1064057.png' }} 
                  style={styles.emptyImage} 
                />
                <Text style={styles.emptyText}>Không tìm thấy người dùng phù hợp với từ khóa</Text>
                <Text style={styles.emptySubtext}>Hãy thử tìm kiếm với từ khóa khác</Text>
              </View>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={item => item.id}
                renderItem={renderUserItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        ) : activeTab === 'requests' ? (
          // Friend requests
          <View style={styles.resultsContainer}>
            {friendRequests.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Image 
                  source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/free-empty-box-4085812-3385482.png' }} 
                  style={styles.emptyImage} 
                />
                <Text style={styles.emptyText}>Không có lời mời kết bạn nào</Text>
                <Text style={styles.emptySubtext}>Các lời mời kết bạn sẽ xuất hiện ở đây</Text>
              </View>
            ) : (
              <FlatList
                data={friendRequests}
                keyExtractor={item => item.id}
                renderItem={renderRequestItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        ) : (
          // Friend suggestions
          <View style={styles.resultsContainer}>
            <Text style={styles.resultTitle}>Gợi ý kết bạn</Text>
            <FlatList
              data={mockSuggestions}
              keyExtractor={item => item.id}
              renderItem={renderUserItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.lightGray,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.lightGray,
    marginTop: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  resultTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.cardBackground,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  username: {
    color: colors.lightGray,
    fontSize: 14,
  },
  mutualFriends: {
    color: colors.primary,
    fontSize: 12,
    marginTop: 2,
  },
  lastActive: {
    color: colors.lightGray,
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  sentButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  requestCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  requestHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  requestTime: {
    color: colors.lightGray,
    fontSize: 12,
    marginTop: 4,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  message: {
    color: colors.white,
    fontSize: 14,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: colors.success,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: colors.danger,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    color: colors.lightGray,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});