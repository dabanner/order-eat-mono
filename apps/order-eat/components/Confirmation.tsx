import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Restaurant } from '@repo/store/src/restaurantStore';
import { Command } from '@repo/store/src/commandStore';

interface ConfirmationProps {
  restaurant: Restaurant;
  command: Command;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ restaurant, command }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservation Confirmed!</Text>
      <Text style={styles.subtitle}>Thank you for your reservation at {restaurant.name}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailTitle}>Reservation Details:</Text>
        <Text style={styles.detail}>Date: {command.reservationDetails.date}</Text>
        <Text style={styles.detail}>Time: {command.reservationDetails.time}</Text>
        <Text style={styles.detail}>Number of Persons: {command.reservationDetails.numberOfPersons}</Text>
        <Text style={styles.detail}>Type: {command.type === 'dinein' ? 'Dine In' : 'Take Away'}</Text>
      </View>
      {command.menuItems.length > 0 && (
        <View style={styles.menuItemsContainer}>
          <Text style={styles.detailTitle}>Pre-ordered Items:</Text>
          {command.menuItems.map((item, index) => (
            <Text key={index} style={styles.menuItem}>
              {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
            </Text>
          ))}
        </View>
      )}
      <Text style={styles.totalAmount}>Total Amount: ${command.totalAmount.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  menuItemsContainer: {
    marginBottom: 20,
  },
  menuItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

