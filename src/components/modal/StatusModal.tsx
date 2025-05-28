import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CoreModal, TabConfig } from "./CoreModal";
import { colors } from "@/constants/Colors";
import StatusRender from "../../hooks/StatusRender";
import { useImageContext } from "@/src/contexts/ImageContext";

interface StatusModalProps {
  visible: boolean;
  onClose: (status: Status | null) => void;
}

export interface Status {
  // Name of the status
  name: string;
  // Determine if that status is on the featured tab or not
  featured: boolean;
  // Determine which tab that status is on
  type: "emotion" | "activity" | "topic";
  // If it is on topic, it should have a topic name
  topic: string | null;
}

const statusResponseFromBE: Status[] = [
  {
    name: "Happy",
    featured: true,
    type: "emotion",
    topic: null,
  },
  {
    name: "Sad",
    featured: false,
    type: "emotion",
    topic: null,
  },
  {
    name: "Angry",
    featured: true,
    type: "emotion",
    topic: null,
  },
  {
    name: "Eating",
    featured: true,
    type: "activity",
    topic: null,
  },
  {
    name: "Vietnam",
    featured: false,
    type: "topic",
    topic: "Giải phóng miền Nam 30/4",
  },
];

export const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  onClose,
}) => {
  const { selectedStatus } = useImageContext();
  const [tempStatus, setTempStatus] = useState<Status | null>(selectedStatus);

  useEffect(() => {
    if (selectedStatus) {
      setTempStatus(selectedStatus);
    }
  }, []);

  // Define empty state component for tabs
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="leaf-outline" size={100} color="#4CAF50" />
      <Text style={styles.emptyText}>Không có dữ liệu</Text>
    </View>
  );

  // Function to handle status selection
  const handleStatusSelect = (status: Status) => {
    // Handle status selection (will be implemented later)78
    setTempStatus(status);
    onClose(status);
  };

  // Filter and render featured statuses
  const FeaturedTab = () => {
    const featuredStatuses = statusResponseFromBE.filter(
      (status) => status.featured
    );

    return featuredStatuses.length > 0 ? (
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          {featuredStatuses.map((status, index) => (
            <View key={`featured-${index}`} style={styles.statusItem}>
              <StatusRender
                statusName={status.name}
                onPress={() => handleStatusSelect(status)}
              />
            </View>
          ))}
        </View>
      </View>
    ) : (
      <EmptyState />
    );
  };

  // Filter and render emotion statuses
  const EmotionsTab = () => {
    const emotionStatuses = statusResponseFromBE.filter(
      (status) => status.type === "emotion"
    );

    return emotionStatuses.length > 0 ? (
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          {emotionStatuses.map((status, index) => (
            <View key={`emotion-${index}`} style={styles.statusItem}>
              <StatusRender
                statusName={status.name}
                onPress={() => handleStatusSelect(status)}
              />
            </View>
          ))}
        </View>
      </View>
    ) : (
      <EmptyState />
    );
  };

  // Filter and render activity statuses
  const ActivitiesTab = () => {
    const activityStatuses = statusResponseFromBE.filter(
      (status) => status.type === "activity"
    );

    return activityStatuses.length > 0 ? (
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          {activityStatuses.map((status, index) => (
            <View key={`activity-${index}`} style={styles.statusItem}>
              <StatusRender
                statusName={status.name}
                onPress={() => handleStatusSelect(status)}
              />
            </View>
          ))}
        </View>
      </View>
    ) : (
      <EmptyState />
    );
  };

  // Filter, group by topic, and render topic statuses
  const TopicsTab = () => {
    const topicStatuses = statusResponseFromBE.filter(
      (status) => status.type === "topic"
    );

    // Group statuses by topic
    const groupedByTopic: Record<string, Status[]> = {};

    topicStatuses.forEach((status) => {
      const topicName = status.topic || "Khác";
      if (!groupedByTopic[topicName]) {
        groupedByTopic[topicName] = [];
      }
      groupedByTopic[topicName].push(status);
    });

    return Object.keys(groupedByTopic).length > 0 ? (
      <ScrollView>
        {Object.entries(groupedByTopic).map(([topicName, statuses]) => (
          <View key={topicName} style={styles.topicContainer}>
            <Text style={styles.topicTitle}>{topicName}</Text>
            <View style={styles.statusRow}>
              {statuses.map((status, index) => (
                <StatusRender
                  key={`topic-${topicName}-${index}`}
                  statusName={status.name}
                  onPress={() => handleStatusSelect(status)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    ) : (
      <EmptyState />
    );
  };

  // Define tabs
  const tabs: TabConfig[] = [
    {
      key: "featured",
      title: "Nổi bật",
      content: <FeaturedTab />,
    },
    {
      key: "emotions",
      title: "Cảm xúc",
      content: <EmotionsTab />,
    },
    {
      key: "activities",
      title: "Hoạt động",
      content: <ActivitiesTab />,
    },
    {
      key: "topics",
      title: "Chủ đề",
      content: <TopicsTab />,
    },
  ];

  return (
    <CoreModal
      visible={visible}
      onClose={() => {
        onClose(tempStatus);
      }}
      tabs={tabs}
      initialTab="featured"
      modalHeight={500}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 0,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 20,
    color: "#8E8E93",
  },
  statusContainer: {
    padding: 20,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // Align items to the start
    alignContent: "center",
  },
  statusItem: {
    margin: 5, // Add some spacing between items
  },
  topicContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
    alignContent: "center",
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
    color: colors.white,
    alignSelf: "center",
    marginBottom: 10,
  },
});

export default StatusModal;
