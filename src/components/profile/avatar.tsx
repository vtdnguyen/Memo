import { View, StyleSheet, Image } from "react-native";
import { useSelector } from "react-redux";

export default function Avatar() {
    const user = useSelector((state: any) => state.user);
    const image = user.avatar;
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
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: 100,
    height: 100,
    borderColor: '#3A3A3A',
    borderWidth: 6,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: 92,
    height: 92,
    borderColor: '#000000',
    borderWidth: 4,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 999,
  },
});
