import { colors } from '@/constants/Colors';
import { View, Text, StyleSheet } from 'react-native';
import { ReactElement } from 'react';

interface SubjectProps {
  subject: string;
  icon: ReactElement;
}

export default function Subject({ subject, icon }: SubjectProps) {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.text}>{subject}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 14,
    marginBottom: 6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors._subject,
  },
  text: {
    fontFamily: 'Rounded Mplus 1c Bold',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0.75,
    color: colors.white,
  },
});

