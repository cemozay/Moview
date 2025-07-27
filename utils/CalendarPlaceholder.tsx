// Temporary placeholder for react-native-calendar-picker until we can use a development build
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CalendarPicker(props: any) {
  const { onDateChange, selectedStartDate } = props;
  const [selectedDate, setSelectedDate] = React.useState(
    selectedStartDate || new Date()
  );

  const handleDateSelect = () => {
    const newDate = new Date();
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date</Text>
      <TouchableOpacity onPress={handleDateSelect} style={styles.dateButton}>
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>
      <Text style={styles.instruction}>Tap to select today's date</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: {
    color: "white",
    fontSize: 16,
  },
  instruction: {
    color: "#888",
    fontSize: 12,
  },
});
