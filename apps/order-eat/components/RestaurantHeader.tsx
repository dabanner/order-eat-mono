import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface RestaurantHeaderProps {
  restaurant: {
    name: string;
    rating: number;
    time: string;
    description: string;
  };
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant }) => {
  return (
    <View style={styles.info}>
      <View style={styles.ratingContainer}>
        <MaterialIcons name="star" size={24} color="#FF8C00" />
        <Text style={styles.rating}>{restaurant.rating}</Text>
        <MaterialIcons name="schedule" size={24} color="#FF8C00" style={styles.time} />
        <Text style={styles.rating}>{restaurant.time}</Text>
      </View>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Text style={styles.description}>{restaurant.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  info: {
    padding: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  time: {
    marginLeft: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
});

