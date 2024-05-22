import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type MovieDetailAddlistProp = NativeStackScreenProps<
  InsideStackParamList,
  "MovieDetailAddlist"
>;

type MovieIdProps = {
  route: {
    params: {
      movieId: string;
    };
  };
};

const MovieDetailAddlist = ({
  navigation,
  route,
}: MovieDetailAddlistProp & MovieIdProps) => {
  const movieId = route.params.movieId;

  return (
    <View className=" justify-between flex-row bg-black">
      <View className="flex-row items-center ">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className=" justify-center items-center pt-4 pl-3 "
        >
          <FontAwesome6 name="angle-left" size={26} color="white" />
        </TouchableOpacity>
        <Text className="color-white pt-4 pl-3 text-2xl">Add List</Text>
      </View>
    </View>
  );
};

export default MovieDetailAddlist;
