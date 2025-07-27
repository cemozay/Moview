import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  FirebaseStorage,
  FirebaseDB,
  FirebaseAuth,
} from "../../firebaseConfig";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import useUserStore from "../../utils/hooks/useUserStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList, {
  ScaleDecorator,
  ShadowDecorator,
  OpacityDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import {
  collection,
  setDoc,
  query,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import { formatTimestamp } from "../../utils/functions";
import { useMovieData } from "../../utils/hooks/useMovieData";
import { signOut } from "firebase/auth";

type updateProfileInfoType = () => void;

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

interface SettingsHeaderComponentsProps {
  updateProfileInfo?: updateProfileInfoType;
  navigation?: {
    goBack: () => void;
  };
  onRefresh?: () => void;
}

const SettingsHeaderComponents: React.FC<SettingsHeaderComponentsProps> = ({
  updateProfileInfo,
  navigation,
  onRefresh,
}) => {
  const MovieItem = ({ mediaId }: { mediaId: string }) => {
    const { data: movie, isLoading, isError } = useMovieData(mediaId);

    if (isLoading) {
      return (
        <View className="h-20 w-14 bg-gray-800/70 rounded-lg border border-gray-700/30 justify-center items-center mr-2">
          <MaterialIcons name="image" size={16} color="#6B7280" />
        </View>
      );
    }

    if (isError) {
      return (
        <View className="h-20 w-14 bg-gray-800/70 rounded-lg border border-gray-700/30 justify-center items-center mr-2">
          <MaterialIcons name="image" size={16} color="#6B7280" />
        </View>
      );
    }

    return (
      <View className="mr-2">
        <Image
          className="h-20 w-14 rounded-lg border border-gray-700/50"
          source={{
            uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
          }}
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/20 rounded-lg" />
      </View>
    );
  };
  const { user, updateUserProfile } = useUserStore((state) => ({
    user: state.user,
    updateUserProfile: state.updateUserProfile,
  }));

  const [username, setUsername] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");

  // Showcase states
  const [data, setData] = useState<Item[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modalType, setModalType] = useState<"list" | "review" | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const docRef = collection(FirebaseDB, "users");

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Fetch showcase data
  useEffect(() => {
    const fetchDocs = async () => {
      if (user) {
        const doc_query = query(docRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(doc_query);

        if (snapshot.empty) {
          // Eğer kullanıcı dokümanı yoksa boş bir showcase array'i ayarla
          setData([]);
          console.log("No user document found, setting empty showcase");
        } else {
          snapshot.docs.forEach((doc) => {
            const showCaseArray = doc.data().showCase;
            setData(showCaseArray || []);
          });
        }
      }
    };

    fetchDocs();
  }, [user]);

  // Fetch lists
  useEffect(() => {
    const fetchLists = async () => {
      if (user) {
        const listsRef = collection(FirebaseDB, "lists");
        const doc_querylist = query(listsRef, where("userId", "==", user.uid));

        try {
          const snapshot = await getDocs(doc_querylist);
          const listCollection = snapshot.docs.map((doc) => {
            const listData = doc.data() as List;
            return { ...listData, id: doc.id };
          });
          setLists(listCollection);
        } catch (error) {
          console.error("Error fetching lists:", error);
        }
      }
    };

    fetchLists();
  }, [user]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (user) {
        const reviewsRef = collection(FirebaseDB, "reviews");
        const doc_queryreview = query(
          reviewsRef,
          where("userId", "==", user.uid)
        );

        try {
          const snapshot = await getDocs(doc_queryreview);
          const reviewCollection = snapshot.docs.map((doc) => {
            const reviewData = doc.data() as Review;
            return { ...reviewData, id: doc.id };
          });
          setReviews(reviewCollection);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      }
    };

    fetchReviews();
  }, [user]);

  const handleImagePick = async (type: "profile" | "banner") => {
    // Request permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera roll is required!"
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "profile" ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const uri = asset.uri;
      if (uri) {
        await uploadImage(uri, type);
      }
    }
  };

  const uploadImage = async (uri: string, type: "profile" | "banner") => {
    const folder = type === "profile" ? "profile_pictures" : "profile_banners";
    const storage = FirebaseStorage;
    const storageRef = ref(storage, `${folder}/${user?.uid}.jpg`);
    const img = await fetch(uri);
    const bytes = await img.blob();

    try {
      await uploadBytes(storageRef, bytes);
      const downloadURL = await getDownloadURL(storageRef);
      await updateUserProfile(
        type === "profile" ? { photoURL: downloadURL } : {}
      );
      Alert.alert(
        "Success",
        `${
          type === "profile" ? "Profile picture" : "Background image"
        } uploaded successfully`
      );
    } catch (error: any) {
      Alert.alert("Error", "Error uploading image: " + error.message);
    }
  };

  // Showcase management functions
  const handleAddItem = () => {
    if (data.length < 3) {
      const newItem: Item = {
        type: "",
        key: Math.random().toString(),
        text: `Item ${data.length + 1}`,
        isSelected: true,
        id: "",
      };
      setData((prevData) => [
        ...prevData.map((item) => ({ ...item, isSelected: false })),
        newItem,
      ]);
      setIsBottomSheetOpen(true);
    }
  };

  const handleDeleteItem = (key: string) => {
    setData((prevData) => prevData.filter((item) => item.key !== key));
  };

  const handleSelectItemType = (type: string) => {
    setIsBottomSheetOpen(false);

    const selectedItem = data.find((item) => item.isSelected);
    if (!selectedItem) return;

    setSelectedItem(selectedItem);
    setModalType(type as "list" | "review");

    setData((prevData) =>
      prevData.map((prevItem) =>
        prevItem.isSelected
          ? { ...prevItem, type, isSelected: false }
          : prevItem
      )
    );
  };

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

  const updateProfileInfoComplete = async () => {
    try {
      await updateUserProfile({ displayName: username });
      console.log("User profile updated");

      if (user) {
        const q = query(
          collection(FirebaseDB, "users"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          const userDocRef = doc(FirebaseDB, "users", user.uid);
          await setDoc(userDocRef, {
            userId: user.uid,
            email: user.email,
            displayName: username,
            showCase: data,
            createdAt: new Date(),
          });
          console.log("New user document created");
        } else {
          const updatePromises = querySnapshot.docs.map(async (docSnap) => {
            try {
              await setDoc(
                docSnap.ref,
                {
                  showCase: data,
                  displayName: username,
                  updatedAt: new Date(),
                },
                { merge: true }
              );
              console.log("Document updated:", docSnap.id);
            } catch (error) {
              console.error("Error updating document:", error);
              throw error;
            }
          });

          await Promise.all(updatePromises);
        }
      }

      // Show success alert and go back
      Alert.alert("Başarılı", "Profil bilgileriniz başarıyla güncellendi!", [
        {
          text: "Tamam",
          onPress: () => {
            if (updateProfileInfo) {
              updateProfileInfo();
            }
            if (onRefresh) {
              onRefresh();
            }
            navigation?.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating user profile:", error);
      Alert.alert(
        "Hata",
        "Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  // Logout function
  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkmak istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(FirebaseAuth);
              // Navigation will be handled automatically by auth state listener
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Hata", "Çıkış yaparken bir hata oluştu.");
            }
          },
        },
      ]
    );
  };

  // Review Movie Header Component
  const ReviewMovieHeader: React.FC<{ review: Review }> = ({ review }) => {
    const { data: movie, isLoading, isError } = useMovieData(review.mediaId);

    if (isLoading) {
      return (
        <View className="flex-row items-center justify-center py-4">
          <Text className="color-gray-400 text-center">Loading movie...</Text>
        </View>
      );
    }

    if (isError || !movie) {
      return (
        <View className="flex-row items-center justify-center py-4">
          <Text className="color-red-400 text-center">Error loading movie</Text>
        </View>
      );
    }

    return (
      <View className="mb-4">
        <Text className="color-white text-xl font-bold mb-2 leading-6">
          {movie.title}
        </Text>
      </View>
    );
  };

  // Review Movie Poster Component
  const ReviewMoviePoster: React.FC<{ mediaId: string }> = ({ mediaId }) => {
    const { data: movie, isLoading, isError } = useMovieData(mediaId);

    if (isLoading) {
      return (
        <View className="h-24 w-16 bg-gray-700 rounded-lg border border-gray-700/50" />
      );
    }

    if (isError || !movie) {
      return (
        <View className="h-24 w-16 bg-gray-700 rounded-lg border border-gray-700/50" />
      );
    }

    return (
      <View className="mr-4">
        <Image
          className="h-24 w-16 rounded-lg border border-gray-700/50"
          source={{
            uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
          }}
        />
        <View className="absolute inset-0 bg-black/20 rounded-lg" />
      </View>
    );
  };

  // Render showcase items
  const renderShowcaseItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {
      const list = lists.find((listItem) => listItem.id === item.id);
      const review = reviews.find((reviewItem) => reviewItem.id === item.id);

      if (item.type === "list" && list) {
        return (
          <ShadowDecorator>
            <ScaleDecorator>
              <OpacityDecorator>
                <TouchableOpacity className="bg-gray-900/60 rounded-2xl p-5 mb-4 border border-gray-800/30">
                  {/* Header with Control Buttons */}
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center gap-3">
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
                        className="bg-orange-500/20 px-3 py-2 rounded-lg"
                      >
                        <Text className="color-orange-400 text-sm font-medium">
                          📝 List Type
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setSelectedItem(item);
                          setModalType("list");
                        }}
                        className="bg-gray-700/50 px-3 py-2 rounded-lg"
                      >
                        <Text className="color-white text-sm">
                          {item.text ? "List Selected" : "Choose List"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => handleDeleteItem(item.key)}
                        className="p-2 bg-red-500/20 rounded-lg"
                      >
                        <FontAwesome6 name="trash" size={16} color="#ef4444" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={1}
                        onLongPress={drag}
                        delayLongPress={150}
                        disabled={isActive}
                        className="p-2 bg-gray-700/50 rounded-lg"
                      >
                        <FontAwesome5
                          name="grip-vertical"
                          size={16}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Top section with user info */}
                  <View className="flex-row items-center mb-4">
                    <Image
                      className="w-10 h-10 rounded-full mr-3 border-2 border-gray-700"
                      source={require("../avatar.jpg")}
                    />
                    <View className="flex-1">
                      <Text className="color-white text-sm font-semibold">
                        {list.userId}
                      </Text>
                      <Text className="color-gray-500 text-xs">
                        {formatTimestamp(list.timestamp)}
                      </Text>
                    </View>
                    <View className="bg-gray-800/50 px-3 py-1 rounded-full">
                      <Text className="color-gray-400 text-xs font-medium">
                        {list.movies ? list.movies.length : 0} films
                      </Text>
                    </View>
                  </View>

                  {/* List Title and Description */}
                  <View className="mb-4">
                    <Text className="color-white text-xl font-bold mb-2 leading-6">
                      {list.name}
                    </Text>
                    {list.description && (
                      <Text
                        className="color-gray-400 text-sm leading-5"
                        numberOfLines={3}
                      >
                        {list.description}
                      </Text>
                    )}
                  </View>

                  {/* Movie Posters Grid */}
                  {list.movies && list.movies.length > 0 && (
                    <View className="mb-4">
                      <View className="flex-row justify-between">
                        {/* Show first 4 movies when there are more than 5 */}
                        {list.movies.length > 5 ? (
                          <>
                            {list.movies.slice(0, 4).map((mediaId) => (
                              <MovieItem key={mediaId} mediaId={mediaId} />
                            ))}
                            <View className="h-20 w-14 bg-gray-800/70 rounded-lg justify-center items-center border border-gray-700/50">
                              <Text className="color-white text-xs font-bold">
                                +{list.movies.length - 4}
                              </Text>
                              <Text className="color-gray-400 text-xs">
                                more
                              </Text>
                            </View>
                          </>
                        ) : (
                          /* Show all movies when 5 or less */
                          list.movies.map((mediaId) => (
                            <MovieItem key={mediaId} mediaId={mediaId} />
                          ))
                        )}
                      </View>
                    </View>
                  )}

                  {/* Action indicator */}
                  <View className="flex-row items-center justify-end">
                    <Text className="color-gray-500 text-xs mr-2">
                      Edit list
                    </Text>
                    <AntDesign name="right" size={12} color="#6B7280" />
                  </View>
                </TouchableOpacity>
              </OpacityDecorator>
            </ScaleDecorator>
          </ShadowDecorator>
        );
      } else if (item.type === "review" && review) {
        return (
          <ShadowDecorator>
            <ScaleDecorator>
              <OpacityDecorator>
                <View className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800/30 mb-4">
                  {/* Header with Control Buttons */}
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center gap-3">
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
                        className="bg-blue-500/20 px-3 py-2 rounded-lg"
                      >
                        <Text className="color-blue-400 text-sm font-medium">
                          ⭐ Review Type
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setSelectedItem(item);
                          setModalType("review");
                        }}
                        className="bg-gray-700/50 px-3 py-2 rounded-lg"
                      >
                        <Text className="color-white text-sm">
                          {item.text ? "Review Selected" : "Choose Review"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => handleDeleteItem(item.key)}
                        className="p-2 bg-red-500/20 rounded-lg"
                      >
                        <FontAwesome6 name="trash" size={16} color="#ef4444" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={1}
                        onLongPress={drag}
                        delayLongPress={150}
                        disabled={isActive}
                        className="p-2 bg-gray-700/50 rounded-lg"
                      >
                        <FontAwesome5
                          name="grip-vertical"
                          size={16}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Top section with user info */}
                  <View className="flex-row items-center mb-4">
                    <Image
                      className="w-10 h-10 rounded-full mr-3 border-2 border-gray-700"
                      source={
                        user?.photoURL
                          ? { uri: user.photoURL }
                          : require("../avatar.jpg")
                      }
                    />
                    <View className="flex-1">
                      <Text className="color-white text-sm font-semibold">
                        {user?.displayName || "You"}
                      </Text>
                      <Text className="color-gray-500 text-xs">
                        {formatTimestamp(review.timestamp)}
                      </Text>
                    </View>
                    <View className="bg-orange-500/20 px-3 py-1 rounded-full">
                      <Text className="color-orange-400 text-sm font-medium">
                        ★ {review.rating}
                      </Text>
                    </View>
                  </View>

                  {/* Movie title */}
                  <ReviewMovieHeader review={review} />

                  {/* Review content */}
                  <View className="flex-row mb-4">
                    {/* Movie Poster */}
                    <ReviewMoviePoster mediaId={review.mediaId} />

                    {/* Review Text */}
                    <View className="flex-1">
                      <Text
                        numberOfLines={4}
                        className="color-gray-300 text-sm leading-5"
                      >
                        {review.text}
                      </Text>
                    </View>
                  </View>

                  {/* Stats and Action */}
                  <View className="flex-row justify-between items-center pt-3 border-t border-gray-700/30">
                    <View className="flex-row gap-4">
                      <View className="flex-row items-center">
                        <AntDesign name="message1" size={12} color="#9CA3AF" />
                        <Text className="color-gray-500 text-xs ml-1">
                          0 Comments
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <AntDesign name="heart" size={12} color="#9CA3AF" />
                        <Text className="color-gray-500 text-xs ml-1">
                          0 Likes
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center">
                      <Text className="color-gray-500 text-xs mr-2">
                        Edit Review
                      </Text>
                      <AntDesign name="right" size={12} color="#6B7280" />
                    </View>
                  </View>
                </View>
              </OpacityDecorator>
            </ScaleDecorator>
          </ShadowDecorator>
        );
      } else {
        // Empty showcase item
        return (
          <ShadowDecorator>
            <ScaleDecorator>
              <OpacityDecorator>
                <View className="bg-gray-900/60 rounded-2xl border border-gray-800/30 mb-4 overflow-hidden">
                  <View className="flex-row justify-between items-center p-6">
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
                      className="flex-1 bg-orange-500/20 rounded-lg p-4 mr-3"
                    >
                      <Text className="color-orange-400 text-center font-medium">
                        + Add Showcase Item
                      </Text>
                      <Text className="color-gray-400 text-center text-sm mt-1">
                        Choose List or Review
                      </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => handleDeleteItem(item.key)}
                        className="p-3 bg-red-500/20 rounded-lg"
                      >
                        <FontAwesome6 name="trash" size={16} color="#ef4444" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={1}
                        onLongPress={drag}
                        delayLongPress={150}
                        disabled={isActive}
                        className="p-3 bg-gray-700/50 rounded-lg"
                      >
                        <FontAwesome5
                          name="grip-vertical"
                          size={16}
                          color="#9CA3AF"
                        />
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
    [data, lists, reviews]
  );

  // List Selection Modal
  const ListModal = () => (
    <Modal
      visible={modalType === "list"}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalType(null)}
    >
      <View className="flex-1 justify-end bg-black/80">
        <View className="bg-gray-900/95 rounded-t-3xl p-6 max-h-96 border-t border-gray-700/30">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="color-white text-xl font-bold">Select List</Text>
            <TouchableOpacity
              onPress={() => setModalType(null)}
              className="p-2 bg-gray-800/50 rounded-lg"
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {lists.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelectListOrReview(item.id)}
                className="bg-gray-800/60 rounded-2xl p-5 mb-4 border border-gray-700/30"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center mb-3">
                  <Image
                    className="w-10 h-10 rounded-full mr-3 border-2 border-gray-700"
                    source={require("../avatar.jpg")}
                  />
                  <View className="flex-1">
                    <Text className="color-white font-semibold text-base mb-1">
                      {item.name}
                    </Text>
                    <Text className="color-gray-500 text-xs">
                      {formatTimestamp(item.timestamp)}
                    </Text>
                  </View>
                  <View className="bg-gray-700/50 px-3 py-1 rounded-full">
                    <Text className="color-gray-400 text-xs font-medium">
                      {item.movies?.length || 0} films
                    </Text>
                  </View>
                </View>

                {item.description && (
                  <Text
                    numberOfLines={2}
                    className="color-gray-400 text-sm leading-5"
                  >
                    {item.description}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
            {lists.length === 0 && (
              <View className="bg-gray-800/30 rounded-2xl p-8 items-center border border-gray-700/20">
                <MaterialIcons name="playlist-add" size={48} color="#6B7280" />
                <Text className="color-gray-400 text-center mt-4 font-medium">
                  No lists available
                </Text>
                <Text className="color-gray-500 text-center text-sm mt-1">
                  Create a list first to showcase it
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Review Selection Modal
  const ReviewModal = () => (
    <Modal
      visible={modalType === "review"}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalType(null)}
    >
      <View className="flex-1 justify-end bg-black/80">
        <View className="bg-gray-900/95 rounded-t-3xl p-6 max-h-96 border-t border-gray-700/30">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="color-white text-xl font-bold">Select Review</Text>
            <TouchableOpacity
              onPress={() => setModalType(null)}
              className="p-2 bg-gray-800/50 rounded-lg"
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {reviews.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelectListOrReview(item.id)}
                className="bg-gray-800/60 rounded-2xl p-5 mb-4 border border-gray-700/30"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center mb-3">
                  <Image
                    className="w-10 h-10 rounded-full mr-3 border-2 border-gray-700"
                    source={
                      user?.photoURL
                        ? { uri: user.photoURL }
                        : require("../avatar.jpg")
                    }
                  />
                  <View className="flex-1">
                    <Text className="color-white font-semibold text-base mb-1">
                      Review
                    </Text>
                    <Text className="color-gray-500 text-xs">
                      {formatTimestamp(item.timestamp)}
                    </Text>
                  </View>
                  <View className="bg-orange-500/20 px-3 py-1 rounded-full">
                    <Text className="color-orange-400 text-xs font-bold">
                      ★ {item.rating}/10
                    </Text>
                  </View>
                </View>

                <Text
                  numberOfLines={3}
                  className="color-gray-300 text-sm leading-5"
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
            {reviews.length === 0 && (
              <View className="bg-gray-800/30 rounded-2xl p-8 items-center border border-gray-700/20">
                <MaterialIcons name="rate-review" size={48} color="#6B7280" />
                <Text className="color-gray-400 text-center mt-4 font-medium">
                  No reviews available
                </Text>
                <Text className="color-gray-500 text-center text-sm mt-1">
                  Write a review first to showcase it
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <GestureHandlerRootView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              className="mr-3"
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <Text className="color-white text-xl font-medium">
              Profile Settings
            </Text>
          </View>
          <TouchableOpacity
            className="bg-orange-500 p-2 rounded-lg"
            onPress={updateProfileInfoComplete}
          >
            <FontAwesome6 name="check" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Banner Section */}
        <View className="relative mx-6 mb-8">
          <ImageBackground
            className="h-48 rounded-xl overflow-hidden"
            source={require("../profile.jpg")}
          >
            <TouchableOpacity
              className="absolute top-3 right-3 bg-black/50 p-2 rounded-lg"
              onPress={() => handleImagePick("banner")}
            >
              <MaterialIcons name="edit" size={20} color="white" />
            </TouchableOpacity>
          </ImageBackground>

          {/* Profile Picture */}
          <TouchableOpacity
            className="absolute -bottom-8 self-center"
            onPress={() => handleImagePick("profile")}
          >
            <View className="relative">
              <Image
                className="h-20 w-20 rounded-full border-4 border-black"
                source={
                  user?.photoURL
                    ? { uri: user.photoURL }
                    : require("../avatar.jpg")
                }
              />
              <View className="absolute inset-0 bg-black/30 rounded-full justify-center items-center">
                <MaterialIcons name="edit" size={18} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View className="px-6 mt-4">
          <View className="bg-gray-900/40 rounded-xl p-4 mb-4">
            <Text className="color-gray-400 text-sm mb-2">Username</Text>
            <TextInput
              placeholder="Enter username"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
              className="color-white text-base"
            />
          </View>

          <View className="bg-gray-900/40 rounded-xl p-4 mb-6">
            <Text className="color-gray-400 text-sm mb-2">Email</Text>
            <TextInput
              placeholder="Enter email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              className="color-white text-base"
              editable={false}
            />
          </View>

          {/* Showcase Section */}
          <View className="items-center mb-6">
            <Text className="color-white text-xl font-semibold mb-1">
              Featured Showcase
            </Text>
            <Text className="color-gray-400 text-sm mb-4">
              Customize your profile
            </Text>

            {/* Add Showcase Button */}
            <TouchableOpacity
              onPress={handleAddItem}
              className="bg-orange-500/20 rounded-lg p-4 w-full mb-4"
              disabled={data.length >= 3}
            >
              <Text className="color-orange-400 text-center font-medium">
                {data.length >= 3 ? "Maximum 3 items" : "+ Add Showcase Item"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Showcase Items */}
        <View className="px-6">
          <DraggableFlatList
            data={data}
            onDragEnd={({ data }: { data: Item[] }) => setData(data)}
            keyExtractor={(item: Item) => item.key}
            renderItem={renderShowcaseItem}
            dragItemOverflow={true}
            contentContainerStyle={{ paddingBottom: 20 }}
            activationDistance={10}
            autoscrollSpeed={100}
          />
        </View>

        {/* Logout Button - Bottom of page */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500/20 rounded-lg p-4 w-full border border-red-500/30"
          >
            <View className="flex-row items-center justify-center">
              <MaterialIcons name="logout" size={20} color="#ef4444" />
              <Text className="color-red-400 text-center font-medium ml-2">
                Çıkış Yap
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Type Selection Modal */}
      <Modal
        visible={isBottomSheetOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsBottomSheetOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/80">
          <View className="bg-gray-900/95 rounded-t-3xl p-6 border-t border-gray-700/30">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="color-white text-xl font-bold">
                Choose Showcase Type
              </Text>
              <TouchableOpacity
                onPress={() => setIsBottomSheetOpen(false)}
                className="p-2 bg-gray-800/50 rounded-lg"
              >
                <AntDesign name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => handleSelectItemType("list")}
              className="bg-orange-500/20 rounded-2xl p-5 mb-4 border border-orange-500/30"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-orange-500/30 rounded-lg items-center justify-center mr-4">
                  <Text className="text-2xl">📝</Text>
                </View>
                <View className="flex-1">
                  <Text className="color-orange-400 text-lg font-semibold mb-1">
                    Movie List
                  </Text>
                  <Text className="color-gray-300 text-sm leading-5">
                    Showcase your curated movie collections
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelectItemType("review")}
              className="bg-blue-500/20 rounded-2xl p-5 border border-blue-500/30"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-blue-500/30 rounded-lg items-center justify-center mr-4">
                  <Text className="text-2xl">⭐</Text>
                </View>
                <View className="flex-1">
                  <Text className="color-blue-400 text-lg font-semibold mb-1">
                    Movie Review
                  </Text>
                  <Text className="color-gray-300 text-sm leading-5">
                    Share your detailed movie thoughts
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ListModal />
      <ReviewModal />
    </GestureHandlerRootView>
  );
};

export default SettingsHeaderComponents;
