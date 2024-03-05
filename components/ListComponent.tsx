import React from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";

const handlePressone = () => {};

const ActivityComponent = () => {
  const data = [
    { id: "1", title: "Öğe 1" },
    { id: "2", title: "Öğe 2" },
    { id: "3", title: "Öğe 3" },
    { id: "4", title: "Öğe 4" },
    { id: "5", title: "Öğe 5" },
  ];

  // renderItem giren çıkan type belirtilmeli
  const renderItem = ({ item }) => (
    <View
      style={{
        margin: 6,
        paddingTop: 50,
        paddingLeft: 20,
        width: 80,
        height: 120,
        backgroundColor: "lightgray",
        borderRadius: 8,
      }}
    >
      <Text>{item.title}</Text>
    </View>
  );

  return (
    <View className=" border-white border-b-2">
      <View className="">
        <Text className="color-white text-2xl">
          Dünyanın En İyi Film Listesi:
        </Text>
      </View>
      <TouchableOpacity onPress={handlePressone}>
        <FlatList
          className="m-2"
          data={data}
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </TouchableOpacity>
      <View className=" flex-row">
        <Text className="text-gray-400 pr-4">32 Film</Text>
        <Text className="text-gray-400 pr-4">2500 Yorum</Text>
        <Text className="text-gray-400">2500 Beğeni</Text>
      </View>
    </View>
  );
};

export default ActivityComponent;
