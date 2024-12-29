import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Restaurant } from '@repo/store/src/restaurantStore';
import { Command } from '@repo/store/src/commandStore';
import { RestaurantHeader } from './RestaurantHeader';
import { ReservationForm } from './ReservationForm';

interface RestaurantInfoProps {
  restaurant: Restaurant;
  command: Command;
  updateReservationDetails: (details: Partial<Command['reservationDetails']>) => void;
}

export const RestaurantInfo: React.FC<RestaurantInfoProps> = ({ restaurant, command, updateReservationDetails }) => {
  return (
    <ScrollView style={styles.container}>
      <RestaurantHeader restaurant={restaurant} />
      <View style={styles.formContainer}>
        <ReservationForm
          initialDetails={command.reservationDetails}
          onUpdate={updateReservationDetails}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
});

