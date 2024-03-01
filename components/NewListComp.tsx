import { View, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";

type ListCompProps = {
  data: {
    isVisible: boolean;
    selectedListIndex: number;
    dataSets: { id: string; name: string }[];
    isPickerVisible: boolean;
  }[];
};

const ListComp = (props: ListCompProps) => {
  return (
    <View>
      {props.data.map(
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
    </View>
  );
};

export default ListComp;
