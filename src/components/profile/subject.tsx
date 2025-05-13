import { View, Text, Image, StyleSheet } from 'react-native';

interface SubjectProps {
  subject: string;
  icon: string;
}

export default function Subject({ subject, icon }: SubjectProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={{ uri: icon }} />
      </View>
      <Text style={styles.text}>{subject}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#787878',
  },
  text: {
    fontFamily: 'Open Sans',
    fontSize: 20,
    lineHeight: 16,
    textAlign: 'center',
    letterSpacing: 0.75,
    color: '#FFFFFF',
  },
});

