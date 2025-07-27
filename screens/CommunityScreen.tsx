import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ListsTab from "./ListsTab";
import ReviewsTab from "./ReviewsTab";

const { width } = Dimensions.get("window");

export interface CommunityScreenProps {
  navigation: any;
  route?: any;
}

const CommunityScreen: React.FC<CommunityScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<"lists" | "reviews">("lists");

  const renderTabButton = (
    tab: "lists" | "reviews",
    title: string,
    icon: string
  ) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl mx-1 ${
        activeTab === tab ? "bg-orange-500" : "bg-gray-800/50"
      }`}
      activeOpacity={0.8}
    >
      <FontAwesome6
        name={icon as any}
        size={16}
        color={activeTab === tab ? "white" : "#9CA3AF"}
        style={{ marginRight: 8 }}
      />
      <Text
        className={`text-sm font-semibold ${
          activeTab === tab ? "color-white" : "color-gray-400"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4">
        <Text className="color-white text-2xl font-bold">Community</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              activeTab === "lists" ? "AddList" : "Selectlist",
              activeTab === "lists"
                ? { movies: undefined, listId: null }
                : undefined
            )
          }
          className="h-10 w-10 bg-orange-500 justify-center items-center rounded-full"
        >
          <FontAwesome6 name="plus" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View className="flex-row px-5 mb-4">
        {renderTabButton("lists", "Lists", "list-ul")}
        {renderTabButton("reviews", "Reviews", "star")}
      </View>

      {/* Tab Content */}
      <View className="flex-1">
        {activeTab === "lists" ? (
          <ListsTab navigation={navigation} />
        ) : (
          <ReviewsTab navigation={navigation} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CommunityScreen;
