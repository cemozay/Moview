import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  ScrollView,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FirebaseDB } from "../firebaseConfig";
import { getDoc, doc, deleteDoc } from "firebase/firestore";
import { useMovieData } from "../utils/hooks/useMovieData";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Icon from "@expo/vector-icons/FontAwesome";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useUserStore from "../utils/hooks/useUserStore";
import { RootStackParamList } from "navigation/InsideNavigation";

const { width } = Dimensions.get("window");

type ListDetailsScreenNavigate = NativeStackScreenProps<
  RootStackParamList,
  "ListDetailsScreen"
>;

type ListDetailsScreenProp = {
  navigation: ListDetailsScreenNavigate["navigation"];
  route: ListDetailsScreenNavigate["route"];
};

type ListProps = {
  id: string;
  name: string;
  movies: Array<string>;
  timestamp: any;
  userId: string;
  description: string;
};

const ListDetailsScreen = ({ navigation, route }: ListDetailsScreenProp) => {
  const user = useUserStore((state) => state.user);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { listId } = route.params;
  const [listData, setListData] = useState<ListProps | null>(null);

  const { movies, userId } = listData || {};

  const listDocRef = doc(FirebaseDB, "lists", listId);

  useEffect(() => {
    const fetchListData = async () => {
      try {
        const listDocSnap = await getDoc(listDocRef);

        if (listDocSnap.exists()) {
          const data = listDocSnap.data() as ListProps;
          setListData(data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchListData();
  }, [listId]);

  if (!listData) {
    return (
      <SafeAreaView className="bg-black flex-1 justify-center items-center">
        <View className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/30 items-center">
          <Text className="color-white text-lg font-medium">
            Loading list...
          </Text>
          <Text className="color-gray-400 text-sm mt-2">Please wait</Text>
        </View>
      </SafeAreaView>
    );
  }
  const MovieItem = ({ movieId }: any) => {
    const { data: movieData, isLoading, isError } = useMovieData(movieId);

    if (isLoading) {
      return (
        <View
          className="bg-gray-800/70 rounded-lg border border-gray-700/30 justify-center items-center m-1"
          style={{ width: (width - 32) / 3, aspectRatio: 2 / 3 }}
        >
          <FontAwesome6 name="image" size={24} color="#6B7280" />
        </View>
      );
    }

    if (isError || !movieData) {
      return (
        <View
          className="bg-gray-800/70 rounded-lg border border-gray-700/30 justify-center items-center m-1"
          style={{ width: (width - 32) / 3, aspectRatio: 2 / 3 }}
        >
          <FontAwesome6 name="exclamation-triangle" size={20} color="#EF4444" />
          <Text className="color-red-400 text-xs mt-1 text-center">Error</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("MovieDetails", {
            movieId: movieData.id.toString(),
          })
        }
        className="m-1"
        style={{ width: (width - 32) / 3 }}
        activeOpacity={0.8}
      >
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w342${movieData.poster_path}`,
            }}
            className="w-full rounded-lg border border-gray-700/50"
            style={{ aspectRatio: 2 / 3 }}
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/10 rounded-lg" />

          {/* Movie title overlay */}
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg p-2">
            <Text className="color-white text-xs font-medium" numberOfLines={2}>
              {movieData.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleDeleteList = async () => {
    if (!listId) return;

    Alert.alert("Delete List", "Are you sure you want to delete this list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(FirebaseDB, "lists", listId));
            navigation.goBack();
          } catch (error) {
            console.error("Error deleting list:", error);
          }
        },
      },
    ]);
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <GestureHandlerRootView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header with backdrop */}
          <View className="relative">
            <ImageBackground
              style={{ width: "100%", height: 320 }}
              resizeMode="cover"
              source={require("../screens/profile.jpg")}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
                style={StyleSheet.absoluteFillObject}
              />

              {/* Navigation */}
              <View className="flex-row justify-between px-5 pt-12">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="bg-black/60 rounded-full p-3 border border-gray-700/30"
                >
                  <AntDesign name="left" size={20} color="white" />
                </TouchableOpacity>
                {user && user.uid === userId && (
                  <TouchableOpacity
                    onPress={openBottomSheet}
                    className="bg-black/60 rounded-full p-3 border border-gray-700/30"
                  >
                    <Icon name="ellipsis-h" size={18} color="white" />
                  </TouchableOpacity>
                )}
              </View>

              {/* List Info */}
              <View className="absolute bottom-6 left-5 right-5">
                <View className="bg-black/40 rounded-2xl p-5 border border-gray-700/30 backdrop-blur-sm">
                  <View className="flex-row items-start">
                    <Image
                      className="w-16 h-16 rounded-full mr-4 border-2 border-gray-700"
                      source={require("../screens/avatar.jpg")}
                    />
                    <View className="flex-1">
                      <Text className="color-white text-2xl font-bold mb-2 leading-7">
                        {listData.name}
                      </Text>
                      <Text className="color-gray-300 text-sm mb-1">
                        Created by{" "}
                        <Text className="color-white font-semibold">
                          {userId}
                        </Text>
                      </Text>
                      {listData.description && (
                        <Text
                          className="color-gray-400 text-sm leading-5 mb-3"
                          numberOfLines={3}
                        >
                          {listData.description}
                        </Text>
                      )}
                      <View className="flex-row items-center">
                        <View className="bg-orange-500/20 rounded-full px-3 py-1 mr-2">
                          <Text className="color-orange-400 text-xs font-medium">
                            {movies?.length || 0} movies
                          </Text>
                        </View>
                        <View className="bg-gray-800/50 rounded-full px-3 py-1">
                          <Text className="color-gray-400 text-xs font-medium">
                            Public List
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Movies Grid */}
          <View className="px-5 py-6">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="color-white text-xl font-bold">Movies</Text>
              {movies && movies.length > 0 && (
                <View className="bg-gray-800/50 px-3 py-1 rounded-full">
                  <Text className="color-gray-400 text-xs font-medium">
                    {movies.length} total
                  </Text>
                </View>
              )}
            </View>

            {movies && movies.length > 0 ? (
              <View className="bg-gray-900/30 rounded-2xl p-3 border border-gray-800/30">
                <FlatList
                  data={movies}
                  keyExtractor={(item) => item.toString()}
                  numColumns={3}
                  renderItem={({ item }) => <MovieItem movieId={item} />}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  ItemSeparatorComponent={() => <View className="h-2" />}
                />
              </View>
            ) : (
              <View className="bg-gray-900/30 rounded-2xl p-8 border border-gray-800/30 items-center">
                <View className="bg-gray-800/50 rounded-full p-4 mb-4">
                  <Icon name="film" size={32} color="#6b7280" />
                </View>
                <Text className="color-white text-lg font-semibold mb-2">
                  Empty List
                </Text>
                <Text className="color-gray-400 text-center text-sm leading-5">
                  This list doesn't have any movies yet.{"\n"}Add some movies to
                  get started!
                </Text>
                {user && user.uid === userId && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("AddList", {
                        listId: route.params.listId,
                        movies: undefined,
                      })
                    }
                    className="bg-orange-500 rounded-xl px-4 py-2 mt-4"
                  >
                    <Text className="color-white text-sm font-medium">
                      Add Movies
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Comments Section */}
          <View className="px-5 pb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="color-white text-xl font-bold">Comments</Text>
              <TouchableOpacity>
                <Text className="color-orange-400 text-sm font-medium">
                  View all
                </Text>
              </TouchableOpacity>
            </View>

            <View className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/30 items-center">
              <View className="bg-gray-800/50 rounded-full p-3 mb-3">
                <Icon name="comment-o" size={24} color="#6b7280" />
              </View>
              <Text className="color-white text-base font-medium mb-1">
                No comments yet
              </Text>
              <Text className="color-gray-400 text-center text-sm">
                Be the first to share your thoughts about this list
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Sheet */}
        <BottomSheet
          enablePanDownToClose
          ref={bottomSheetRef}
          index={-1}
          snapPoints={[280]}
          backgroundStyle={{ backgroundColor: "#1f1f1f" }}
          handleIndicatorStyle={{
            backgroundColor: "#6B7280",
            width: 40,
            height: 4,
          }}
        >
          <View className="p-6">
            <Text className="color-white text-xl font-bold mb-6 text-center">
              List Options
            </Text>

            <TouchableOpacity
              className="bg-orange-500/20 rounded-2xl p-4 mb-4 border border-orange-500/30"
              onPress={() => {
                bottomSheetRef.current?.close();
                navigation.navigate("AddList", {
                  listId: route.params.listId,
                  movies: undefined,
                });
              }}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                <FontAwesome6 name="pen-to-square" size={18} color="#FF5C00" />
                <Text className="color-orange-400 text-base font-semibold ml-3">
                  Edit List
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500/20 rounded-2xl p-4 border border-red-500/30"
              onPress={() => {
                bottomSheetRef.current?.close();
                handleDeleteList();
              }}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                <FontAwesome6 name="trash-can" size={18} color="#ef4444" />
                <Text className="color-red-400 text-base font-semibold ml-3">
                  Delete List
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-800/50 rounded-2xl p-4 mt-2 border border-gray-700/30"
              onPress={() => bottomSheetRef.current?.close()}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                <Text className="color-gray-400 text-base font-medium">
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default ListDetailsScreen;
