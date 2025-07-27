import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  collection,
  getDoc,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// Local imports
import { RootStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "../firebaseConfig";
import useUserStore from "../utils/hooks/useUserStore";
import { useMovieData } from "utils/hooks/useMovieData";
import { SearchResult, useSearch } from "utils/hooks/useSearch";

// Types
type AddListProps = NativeStackScreenProps<RootStackParamList, "AddList"> & {
  route: {
    params: {
      movies: string[] | undefined;
      listId: string | null;
    };
  };
};

// Constants
const MAX_LIST_NAME_LENGTH = 32;
const MAX_DESCRIPTION_LENGTH = 100;

const AddList = ({ navigation, route }: AddListProps) => {
  // Route params
  const listId = route.params.listId || null;

  // State
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");
  const [localMovies, setLocalMovies] = useState<string[]>([]);
  const [listMovies, setListMovies] = useState<string[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );
  const [showResults, setShowResults] = useState(false);

  // Store
  const user = useUserStore((state) => state.user);

  // Hooks
  const {
    data: searchData,
    error,
    isLoading,
    isError,
    refetch,
  } = useSearch("movie", searchQuery);

  // Effects
  useEffect(() => {
    const fetchListData = async () => {
      if (listId) {
        try {
          const listsRef = collection(FirebaseDB, "lists");
          const reviewDocRef = doc(listsRef, listId);
          const reviewDoc = await getDoc(reviewDocRef);

          if (reviewDoc.exists()) {
            const data = reviewDoc.data();
            setListName(data.name || "");
            setDescription(data.description || "");
            const movieIds = data.movies || [];
            setListMovies(movieIds);
          }
        } catch (error) {
          console.error("Error fetching list data:", error);
        }
      }
    };

    fetchListData();
  }, [listId]);

  useEffect(() => {
    if (route.params.movies) {
      setLocalMovies(route.params.movies);
    } else if (listMovies.length > 0) {
      setLocalMovies(listMovies);
    } else {
      setLocalMovies([]);
    }
  }, [route.params.movies, listMovies]);

  useEffect(() => {
    if (searchData && !isLoading && !isError) {
      setSearchResults(searchData.results);
      setShowResults(true);
    } else {
      setSearchResults(null);
      setShowResults(false);
      if (isError) {
        console.error("Search error:", error);
      }
    }
  }, [searchData, isLoading, isError, error]);

  // Handlers
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      refetch();
    } else {
      setShowResults(false);
      setSearchResults(null);
    }
  };

  const addMovieToList = (movieId: string) => {
    if (!localMovies.includes(movieId)) {
      setLocalMovies((prev) => [...prev, movieId]);
    }
    closeSearchModal();
  };

  const removeMovieFromList = (movieId: string) => {
    setLocalMovies((prev) => prev.filter((id) => id !== movieId));
  };

  const closeSearchModal = () => {
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults(null);
    setShowResults(false);
  };

  const handleAddList = async () => {
    if (!listName.trim() || !description.trim()) {
      console.error("List name and description cannot be empty!");
      return;
    }

    try {
      const listsRef = collection(FirebaseDB, "lists");
      const listData = {
        timestamp: serverTimestamp(),
        name: listName.trim(),
        description: description.trim(),
        movies: localMovies,
        userId: user!.uid,
      };

      if (listId) {
        const reviewDocRef = doc(listsRef, listId);
        await setDoc(reviewDocRef, listData);
      } else {
        await addDoc(listsRef, listData);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error adding or updating document:", error);
    }
  };

  // Components
  const MovieItem = ({ item, drag, isActive }: RenderItemParams<string>) => {
    const { data: movie } = useMovieData(item);

    if (!item || !movie) {
      return null;
    }

    // Ensure movie title is always a string
    const movieTitle = movie?.title || "Unknown Movie";
    const releaseYear = movie?.release_date
      ? new Date(movie.release_date).getFullYear().toString()
      : "";
    const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : "";

    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          className="bg-gray-900/40 rounded-xl p-4 mb-3 flex-row items-center"
          activeOpacity={0.8}
        >
          <Image
            className="w-16 h-24 rounded-lg bg-gray-800"
            source={{
              uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
            }}
          />
          <View className="flex-1 ml-4">
            <Text
              className="color-white text-base font-medium mb-1"
              numberOfLines={2}
            >
              {movieTitle}
            </Text>
            {releaseYear && (
              <Text className="color-gray-400 text-sm">{releaseYear}</Text>
            )}
            {rating && (
              <View className="flex-row items-center mt-2">
                <FontAwesome6 name="star" size={12} color="#FFD700" />
                <Text className="color-gray-300 text-xs ml-1">{rating}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={() => removeMovieFromList(item)}
            className="bg-red-500/20 rounded-lg p-2 ml-2"
            activeOpacity={0.8}
          >
            <Text className="color-red-400 text-xs font-medium">Remove</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    // Ensure all values are strings
    const movieTitle = item?.title || "Unknown Movie";
    const releaseYear = item?.release_date
      ? new Date(item.release_date).getFullYear().toString()
      : "";
    const rating = item?.vote_average ? item.vote_average.toFixed(1) : "";
    const isAdded = localMovies.includes(item.id.toString());

    return (
      <TouchableOpacity
        onPress={() => addMovieToList(item.id.toString())}
        className="bg-gray-900/40 rounded-xl p-4 mb-3 flex-row items-center"
        activeOpacity={0.7}
      >
        <Image
          className="w-16 h-24 rounded-lg bg-gray-800"
          source={{
            uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
          }}
        />
        <View className="flex-1 ml-4">
          <Text
            className="color-white text-base font-medium mb-1"
            numberOfLines={2}
          >
            {movieTitle}
          </Text>
          {releaseYear && (
            <Text className="color-gray-400 text-sm">{releaseYear}</Text>
          )}
          {rating && (
            <View className="flex-row items-center mt-2">
              <FontAwesome6 name="star" size={12} color="#FFD700" />
              <Text className="color-gray-300 text-xs ml-1">{rating}</Text>
            </View>
          )}
        </View>
        <View className="bg-orange-500/20 rounded-lg p-2">
          <Text className="color-orange-400 text-xs font-medium">
            {isAdded ? "Added" : "Add"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyMovieList = () => (
    <View className="flex-1 justify-center items-center bg-gray-900/30 rounded-xl">
      <FontAwesome6 name="film" size={48} color="#6B7280" />
      <Text className="color-gray-400 text-lg font-medium mt-4 mb-2">
        No movies added yet
      </Text>
      <Text className="color-gray-500 text-center text-sm px-8">
        Start building your list by adding your favorite movies
      </Text>
    </View>
  );

  const renderSearchState = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center">
          <View className="bg-gray-900/50 rounded-xl p-6">
            <Text className="color-gray-300 text-center">Loading...</Text>
          </View>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 justify-center items-center">
          <View className="bg-red-900/20 rounded-xl p-6 border border-red-500/20">
            <Text className="color-red-400 text-center">
              Something went wrong
            </Text>
          </View>
        </View>
      );
    }

    if (!showResults || !searchResults) {
      return (
        <View className="flex-1 justify-center items-center">
          <View className="bg-gray-900/30 rounded-xl p-8">
            <FontAwesome6 name="search" size={48} color="#6B7280" />
            <Text className="color-gray-400 text-center text-base mt-4">
              Start typing to search for movies
            </Text>
          </View>
        </View>
      );
    }

    return (
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={renderSearchResult}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-4 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-gray-900/50 rounded-full p-2"
        >
          <FontAwesome6 name="angle-left" size={24} color="white" />
        </TouchableOpacity>

        <Text className="color-white text-xl font-bold">
          {listId ? "Edit List" : "Create List"}
        </Text>

        <TouchableOpacity
          onPress={handleAddList}
          className="bg-orange-500 rounded-full p-2"
        >
          <FontAwesome6 name="check" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-4">
        {/* List Name Input */}
        <View className="mb-6">
          <Text className="color-white text-lg font-semibold mb-3">
            List Name
          </Text>
          <TextInput
            className="bg-gray-900/50 rounded-xl p-4 color-white text-lg"
            maxLength={MAX_LIST_NAME_LENGTH}
            selectTextOnFocus={true}
            multiline={false}
            numberOfLines={1}
            placeholder="Enter list name..."
            placeholderTextColor="#9CA3AF"
            value={listName}
            onChangeText={setListName}
            style={{ fontSize: 18 }}
          />
        </View>

        {/* Description Input */}
        <View className="mb-6">
          <Text className="color-white text-lg font-semibold mb-3">
            Description
          </Text>
          <TextInput
            className="bg-gray-900/50 rounded-xl p-4 color-white"
            multiline={true}
            placeholder="Add a description..."
            maxLength={MAX_DESCRIPTION_LENGTH}
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            style={{
              fontSize: 16,
              minHeight: 80,
              textAlignVertical: "top",
            }}
          />
        </View>

        {/* Movies Section */}
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="color-white text-lg font-semibold">
              Movies ({localMovies.length})
            </Text>
            <TouchableOpacity
              onPress={() => setShowSearchModal(true)}
              className="bg-orange-500/20 rounded-lg px-4 py-2"
            >
              <Text className="color-orange-400 text-sm font-medium">
                Add Movies
              </Text>
            </TouchableOpacity>
          </View>

          {localMovies.length > 0 ? (
            <DraggableFlatList
              data={localMovies}
              keyExtractor={(item) => item}
              renderItem={MovieItem}
              onDragEnd={({ data }) => setLocalMovies(data)}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyMovieList()
          )}
        </View>
      </View>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeSearchModal}
      >
        <View className="flex-1 bg-black">
          {/* Modal Header */}
          <View className="flex-row justify-between items-center px-4 pt-12 pb-4">
            <TouchableOpacity
              onPress={() => setShowSearchModal(false)}
              className="bg-gray-900/50 rounded-full p-2"
            >
              <FontAwesome6 name="angle-left" size={24} color="white" />
            </TouchableOpacity>
            <Text className="color-white text-xl font-bold">Add Movies</Text>
            <View className="w-10" />
          </View>

          {/* Search Input */}
          <View className="px-4 mb-4">
            <View className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <TextInput
                className="text-white text-base"
                placeholder="Search for movies..."
                placeholderTextColor="#9CA3AF"
                onChangeText={handleSearch}
                value={searchQuery}
                autoFocus
              />
            </View>
          </View>

          {/* Search Results */}
          <View className="flex-1 px-4">{renderSearchState()}</View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  moviePosterContainer: {
    flex: 1,
    margin: 4,
    maxWidth: "31%", // Ensures 3 columns with proper spacing
  },
  moviePoster: {
    width: "100%",
    aspectRatio: 2 / 3, // Standard movie poster ratio
    borderRadius: 8,
  },
  activeMovieItem: {
    opacity: 0.8,
    transform: [{ scale: 1.02 }],
  },
  draggableMovieContainer: {
    backgroundColor: "rgba(75, 85, 99, 0.4)",
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 12,
  },
  movieItemTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  draggableMoviePoster: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
});

export default AddList;
