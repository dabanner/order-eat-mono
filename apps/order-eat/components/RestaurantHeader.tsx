import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Platform } from 'react-native';
import { Restaurant } from '@repo/store/src/restaurantStore';
import { MaterialIcons, FontAwesome6 } from '@expo/vector-icons';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <View style={styles.info}>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <View style={styles.ratingContainer}>
        <MaterialIcons name="star" size={24} color="#FF8C00" />
        <Text style={styles.rating}>{restaurant.rating}</Text>
        <MaterialIcons name="schedule" size={24} color="#FF8C00" style={styles.icon} />
        <Text style={styles.rating}>{restaurant.time}</Text>
      </View>
      <View style={styles.addressContainer}>
        <MaterialIcons name="place" size={24} color="#FF8C00" />
        <Text style={styles.address}>{restaurant.address}</Text>
        <FontAwesome6 name="compass" size={24} color="#FF8C00" />
        <TouchableOpacity
          onPress={() => Linking.openURL(`https://maps.google.com/?q=${restaurant.latitude},${restaurant.longitude}`)}
        >
          <Text style={styles.directionText}>Get Direction</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{restaurant.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    padding: 20,
    ...Platform.select({
      web: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
      }
    }),
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#333',
  },
  icon: {
    marginLeft: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  directionText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
});

