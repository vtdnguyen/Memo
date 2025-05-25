import React from 'react';
import { ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/home/IconButton';
import { colors } from '@/constants/Colors';

interface StatusRenderProps {
  statusName: string;
  onPress: () => void;
}

/**
 * Component that renders a custom button for each status
 * Hard-coded for each possible status to show appropriate icon and styling
 */
const StatusRender: React.FC<StatusRenderProps> = ({ statusName, onPress }) => {
  // Define the configuration for each status
  switch (statusName) {
    case 'Happy':
      return (
        <CustomButton
          text="Đang vui vẻ"
          textColor={colors.black}
          textStyle={{ fontSize: 16 }}
          iconType="AntDesign"
          iconName="smileo"
          iconSize={30}
          iconColor={colors.primary}
          iconPosition="right"
          backgroundColor={colors.white}
          borderRadius={20}
          onPress={onPress}
          style={{ marginRight: 10, marginBottom: 10 }}
        />
      );
    
    case 'Sad':
      return (
        <CustomButton
          text="Đang buồn"
          textColor={colors.black}
          textStyle={{ fontSize: 16 }}
          iconType="Ionicons"
          iconName="sad-outline"
          iconSize={30}
          iconColor="#5D8CAE" 
          iconPosition="right"
          backgroundColor={colors.white}
          borderRadius={20}
          onPress={onPress}
          style={{ marginRight: 10, marginBottom: 10 }}
        />
      );
    
    case 'Angry':
      return (
        <CustomButton
          text="Giận dỗiii"
          textColor={colors.white}
          textStyle={{ fontSize: 16 }}
          emoji = "👿"
          // iconType="FontAwesome6"
          // iconName="angry"
          // iconSize={30}
          // iconColor="#AA8DD8"
          // iconPosition="right"
          backgroundColor={'#9747FF'}
          borderRadius={20}
          onPress={onPress}
          style={{ marginRight: 10, marginBottom: 10 }}
        />
      );
    
    case 'Eating':
      return (
        <CustomButton
          text="Đang ăn"
          textColor={colors.black}
          textStyle={{ fontSize: 16 }}
          iconType="MaterialCommunityIcons"
          iconName="food-fork-drink"
          iconSize={30}
          iconColor="#F0A830"
          iconPosition="right"
          backgroundColor={colors.white}
          borderRadius={20}
          onPress={onPress}
          style={{ marginRight: 10, marginBottom: 10 }}
        />
      );
    
    case 'Vietnam':
      return (
        // <ImageBackground 
        //   source={{ uri: 'https://vietnamland.vn/wp-content/uploads/2023/01/landmark-81-1.jpeg' }}
        //   resizeMode="cover" // or "contain", "stretch", etc.
        // >
        // <CustomButton
        //   text="Việt Nam"
        //   textColor={colors.black}
        //   textStyle={{ fontSize: 16 }}
        //   iconType="MaterialCommunityIcons"
        //   iconName="flag"
        //   iconSize={30}
        //   iconColor="#FF0000"
        //   iconPosition="right"
        //   borderRadius={20}
        //   onPress={onPress}
        //   style={{ marginRight: 10, marginBottom: 10 }}
        // />
        // </ImageBackground>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{width:'100%',alignItems: 'center'}}>
          <ImageBackground 
            source={{ uri: 'https://vietnamland.vn/wp-content/uploads/2023/01/landmark-81-1.jpeg' }}
            style={styles.button}
            imageStyle={{ borderRadius: 10 }} // optional rounded corners
            resizeMode='cover'
          >
            <Text style={styles.buttonText}>Việt Nam 🇻🇳</Text>
          </ImageBackground>
        </TouchableOpacity>
      );
    
    // Add more cases for other statuses as needed
    
    default:
      // Default button for any status not specifically defined
      return (
        <CustomButton
          text={statusName}
          textColor={colors.black}
          textStyle={{ fontSize: 16 }}
          iconType="Ionicons"
          iconName="ellipsis-horizontal-circle-outline"
          iconSize={30}
          iconColor={colors.primary}
          iconPosition="right"
          backgroundColor={colors.white}
          borderRadius={20}
          onPress={onPress}
          style={{ marginRight: 10, marginBottom: 10 }}
        />
      );
  }
};

export default StatusRender;

const styles = StyleSheet.create({
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: 30,
  },
});