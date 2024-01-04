import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

const ProfilAyarlar = () => {
  const [viewsData, setViewsData] = useState([]);

  const handleCreateView = () => {
    const newViewData = {
      isVisible: true,
      selectedListIndex: 0,
      dataSets: [
        { id: "1", name: "Elma" },
        { id: "2", name: "Armut" },
        { id: "3", name: "Çilek" },
      ],
      isPickerVisible: false,
    };

    setViewsData((prevViewsData) => [...prevViewsData, newViewData]);
  };

  const handleRemoveView = (index) => {
    setViewsData((prevViewsData) => {
      const updatedViewsData = [...prevViewsData];
      updatedViewsData.splice(index, 1);
      return updatedViewsData;
    });
  };

  const handleTogglePicker = (index) => {
    setViewsData((prevViewsData) => {
      const updatedViewsData = [...prevViewsData];
      updatedViewsData[index].isPickerVisible =
        !updatedViewsData[index].isPickerVisible;
      return updatedViewsData;
    });
  };

  const handleChangeListContent = (viewIndex, newListIndex) => {
    setViewsData((prevViewsData) => {
      const updatedViewsData = [...prevViewsData];
      updatedViewsData[viewIndex].selectedListIndex = newListIndex;
      updatedViewsData[viewIndex].isPickerVisible = false;

      switch (newListIndex) {
        case 0:
          updatedViewsData[viewIndex].dataSets = [
            { id: "1", name: "Elma" },
            { id: "2", name: "Armut" },
            { id: "3", name: "Çilek" },
          ];
          break;
        case 1:
          updatedViewsData[viewIndex].dataSets = [
            { id: "4", name: "Muz" },
            { id: "5", name: "Üzüm" },
            { id: "6", name: "Portakal" },
          ];
          break;
        case 2:
          updatedViewsData[viewIndex].dataSets = [
            { id: "777", name: "Ananas" },
            { id: "8", name: "Karpuz" },
            { id: "9", name: "Kiraz" },
          ];
          break;

        default:
          updatedViewsData[viewIndex].dataSets = [
            { id: "1", name: "Elma" },
            { id: "2", name: "Armut" },
            { id: "3", name: "Çilek" },
          ];
          break;
      }

      return updatedViewsData;
    });
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        margin: 5,
        padding: 100,
        backgroundColor: "gray",
      }}
    >
      <Text style={{ color: "white" }}>{item.name}</Text>
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: "black" }}>
      {viewsData.map(
        (viewData, index) =>
          viewData.isVisible && (
            <View key={index}>
              <View style={{ flexDirection: "row", padding: 10 }}>
                <TouchableWithoutFeedback
                  onPress={() => handleTogglePicker(index)}
                >
                  <View
                    style={{
                      width: 150,
                      height: 40,
                      justifyContent: "center",
                      backgroundColor: "red",
                    }}
                  >
                    <Text style={{ color: "white", textAlign: "center" }}>
                      Liste Adı: {`Liste ${viewData.selectedListIndex + 1}`}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableOpacity onPress={() => handleRemoveView(index)}>
                  <View
                    style={{
                      width: 150,
                      height: 40,
                      justifyContent: "center",
                      backgroundColor: "red",
                    }}
                  >
                    <Text style={{ color: "white", textAlign: "center" }}>
                      Kaldır
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                data={viewsData[index].dataSets}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                horizontal
              />
              <Modal
                transparent
                visible={viewData.isPickerVisible}
                animationType="slide"
              >
                <TouchableWithoutFeedback
                  onPress={() => handleTogglePicker(index)}
                >
                  <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <View
                      style={{
                        backgroundColor: "black",
                        padding: 16,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    >
                      {viewData.dataSets.map((_, listIndex) => (
                        <TouchableOpacity
                          key={listIndex}
                          onPress={() =>
                            handleChangeListContent(index, listIndex)
                          }
                        >
                          <Text
                            style={{ padding: 10, color: "white" }}
                          >{`Liste ${listIndex + 1}`}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          )
      )}
      <TouchableOpacity onPress={handleCreateView}>
        <View
          style={{
            width: 150,
            height: 40,
            justifyContent: "center",
            backgroundColor: "red",
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Oluştur ({viewsData.length} view)
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfilAyarlar;
