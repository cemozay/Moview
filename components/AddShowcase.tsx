import React, { useCallback, useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, View, Modal, FlatList } from "react-native";
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
import { FirebaseDB } from "firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import useUserStore from "utils/hooks/useUserStore";

type Item = {
  type: string;
  key: string;
  text: string;
  isSelected: boolean;
  id: string;
};
type List = {
  id: string;
  name: string;
  movies: string[];
  timestamp: any;
  userId: string;
  description: string;
};

type Review = {
  timestamp: any;
  mediaId: string;
  rating: string;
  text: string;
  userId: string;
  id: string;
};

const AddShowcase = () => {
  const baseUser = useUserStore((state) => state.user);

  const [data, setData] = useState<Item[]>([]);

  const [username, setUsername] = useState(baseUser?.displayName || "");
  const [email, setEmail] = useState(baseUser?.email || "");
  const [photoURL, setPhotoURL] = useState(baseUser?.photoURL || "");
  const { updateUserProfile } = useUserStore((state) => ({
    updateUserProfile: state.updateUserProfile,
  }));

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const docRef = collection(FirebaseDB, "users");

  useEffect(() => {
    const fetchDocs = async () => {
      if (baseUser) {
        const doc_query = query(docRef, where("userId", "==", baseUser.uid));
        const snapshot = await getDocs(doc_query);

        snapshot.docs.forEach((doc) => {
          const showCaseArray = doc.data().showCase;
        });
      }
    };

    fetchDocs();
  }, [baseUser, docRef]);

  useEffect(() => {
    if (baseUser) {
      setUsername(baseUser.displayName || "");
      setEmail(baseUser.email || "");
      setPhotoURL(baseUser.photoURL || "");
    }
  }, [baseUser]);

  useEffect(() => {
    const texts = data.map((item) => item.text);
    console.log(texts);
  }, [data]);

  const handleAddItem = () => {
    if (data.length < 3) {
      const newItem: Item = {
        type: "",
        key: Math.random().toString(),
        text: `Item ${data.length + 1}`,
        isSelected: false,
        id: "",
      };
      setData((prevData) => [...prevData, newItem]);
    }
  };

  const handleDeleteItem = (key: string) => {
    setData((prevData) => prevData.filter((item) => item.key !== key));
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

  const updateProfileInfo = async () => {
    try {
      await updateUserProfile({ displayName: username, photoURL: photoURL });
      console.log("Kullanıcı bilgileri güncellendi");
    } catch (error) {
      console.error(
        "Kullanıcı bilgileri güncellendirken bir hata oluştu:",
        error
      );
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modalType, setModalType] = useState<"list" | "review" | null>(null);

  const handleSelectListOrReview = (id: string) => {
    if (selectedItem && modalType) {
      setData((prevData) =>
        prevData.map((prevItem) =>
          prevItem.key === selectedItem.key
            ? { ...prevItem, text: id, id }
            : prevItem
        )
      );
      setSelectedItem(null);
      setModalType(null);
    }
  };

  type ModalProps = {
    data: List[] | Review[];
    onSelectItem: (id: string) => void;
    onClose: () => void;
  };

  const listsRef = collection(FirebaseDB, "lists");
  const [lists, setLists] = useState<List[]>([]);
  const doc_querylist = query(listsRef, where("userId", "==", baseUser?.uid));

  const fetchDataForList = async () => {
    try {
      const snapshot = await getDocs(doc_querylist);
      const listCollection = snapshot.docs.map((doc) => {
        const listData = doc.data() as List;
        return { ...listData, id: doc.id };
      });
      setLists(listCollection);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    fetchDataForList();
    console.log("reviwelist");
  }, [modalType]);

  const ListModal: React.FC<ModalProps> = ({ data, onSelectItem, onClose }) => {
    return (
      <Modal
        visible={data !== null}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="bg-white p-4 h-full items-center justify-center">
          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelectItem(item.id)}>
                <Text>{item.id}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const [reviews, setReviews] = useState<Review[]>([]);
  const reviewRef = collection(FirebaseDB, "reviews");
  const doc_queryreview = query(
    reviewRef,
    where("userId", "==", baseUser?.uid)
  );

  const fetchReviews = async () => {
    try {
      const snapshot = await getDocs(doc_queryreview);
      const reviewList = snapshot.docs.map((doc) => {
        const reviewData = doc.data() as Review;
        return { ...reviewData, id: doc.id };
      });

      setReviews(reviewList);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    fetchReviews();
    console.log("reviwelist");
  }, [modalType]);

  const ReviewModal: React.FC<ModalProps> = ({
    data,
    onSelectItem,
    onClose,
  }) => {
    return (
      <Modal
        visible={data !== null}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="bg-white p-4 h-full items-center justify-center">
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelectItem(item.id)}>
                <Text>{item.id}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {
      if (item.type === "type1") {
        return (
          <ShadowDecorator>
            <ScaleDecorator>
              <OpacityDecorator>
                <View className="rounded-3xl h-60 bg-gray-800 mb-5">
                  <View className="pr-2 pl-2 rounded-3xl justify-between flex-row bg-gray-700 items-center h-16">
                    <View className="flex-row gap-1">
                      <View className="bg-black justify-center flex-row items-center rounded-full w-36 h-12">
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
                          <Text className="color-white">Liste</Text>
                        </TouchableOpacity>
                      </View>
                      <View className="bg-black justify-center flex-row items-center rounded-full w-36 h-12">
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedItem(item);
                            setModalType("list");
                            setIsModalVisible(true);
                          }}
                        >
                          <Text className="color-white">
                            {item.text || "List"}
                          </Text>
                        </TouchableOpacity>
                      </View>
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
                    <View className="flex-row gap-1">
                      <View className="bg-black justify-center flex-row items-center rounded-full w-36 h-12">
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
                          <Text className="color-white">Review</Text>
                        </TouchableOpacity>
                      </View>
                      <View className="bg-black justify-center flex-row items-center rounded-full w-36 h-12">
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedItem(item);
                            setModalType("review");
                            setIsModalVisible(true);
                          }}
                        >
                          <Text className="color-white">
                            {item.text || "Review"}
                          </Text>
                        </TouchableOpacity>
                      </View>
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
                    <View className="bg-black justify-center items-center rounded-full w-36 h-12">
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
                        className=" h-8 "
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

  return (
    <>
      <GestureHandlerRootView>
        <DraggableFlatList
          data={data}
          onDragEnd={({ data }) => setData(data)}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          dragItemOverflow={true}
          ListHeaderComponent={
            <SettingsHeaderComponents updateProfileInfo={updateProfileInfo} />
          }
          ListFooterComponent={
            <SettingsFooterComponents handleAddItem={handleAddItem} />
          }
        />
        {isBottomSheetOpen && (
          <BottomSheet ref={bottomSheetRef} index={0} snapPoints={[300, 400]}>
            <View className="bg-white p-4 h-72 items-center justify-center">
              <TouchableOpacity onPress={() => handleSelectItemType("type1")}>
                <Text>Type 1</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelectItemType("type2")}>
                <Text>Type 2</Text>
              </TouchableOpacity>
            </View>
          </BottomSheet>
        )}
        {modalType === "list" && (
          <ListModal
            data={lists}
            onSelectItem={handleSelectListOrReview}
            onClose={() => setModalType(null)}
          />
        )}
        {modalType === "review" && (
          <ReviewModal
            data={reviews}
            onSelectItem={handleSelectListOrReview}
            onClose={() => setModalType(null)}
          />
        )}
      </GestureHandlerRootView>
    </>
  );
};

export default AddShowcase;
