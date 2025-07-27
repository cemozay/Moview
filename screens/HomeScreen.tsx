import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import {
  HomeScreenMovieScreen,
  ComingSoon,
  HomeScreenTvSerials,
  HomeScreenAnimeScreen,
} from "../components/HomeScreenComponents";
import YearsListComponent from "../components/YearsListComponent";

export interface HomeScreenProp {
  navigation: any;
  route: any;
}

const HomeScreen: React.FC<HomeScreenProp> = ({ navigation, route }) => {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [selectedTypeButton, setSelectedTypeButton] = useState<string | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const handleButtonPress = (title: string) => {
    setSelectedButton(selectedButton === title ? null : title);
    setSelectedTypeButton(null);
  };

  const handleTypeButtonPress = (title: string) => {
    setSelectedTypeButton(selectedTypeButton === title ? null : title);
    setModalVisible(true);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedTypeButton(type);
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Simple Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row justify-between items-center">
            <Text className="color-white text-3xl font-bold">Moview</Text>

            <View className="flex-row gap-3">
              <TouchableOpacity className="p-2" activeOpacity={0.7}>
                <Icon name="bell" size={20} color="#FF5C00" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Simple Filter Buttons */}
        <View className="px-6 pb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {["Movie", "TV", "Anime"].map((title) => {
                const isSelected = selectedButton === title;
                const isVisible =
                  selectedButton === null || selectedButton === title;

                if (!isVisible) return null;

                return (
                  <TouchableOpacity
                    key={title}
                    onPress={() => handleButtonPress(title)}
                    activeOpacity={0.7}
                    className={`
                      px-4 py-2 rounded-lg
                      ${isSelected ? "bg-orange-500" : "bg-gray-800"}
                    `}
                  >
                    <Text
                      className={`
                        font-medium
                        ${isSelected ? "text-white" : "text-gray-300"}
                      `}
                    >
                      {title}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Simple Filter Button */}
              {selectedButton !== null && (
                <TouchableOpacity
                  onPress={() => handleTypeButtonPress("Type")}
                  activeOpacity={0.7}
                  className={`
                    px-4 py-2 rounded-lg flex-row items-center gap-2
                    ${selectedTypeButton ? "bg-orange-500" : "bg-gray-800"}
                  `}
                >
                  <Text
                    className={`
                      font-medium
                      ${selectedTypeButton ? "text-white" : "text-gray-300"}
                    `}
                  >
                    {selectedTypeButton || "Filter"}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={12}
                    color={selectedTypeButton ? "white" : "#999"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {/* Simple Active Filter */}
          {selectedButton && selectedTypeButton && (
            <View className="flex-row items-center justify-between mt-3 px-3 py-2 bg-gray-800 rounded-lg">
              <Text className="text-gray-300 text-sm">
                {selectedButton} • {selectedTypeButton}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedButton(null);
                  setSelectedTypeButton(null);
                }}
                activeOpacity={0.7}
              >
                <Text className="text-orange-400 text-sm">Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Simple Modal */}
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View className="flex-1 justify-center items-center bg-black/80">
            <View className="bg-gray-900 p-6 rounded-xl w-4/5">
              <Text className="text-white text-lg font-semibold mb-4 text-center">
                Select Filter
              </Text>

              {["Genre", "Popular", "Top Rated", "Latest"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleTypeSelect(type)}
                  className="py-3 border-b border-gray-700 last:border-b-0"
                  activeOpacity={0.7}
                >
                  <Text className="text-white text-center text-base">
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="mt-4 py-3 bg-gray-800 rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Content */}
        <View className="px-4">
          {selectedButton === null && (
            <View>
              <ComingSoon navigation={navigation} route={route} />
              <YearsListComponent
                navigation={navigation}
                route={{
                  key: "YearsListComponent",
                  name: "YearsListComponent",
                  params: { start: "1990", end: "2000" },
                }}
              />
            </View>
          )}
          {selectedButton === "Movie" && (
            <HomeScreenMovieScreen navigation={navigation} route={route} />
          )}
          {selectedButton === "TV" && (
            <HomeScreenTvSerials navigation={navigation} route={route} />
          )}
          {selectedButton === "Anime" && (
            <HomeScreenAnimeScreen navigation={navigation} route={route} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
