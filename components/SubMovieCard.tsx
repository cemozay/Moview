import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";

const genres: any = {
  12: "Adventure",
  14: "Fantasy",
  16: "Animation",
  18: "Drama",
  27: "Horror",
  28: "Action",
  35: "Comedy",
  36: "History",
  37: "Western",
  53: "Thriller",
  80: "Crime",
  99: "Documentry",
  10402: "Music",
  878: "Science Fiction",
  9648: "Mystry",
  10749: "Romance",
  10751: "Family",
  10752: "War",
  10770: "TV Movie",
};

const SubMovieCard = (props: any) => {
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
        <Text className="color-white">{props.release_date}</Text>
        <View style={styles.genreContainer}>
          {props.genre &&
            props.genre.map((item: any) => {
              return (
                <View key={item}>
                  <Text style={styles.genreText}>{genres[item]}</Text>
                </View>
              );
            })}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "black",
  },
  cardImage: {
    aspectRatio: 2 / 3,
    borderRadius: 20,
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
