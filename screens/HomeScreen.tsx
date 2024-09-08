import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { Button } from "@rneui/themed";
import {
  HomeScreenMovieScreen,
  ComingSoon,
  HomeScreenTvSerials,
  HomeScreenAnimeScreen,
} from "components/HomeScreenComponents";
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
    setSelectedTypeButton("Type");
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
    <View className="flex-1 bg-black">
      <ScrollView>
        <View className="flex-row justify-between items-center py-3 px-3">
          <View>
            <Text className="color-white text-3xl">Moview</Text>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => navigation.navigate("SearchScreen")}
            >
              <Icon name="search" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="heart" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row pb-3">
          {["Movie", "TV", "Anime"].map((title) => (
            <Button
              key={title}
              title={selectedButton === title ? `● ${title}` : title}
              buttonStyle={{
                backgroundColor: selectedButton === title ? "white" : "#1E1E1E",
              }}
              containerStyle={{
                width: 80,
                height: 40,
                marginHorizontal: 3,
                borderRadius: 30,
                display:
                  selectedButton === null || selectedButton === title
                    ? "flex"
                    : "none",
              }}
              titleStyle={{ color: "#FF5C00" }}
              onPress={() => handleButtonPress(title)}
            />
          ))}

          <Button
            key="Type"
            title={selectedTypeButton ? `⌄ ${selectedTypeButton}` : "Type"}
            buttonStyle={{
              backgroundColor: selectedTypeButton ? "white" : "#1E1E1E",
            }}
            containerStyle={{
              width: 80,
              height: 40,
              marginHorizontal: 3,
              borderRadius: 30,
              display: selectedButton === null ? "none" : "flex",
            }}
            titleStyle={{ color: "#FF5C00" }}
            onPress={() => handleTypeButtonPress("Type")}
          />
        </View>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                width: "80%",
              }}
            >
              {["Type", "Type 1", "Type 2", "Type 3"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleTypeSelect(type)}
                >
                  <Text style={{ fontSize: 18, paddingVertical: 10 }}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

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
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
