import { View, StyleSheet, Image } from 'react-native';

export default function MiniAvatar({ image }: { image: string }) {
  console.log('Image URL:', image);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Image
          style={styles.avatar}
          source={{ uri: image }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 50,
    height: 50,
    borderColor: '#FFC877',
    borderWidth: 3,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: 46,
    height: 46,
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
  },
});