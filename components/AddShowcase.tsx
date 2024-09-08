import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  Modal,
  FlatList,
} from "react-native";
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
import { collection, setDoc, query, where, getDocs } from "firebase/firestore";
import useUserStore from "utils/hooks/useUserStore";
import { formatTimestamp } from "utils/functions";
import { useMovieData } from "utils/hooks/useMovieData";

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

type MovieItemProps = {
  mediaId: string;
};

const AddShowcase = () => {
  const baseUser = useUserStore((state) => state.user);

  const [data, setData] = useState<Item[]>([]);

  const [username, setUsername] = useState(baseUser?.displayName || "");
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
          setData(showCaseArray);
          console.log(showCaseArray);
        });
      }
    };

    fetchDocs();
  }, [baseUser]);

  useEffect(() => {
    if (baseUser) {
      setUsername(baseUser.displayName || "");
      setPhotoURL(baseUser.photoURL || "");
    }
  }, [baseUser]);

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
      prevData.map((prevItem) =>
        prevItem.isSelected ? { ...prevItem, type, text: "", id: "" } : prevItem
      )
    );
  };

  const updateProfileInfo = async () => {
    if (baseUser) {
      const q = query(
        collection(FirebaseDB, "users"),
        where("userId", "==", baseUser.uid)
      );
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);

      querySnapshot.forEach(async (doc) => {
        try {
          await setDoc(doc.ref, { showCase: data }, { merge: true });
          console.log("Belge güncellendi:", doc.id);
        } catch (error) {
          console.error("Belge güncellenirken bir hata oluştu:", error);
        }
      });
    }

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
  // list ve review component yaz ki 3 yerde de boşuna kod yazmakla değiştirmekle uğraşma mal herif
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
  console.log(data);

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
    fetchDataForList();
    fetchReviews();
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
  const ListMovieItem = ({ mediaId }: MovieItemProps) => {
    const { data: movie, isLoading, isError } = useMovieData(mediaId);

    if (isLoading) {
      return (
        <View className="mr-3 h-48 w-24 bg-gray-500">
          <Text className="text-white">Loading...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="mr-3 h-48 w-24 bg-gray-500">
          <Text className="text-white">Error loading movie data</Text>
        </View>
      );
    }

    return (
      <Image
        className="h-36 w-24 rounded-xl"
        source={{
          uri: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        }}
      />
    );
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {
      const [listsd, setLists] = useState<List[]>([]);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const snapshot = await getDocs(query(listsRef));
            const listCollection = snapshot.docs.map((doc) => {
              const listData = doc.data() as List;
              return { ...listData, id: item.id };
            });
            setLists(listCollection);
          } catch (e) {
            alert(e);
          }
        };
        fetchData();
      }, [item.id]);

      if (item.type === "list") {
        const list = listsd.find((listItem) => listItem.id === item.id);
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
                            {item.type}: {item.text || "List"}
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
                  <View>
                    <View className="w-full flex-row justify-between">
                      <View className="flex-row items-center">
                        <Text className="color-white">{list?.userId}</Text>
                      </View>
                    </View>
                    <View className="pb-2">
                      <Text numberOfLines={2} className="color-white">
                        {list?.description}
                      </Text>
                    </View>
                    <FlatList
                      data={list?.movies}
                      keyExtractor={(mediaId) => mediaId}
                      horizontal
                      ItemSeparatorComponent={() => (
                        <View style={{ width: 10 }} />
                      )}
                      renderItem={({ item: mediaId }) => (
                        <ListMovieItem mediaId={mediaId} />
                      )}
                    />
                    <View className="flex-row justify-between gap-3">
                      <View className="gap-3">
                        <Text className="text-white">
                          {formatTimestamp(list?.timestamp)}
                        </Text>
                      </View>
                      <View className="flex-row gap-3">
                        <Text className="text-white">
                          {list?.movies ? list?.movies.length : 0} Film
                        </Text>
                        <Text className="text-white">X Yorum</Text>
                        <Text className="text-white">X Beğeni</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </OpacityDecorator>
            </ScaleDecorator>
          </ShadowDecorator>
        );
      } else if (item.type === "review") {
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
                            {item.type}: {item.text || "Review"}
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
              <TouchableOpacity onPress={() => handleSelectItemType("list")}>
                <Text>list</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelectItemType("review")}>
                <Text>review</Text>
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
