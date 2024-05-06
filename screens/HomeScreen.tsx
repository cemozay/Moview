import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import ComingSoon from "components/ComingSoon";
import { Button } from "@rneui/themed";
import Movie from "components/HomeScreenMovie";
import TvSerials from "components/HomeScreenTvSerials";
import Anime from "components/HomeScreenAnime";

type HomeScreenProp = NativeStackScreenProps<InsideStackParamList, "HomeStack">;

const HomeScreen = ({ navigation, route }: HomeScreenProp) => {
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
          <ComingSoon navigation={navigation} route={route} />
        )}
        {selectedButton === "Movie" && <Movie />}
        {selectedButton === "TV" && <TvSerials />}
        {selectedButton === "Anime" && <Anime />}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
