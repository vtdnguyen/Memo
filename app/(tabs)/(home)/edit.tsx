import {
  StyleSheet,
  Image,
  Text,
  View,
  Dimensions,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useImageContext } from "@/src/contexts/ImageContext";
import CustomButton from "@/src/components/home/IconButton";
import { useContext, useEffect, useState } from "react";
import HashtagInput from "@/src/components/home/hashtagInput";
import { TabBarContext } from "../_layout";
import StatusModal, { Status } from "@/src/components/modal/StatusModal";
import StatusRender from "@/src/hooks/StatusRender";

export default function Edit() {
  const { hideTabBar, showTabBar } = useContext(TabBarContext);
  const {
    capturedImage,
    selectedStatus,
    setSelectedStatus,
    selectedHashtag,
    setSelectedHashtag,
  } = useImageContext();
  const router = useRouter();
  const [statusTabVisible, setStatusTabVisible] = useState(false);

  // Status state of image:
  const [tempStatus, setTempStatus] = useState<Status | null>(
    () => selectedStatus ?? null
  );
  const [hashtag, setHashtag] = useState<string | null>(
    () => selectedHashtag ?? null
  );
  const insets = useSafeAreaInsets();

  if (!capturedImage) {
    router.push("/(tabs)/(home)/");
    return null;
  }
  // Show Status tab bar

  const openStatusTab = () => {
    hideTabBar();
    setStatusTabVisible(true);
  };
  const closeStatustab = (status: Status | null) => {
    setTempStatus(status);
    setStatusTabVisible(false);
    showTabBar();
  };

  // Editing handle:

  const saveEdit = () => {
    setSelectedStatus(tempStatus);
    console.log(hashtag);
    setSelectedHashtag(hashtag);
    router.back();
  };

  return (
    <View>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom },
        ]}
      >
        <StatusBar style="light" />

        <View style={[styles.topRow, { paddingBottom: 20 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={34} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles_fix.title}>Edit</Text>
          <View style={{ width: 34 }}></View>
        </View>

        <View style={styles.previewContainer}>
          <Image
            source={{ uri: capturedImage }}
            style={styles.camera}
            resizeMode="cover"
          />
          {tempStatus && (
            <View style={styles_fix.statusButton}>
              <StatusRender statusName={tempStatus.name} onPress={() => {}} />
            </View>
          )}
        </View>
        <View style={styles_fix.editButtonRow}>
          <CustomButton
            text="Trạng thái của bạn"
            textColor={colors.black}
            textStyle={{ fontSize: 16 }}
            iconName="happy-outline"
            iconSize={30}
            iconColor={colors.primary}
            iconPosition="right"
            backgroundColor={colors.white}
            borderRadius={20}
            onPress={() => openStatusTab()}
            style={{ marginRight: 10 }}
          />
          <HashtagInput
            placeholder="Hashtag"
            backgroundColor="#1B96D9"
            borderRadius={20}
            hashtagStyle={{ fontSize: 28, color: "#fff" }}
            placeholderStyle={{ fontStyle: "italic", fontSize: 20 }}
            placeholderTextColor="#fff"
            containerStyle={{ width: "40%" }}
            onChangeText={setHashtag}
            value={hashtag ?? ""}
          />
        </View>

        <View style={[styles.controlButton, { paddingTop: 80 }]}>
          <CustomButton
            text="Lưu thay đổi"
            textColor={colors.white}
            textStyle={{ fontSize: 16 }}
            backgroundColor={"#DCAF6C"}
            borderRadius={18}
            onPress={() => {
              saveEdit();
            }}
            fullWidth
            style={{ height: 54 }}
          />
        </View>
      </View>
      <StatusModal
        visible={statusTabVisible}
        onClose={(status: Status | null) => closeStatustab(status)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: "60%",
  },
  camera: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  editButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  controlButton: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

const styles_fix = StyleSheet.create({
  title: {
    fontSize: 24,
    color: colors.white,
  },
  editButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  statusButton: {
    position: "absolute",
    top: 15,
    left: 15,
  },
});
