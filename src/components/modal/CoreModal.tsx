import { colors } from '@/constants/Colors';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  BackHandler,
  ScrollView
} from 'react-native';

const { height } = Dimensions.get('window');

export interface TabConfig {
  key: string;
  title: string;
  content: React.ReactNode;
}

export interface CoreModalProps {
  visible: boolean;
  onClose: () => void;
  tabs: TabConfig[];
  initialTab?: string;
  modalHeight?: number;
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

export const CoreModal: React.FC<CoreModalProps> = ({
  visible,
  onClose,
  tabs,
  initialTab,
  modalHeight = height * 0.78,
  headerComponent,
  footerComponent,
  emptyComponent
}) => {
  // Animation values
  const translateY = useRef(new Animated.Value(height)).current;
  
  // State for tracking active tab
  const [activeTabKey, setActiveTabKey] = useState<string>(initialTab || (tabs.length > 0 ? tabs[0].key : ''));
  
  // Set up pan responder for swipe gesture handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0; // Only capture gesture when swiping down
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // If swiped down far enough, close modal
          hideModal();
        } else {
          // Otherwise, return to initial position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  // Show/hide modal based on visibility prop
  useEffect(() => {
    if (visible) {
      showModal();
    } else {
      hideModal();
    }
  }, [visible]);

  // Reset to initial tab when modal is opened
  useEffect(() => {
    if (visible && initialTab) {
      setActiveTabKey(initialTab);
    } else if (visible && tabs.length > 0) {
      setActiveTabKey(tabs[0].key);
    }
  }, [visible, initialTab, tabs]);

  // Handle back button press
  useEffect(() => {
    const handleBackPress = () => {
      if (visible) {
        hideModal(); // Close the modal when back button is pressed
        return true; // Prevent default navigation behavior
      }
      return false; // Allow default behavior if modal is not visible
    };

    // Add event listener for back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Cleanup listener on unmount or when visible changes
    return () => backHandler.remove();
  }, [visible]); // Re-run effect when visibility changes

  const showModal = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTabKey(tabKey);
  };

  // Find active tab content
  const activeTab = tabs.find(tab => tab.key === activeTabKey);
  const activeContent = activeTab?.content;

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={hideModal}
      />
      <Animated.View
        style={[
          styles.modalContainer,
          {
            height: modalHeight,
            transform: [
              {
                translateY: translateY.interpolate({
                  inputRange: [0, height],
                  outputRange: [0, height],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <View {...panResponder.panHandlers}>
          <View style={styles.dragIndicator} />
          
          {/* Custom Header if provided */}
          {headerComponent}
          
          {/* Tab Bar */}
          <View style={styles.tabBar}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTabKey === tab.key && styles.activeTab]}
                onPress={() => handleTabChange(tab.key)}
              >
                <Text style={[styles.tabText, activeTabKey === tab.key && styles.activeTabText]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Tab Content */}
          <View style={styles.content}>
            {activeContent ? activeContent : emptyComponent}
          </View>
          
          {/* Custom Footer if provided */}
          {footerComponent}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    elevation: 6,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D3D3D3',
    marginBottom: 10,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
  },
});

export default CoreModal;