// Temporary placeholder for react-native-floating-action until we can use a development build
import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type ActionItem = {
  text: string;
  icon: JSX.Element;
  onPress?: () => void;
  name: string;
  position: number;
  color: string;
};

type FloatingActionProps = {
  actions: ActionItem[];
  onPressItem?: (name: string) => void;
  onPressMain?: () => void;
  color?: string;
  distanceToEdge?: number;
  overlayColor?: string;
};

export const FloatingAction = (props: FloatingActionProps) => {
  const {
    actions,
    onPressMain,
    onPressItem,
    color = "#007AFF",
    distanceToEdge = 16,
    overlayColor = "rgba(0, 0, 0, 0.5)",
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleMainPress = () => {
    if (onPressMain) {
      onPressMain();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleActionPress = (action: ActionItem) => {
    setIsOpen(false);
    if (onPressItem) {
      onPressItem(action.name);
    }
    if (action.onPress) {
      action.onPress();
    }
  };

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={[styles.overlay, { backgroundColor: overlayColor }]}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        />
      )}

      {isOpen &&
        actions.map((action, index) => (
          <TouchableOpacity
            key={action.name}
            style={[
              styles.actionButton,
              {
                backgroundColor: action.color,
                bottom: distanceToEdge + 70 + index * 60,
                right: distanceToEdge,
              },
            ]}
            onPress={() => handleActionPress(action)}
          >
            {action.icon}
          </TouchableOpacity>
        ))}

      <TouchableOpacity
        style={[
          styles.floatingButton,
          {
            backgroundColor: color,
            bottom: distanceToEdge,
            right: distanceToEdge,
          },
        ]}
        onPress={handleMainPress}
      >
        <Text style={styles.buttonText}>{isOpen ? "×" : "+"}</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  floatingButton: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 3,
  },
  actionButton: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
