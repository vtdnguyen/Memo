import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TextInputProps,
  Platform,
} from 'react-native';

interface HashtagInputProps extends Omit<TextInputProps, 'placeholder'> {
  /**
   * Container style for the entire component
   */
  containerStyle?: ViewStyle;
  
  /**
   * Style for the hashtag prefix
   */
  hashtagStyle?: TextStyle;
  
  /**
   * Style for the text input
   */
  inputStyle?: TextStyle;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Style for the placeholder text
   */
  placeholderStyle?: TextStyle;
  
  /**
   * Color of the placeholder text
   */
  placeholderTextColor?: string;
  
  /**
   * Background color of the component
   * @default '#1B96D9'
   */
  backgroundColor?: string;
  
  /**
   * Border radius of the component
   * @default 20
   */
  borderRadius?: number;
  
  /**
   * Handler for text change
   */
  onChangeText?: (text: string) => void;
  
  /**
   * Initial value for the input
   */
  value?: string;
}

const HashtagInput: React.FC<HashtagInputProps> = ({
  containerStyle,
  hashtagStyle,
  inputStyle,
  placeholder = 'Hashtag',
  placeholderStyle,
  placeholderTextColor = '#A9C9DF',
  backgroundColor = '#1B96D9',
  borderRadius = 20,
  onChangeText,
  value,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  
  const handleChangeText = (text: string) => {
    setInputValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };
  
  const CustomPlaceholder = () => {
    if (inputValue !== '' || isFocused) return null;
    
    return (
      <View style={styles.placeholderContainer}>
        <Text
          style={[
            styles.placeholder,
            { color: placeholderTextColor },
            placeholderStyle,
          ]}
        >
          {placeholder}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, borderRadius },
        containerStyle,
      ]}
    >
      <Text style={[styles.hashtag, hashtagStyle]}>#</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={inputValue}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          placeholderTextColor="transparent"
          {...restProps}
        />
        <CustomPlaceholder />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  hashtag: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    padding: 0,
    height: Platform.OS === 'ios' ? 24 : 40,
  },
  placeholderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  placeholder: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default HashtagInput;