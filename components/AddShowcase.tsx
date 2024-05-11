import React, { useCallback, useState, useRef } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  ShadowDecorator,
  OpacityDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SettingsHeaderComponents from "screens/profile/SettingsHeaderComponents";
import SettingsFooterComponents from "screens/profile/SettingsFooterComponents";
import BottomSheet from "@gorhom/bottom-sheet";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type Item = {
  type: string;
  key: string;
  text: string;
  backgroundColor: string;
  isSelected: boolean;
};

const AddShowcase = () => {
  const [data, setData] = useState<Item[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {
      if (item.type === "type1") {
        return (
          <ShadowDecorator>
            <ScaleDecorator>
              <OpacityDecorator>
                <View className="rounded-3xl h-60 bg-gray-800 mb-5">
                  <View className="pr-2 pl-2 rounded-3xl justify-between flex-row bg-gray-700 items-center h-16">
                    <View className="bg-black justify-center items-center rounded-full w-36	h-12">
                      <TouchableOpacity
                        onPress={() => {
                          setIsBottomSheetOpen(true);
                          setData((prevData) =>
                            prevData.map((prevItem) => ({
                              ...prevItem,
                              isSelected: prevItem.key === item.key,
                            }))
                          );
                        }}
                      >
                        <Text className="color-white">Type 1</Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center gap-2 h-12">
                      <TouchableOpacity
                        className=" h-8 w-8 mt-1"
                        onPress={() => handleDeleteItem(item.key)}
                      >
                        <FontAwesome6 name="trash" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className=" h-8 w-8"
                        activeOpacity={1}
                        onLongPress={() => {
                          drag();
                        }}
                        disabled={isActive}
                      >
                        <FontAwesome5 name="bars" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </OpacityDecorator>
            </ScaleDecorator>
          </ShadowDecorator>
        );
      } else if (item.type === "type2") {
        return (
          <ShadowDecorator>
            <ScaleDecorator>
              <OpacityDecorator>
                <View className="rounded-3xl h-60 bg-gray-600 mb-5">
                  <View className="pr-2 pl-2 rounded-3xl justify-between flex-row bg-gray-700 items-center h-16">
                    <View className="bg-black justify-center items-center rounded-full w-36	h-12">
                      <TouchableOpacity
                        onPress={() => {
                          setIsBottomSheetOpen(true);
                          setData((prevData) =>
                            prevData.map((prevItem) => ({
                              ...prevItem,
                              isSelected: prevItem.key === item.key,
                            }))
                          );
                        }}
                      >
                        <Text className="color-white">Type 2</Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center gap-2 h-12">
                      <TouchableOpacity
                        className=" h-8 w-8 mt-1"
                        onPress={() => handleDeleteItem(item.key)}
                      >
                        <FontAwesome6 name="trash" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className=" h-8 w-8"
                        activeOpacity={1}
                        onLongPress={() => {
                          drag();
                        }}
                        disabled={isActive}
                      >
                        <FontAwesome5 name="bars" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </OpacityDecorator>
            </ScaleDecorator>
          </ShadowDecorator>
        );
      } else {
        return (
          <ShadowDecorator>
            <ScaleDecorator>
              <OpacityDecorator>
                <View className="rounded-3xl h-60 bg-gray-500 mb-5">
                  <View className="pr-2 pl-2 rounded-3xl justify-between flex-row bg-gray-700 items-center h-16">
                    <View className="bg-black justify-center items-center rounded-full w-36	h-12">
                      <TouchableOpacity
                        onPress={() => {
                          setIsBottomSheetOpen(true);
                          setData((prevData) =>
                            prevData.map((prevItem) => ({
                              ...prevItem,
                              isSelected: prevItem.key === item.key,
                            }))
                          );
                        }}
                      >
                        <Text className="color-white">Change ShowCase</Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center gap-2 h-12">
                      <TouchableOpacity
                        className=" h-8 w-8 mt-1"
                        onPress={() => handleDeleteItem(item.key)}
                      >
                        <FontAwesome6 name="trash" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className=" h-8 w-8"
                        activeOpacity={1}
                        onLongPress={() => {
                          drag();
                        }}
                        disabled={isActive}
                      >
                        <FontAwesome5 name="bars" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </OpacityDecorator>
            </ScaleDecorator>
          </ShadowDecorator>
        );
      }
    },
    [data]
  );

  const handleAddItem = () => {
    if (data.length < 3) {
      const newItem: Item = {
        type: "",
        key: Math.random().toString(),
        text: `Item ${data.length + 1}`,
        backgroundColor: getRandomColor(),
        isSelected: false,
      };
      setData((prevData) => [...prevData, newItem]);
    }
  };

  const handleDeleteItem = (key: string) => {
    setData((prevData) => prevData.filter((item) => item.key !== key));
  };

  const getRandomColor = () => {
    const colors = [
      "red",
      "green",
      "blue",
      "yellow",
      "orange",
      "purple",
      "pink",
      "cyan",
      "magenta",
      "brown",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSelectItemType = (type: string) => {
    setIsBottomSheetOpen(false);
    setData((prevData) =>
      prevData.map((prevItem) => ({
        ...prevItem,
        isSelected: prevItem.type.toLowerCase() === type.toLowerCase(),
        type: prevItem.isSelected ? type : prevItem.type,
      }))
    );
  };

  return (
    <>
      <GestureHandlerRootView>
        <DraggableFlatList
          data={data}
          onDragEnd={({ data }) => setData(data)}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          dragItemOverflow={true}
          ListHeaderComponent={SettingsHeaderComponents}
          ListFooterComponent={SettingsFooterComponents({
            handleAddItem,
          })}
        />
        {isBottomSheetOpen && (
          <BottomSheet ref={bottomSheetRef} index={0} snapPoints={[300, 400]}>
            <View style={styles.bottomSheetContent}>
              <TouchableOpacity onPress={() => handleSelectItemType("type1")}>
                <Text>Type 1</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelectItemType("type2")}>
                <Text>Type 2</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelectItemType("Type 3")}>
                <Text>Type 3</Text>
              </TouchableOpacity>
            </View>
          </BottomSheet>
        )}
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    backgroundColor: "blue",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "white",
  },
  bottomSheetContent: {
    backgroundColor: "white",
    padding: 16,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddShowcase;
