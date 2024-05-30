import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";

const genres: { [key: number]: string } = {
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

const MovieCard = (props: any) => {
  return (
    <TouchableOpacity onPress={() => props.cardFunction()}>
      <View
        style={[
          styles.container,
          props.shoudlMarginatedAtEnd // ? eklimi diye kontrol eder ve bu kontrol sonucu ekleme yapılır bunu class'ta nasıl yapılır??
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

        <View>
          <View style={styles.rateContainer}>
            <Text style={styles.voteText}></Text>
            {/*insanların voteleri sonucu ortalama yeni kod ile düzenleme yapılıcak */}
          </View>

          <Text
            numberOfLines={1}
            /* Açılamaları için yeni bir fonksiyon yazmak gerelebilir */
            style={styles.textTitle}
          >
            {props.title}
          </Text>
          <View style={styles.genreContainer}>
            {props.genre.map((item: any) => {
              return (
                <View key={item} style={styles.genreBox}>
                  <Text style={styles.genreText}>{genres[item]}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Burayı olabiliyorsa class yapısı ile düzenlemek gerekebilir
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
    fontSize: 24,
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
  },
  rateContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  genreBox: {
    backgroundColor: "#343A40",
    padding: 12,
    marginTop: 5,
    marginHorizontal: 0,
    borderRadius: 40,
  },
  voteText: {
    fontSize: 14,
    color: "white",
  },
  genreContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  genreText: {
    fontSize: 10,
    color: "white",
  },
});

export default MovieCard;
