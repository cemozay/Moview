import React, { useState } from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";

const App = () => {
  const [views, setViews] = useState(Array(3).fill(true));

  const data = [
    { id: "1", name: "Liste 1" },
    { id: "2", name: "Liste 2" },
    { id: "3", name: "Liste 3" },
  ];

  const handleCreateView = (index) => {
    const updatedViews = [...views];
    updatedViews[index] = true;
    setViews(updatedViews);
  };

  const handleRemoveView = (index) => {
    const updatedViews = [...views];
    updatedViews[index] = false;
    setViews(updatedViews);
  };

  const renderItem = ({ item }) => (
    <View>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View className="w-screen h-80 bg-red-500">
      {views.map(
        (isVisible, index) =>
          isVisible && (
            <View className="w-screen h-40 bg-blue-500" key={index}>
              <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                horizontal
              />
              <TouchableOpacity onPress={() => handleRemoveView(index)}>
                <Text>Kaldır</Text>
              </TouchableOpacity>
            </View>
          )
      )}
      <TouchableOpacity
        onPress={() => handleCreateView(views.findIndex((v) => !v))}
      >
        <Text>Oluştur</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
