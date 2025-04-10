import { StyleSheet, View } from "react-native";
import { Image, type ImageSource } from "expo-image";

type Props = {
  imgSource: ImageSource;
  selectedImage?: string;
};

export default function ImageViewer({ imgSource, selectedImage }: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} contentFit="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 440,
    borderRadius: 18,

    shadowOffset: { width: 2, height: 12 }, // Creates a depth effect
    shadowOpacity: 0.1, // Slightly reduces intensity
    shadowRadius: 5, // Makes shadow softer
    elevation: 10, // Ensures shadow on Android
    backgroundColor: "white", // Prevents transparency issues
    overflow: "hidden", // Keeps image inside rounded border
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18, // Ensures the image follows container border
  },
});
