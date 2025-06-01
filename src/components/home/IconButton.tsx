import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  View 
} from 'react-native';
import * as Icons from '@expo/vector-icons'; // Import all icon packages

export type IconPosition = 'left' | 'right';

export interface ButtonProps {
  /**
   * Text to display on the button
   */
  text: string;

  /**
   * Text to display emoji on the button
   */

  emoji?: string;
  
  /**
   * Function to execute when button is pressed
   */
  onPress: () => void;

  iconType?: keyof typeof Icons;
  
  /**
   * Name of the Ionicons icon to display (optional)
   */
  iconName?: string;
  
  /**
   * Position of the icon relative to text
   * @default 'left'
   */
  iconPosition?: IconPosition;
  
  /**
   * Size of the icon
   * @default 16
   */
  iconSize?: number;
  
  /**
   * Color of the icon
   * @default '#FFFFFF'
   */
  iconColor?: string;
  
  /**
   * Background color of the button
   * @default '#2196F3'
   */
  backgroundColor?: string;
  
  /**
   * Text color of the button
   * @default '#FFFFFF'
   */
  textColor?: string;
  
  /**
   * Border radius of the button
   * @default 8
   */
  borderRadius?: number;
  
  /**
   * Additional styles for the button container
   */
  style?: ViewStyle;
  
  /**
   * Additional styles for the button text
   */
  textStyle?: TextStyle;
  
  /**
   * Space between icon and text
   * @default 8
   */
  iconTextSpacing?: number;
  
  /**
   * If true, button will take full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Disables the button
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Button padding
   * @default vertical: 12, horizontal: 16 
   */
  padding?: {
    vertical?: number;
    horizontal?: number;
  };
}

const CustomButton: React.FC<ButtonProps> = ({
  text,
  emoji = "",
  onPress,
  iconType = 'Ionicons',
  iconName,
  iconPosition = 'left',
  iconSize = 16,
  iconColor = '#FFFFFF',
  backgroundColor = '#2196F3',
  textColor = '#FFFFFF',
  borderRadius = 8,
  style,
  textStyle,
  iconTextSpacing = 8,
  fullWidth = false,
  disabled = false,
  padding = { vertical: 12, horizontal: 16 },
}) => {
  const buttonStyles: ViewStyle = {
    backgroundColor: disabled ? '#CCCCCC' : backgroundColor,
    borderRadius,
    paddingVertical: padding.vertical,
    paddingHorizontal: padding.horizontal,
    flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.7 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const IconComponent = iconType ? Icons[iconType] : null; // Dynamically select the icon package


  return (
    <TouchableOpacity
      style={[buttonStyles, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {iconName && IconComponent && (
        <View
          style={{
            marginRight: iconPosition === 'left' ? iconTextSpacing : 0,
            marginLeft: iconPosition === 'right' ? iconTextSpacing : 0,
          }}
        >
          <IconComponent
            name={iconName}
            size={iconSize}
            color={disabled ? '#999999' : iconColor}
          />
        </View>
      )}
      {emoji != "" && (
        <Text style={{fontSize:26}}>
          {emoji}
        </Text>
      )}
      <Text style={[styles.text, { color: disabled ? '#999999' : textColor }, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});

export default CustomButton;