import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { Button } from "@rneui/themed";
import {
  HomeScreenMovieScreen,
  ComingSoon,
  HomeScreenTvSerials,
  HomeScreenAnimeScreen,
} from "components/HomeScreenComponents";
export interface HomeScreenProp {
  navigation: any;
  route: any;
}
import YearsListComponent from "../components/YearsListComponent";

const HomeScreen: React.FC<HomeScreenProp> = ({ navigation, route }) => {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const handleButtonPress = (title: string) => {
    setSelectedButton(selectedButton === title ? null : title);
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
        </View>

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
