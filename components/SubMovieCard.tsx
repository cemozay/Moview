import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useGenreList } from "utils/hooks/useGenreList";

type SubMovieCardProps = {
  cardFunction: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  shoudlMarginatedAtEnd?: boolean;
  shouldMarginatedAround?: boolean;
  imagePath?: string;
  cardWidth?: any;
  release_date?: Date;
  genre?: number[];
  title?: string;
};

const SubMovieCard = (props: SubMovieCardProps) => {
  const genreList = useGenreList("movie");
  const genres = genreList.data ? genreList.data.genres : [];
  const genreMap: { [key: number]: string } = {};

  genres.forEach((genre) => {
    genreMap[genre.id] = genre.name;
  });

  return (
    <TouchableOpacity onPress={() => props.cardFunction()}>
      <View
        style={[
          styles.container,
          props.shoudlMarginatedAtEnd
            ? props.isFirst
              ? { marginLeft: 36 }
              : props.isLast
              ? { marginRight: 36 }
              : {}
            : {},
          props.shouldMarginatedAround ? { margin: 12 } : {},
          { maxWidth: props.cardWidth },
        ]}
      >
        <Image
          style={[styles.cardImage, { width: props.cardWidth }]}
          source={{ uri: props.imagePath }}
        />
        <Text numberOfLines={1} style={styles.textTitle}>
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Mümkünse class sisteminde yazılacak
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "black",
  },
  cardImage: {
    aspectRatio: 2 / 3,
    borderRadius: 12, // Reduced from 20
  },
  textTitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
  },
  genreContainer: {
    flexDirection: "row",
    gap: 5,
  },
  genreText: {
    fontSize: 10,
    color: "white",
  },
});

export default SubMovieCard;
