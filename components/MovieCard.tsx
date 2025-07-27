import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/FontAwesome";

interface MovieCardProps {
  cardFunction: () => void;
  shouldMarginatedAtEnd?: boolean;
  shouldMarginatedAround?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  cardWidth: number;
  title: string;
  imagePath: string;
  genre: number[];
  rating?: number;
}

const MovieCard = (props: MovieCardProps) => {
  const [isPressed, setIsPressed] = useState(false);

  // Function to get rating comment based on score
  const getRatingComment = (rating: number) => {
    if (rating >= 8.5) return "Mükemmel";
    if (rating >= 7.5) return "Çok Beğenilmiş";
    if (rating >= 6.5) return "İyi";
    if (rating >= 5.5) return "Ortalama";
    if (rating >= 4.0) return "Zayıf";
    return "Kötü";
  };

  const currentRating = props.rating || 8.5;

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: isPressed ? 0.95 : 1 }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => props.cardFunction()}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.container,
            props.shouldMarginatedAtEnd
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
          {/* Image Container with Gradient Overlay */}
          <View style={styles.imageContainer}>
            <Image
              style={[styles.cardImage, { width: props.cardWidth }]}
              source={{ uri: props.imagePath }}
            />

            {/* Gradient Overlay */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
              style={styles.gradientOverlay}
            />

            {/* Rating Badge */}
            <View style={styles.ratingBadge}>
              <Icon name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>
                {props.rating ? props.rating.toFixed(1) : "8.5"}
              </Text>
            </View>

            {/* Quality Badge */}
            <View style={styles.qualityBadge}>
              <Text style={styles.qualityText}>HD</Text>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            <Text numberOfLines={2} style={styles.textTitle}>
              {props.title}
            </Text>

            {/* Rating and Comment Section */}
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBox}>
                <Icon name="star" size={10} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {currentRating.toFixed(1)}
                </Text>
              </View>
              <Text style={styles.commentText}>
                {getRatingComment(currentRating)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Modern styles with glass morphism and contemporary design
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.3)", // Glass effect
    borderRadius: 12, // Reduced from 24
    borderWidth: 1,
    borderColor: "rgba(75, 85, 99, 0.3)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  imageContainer: {
    position: "relative",
    overflow: "hidden",
  },
  cardImage: {
    aspectRatio: 2 / 3,
    borderTopLeftRadius: 12, // Reduced from 24
    borderTopRightRadius: 12, // Reduced from 24
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    borderTopLeftRadius: 12, // Reduced from 24
    borderTopRightRadius: 12, // Reduced from 24
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8, // Reduced from 12
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  qualityBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255, 92, 0, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6, // Reduced from 8
  },
  qualityText: {
    fontSize: 10,
    color: "white",
    fontWeight: "700",
  },
  contentContainer: {
    padding: 16,
    backgroundColor: "rgba(17, 24, 39, 0.5)",
  },
  textTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  ratingBox: {
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commentText: {
    fontSize: 12,
    color: "#FFD700",
    fontWeight: "500",
  },
});

export default MovieCard;
