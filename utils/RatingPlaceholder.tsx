// Temporary placeholder for react-native-ratings until we can use a development build
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const AirbnbRating = (props: any) => {
  const {
    defaultRating = 3,
    showRating = true,
    onFinishRating,
    size = 20,
  } = props;
  const [rating, setRating] = React.useState(defaultRating);

  const handleRating = (newRating: number) => {
    setRating(newRating);
    if (onFinishRating) {
      onFinishRating(newRating);
    }
  };

  return (
    <View style={styles.container}>
      {showRating && <Text style={styles.ratingText}>Rating: {rating}/5</Text>}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(star)}
            style={styles.star}
          >
            <Text
              style={[
                styles.starText,
                { color: star <= rating ? "#FFD700" : "#DDD", fontSize: size },
              ]}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  ratingText: {
    color: "white",
    marginBottom: 10,
    fontSize: 16,
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    paddingHorizontal: 5,
  },
  starText: {
    fontSize: 20,
  },
});
