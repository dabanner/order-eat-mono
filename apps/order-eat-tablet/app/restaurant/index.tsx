import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import { useCommandStore, Command } from '@repo/store/src/commandStore';
import Categories from '@repo/ui/src/categories';
import MenuGrid from '@/components/MenuGrid';
import { useKidsMode } from '../_layout';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const { restaurants } = useRestaurantStore();
  const { currentCommand, setCurrentCommand, addCommand } = useCommandStore();
  const { isKidsMode, setIsKidsMode } = useKidsMode();
  // Find the restaurant with the given id
  const restaurant = restaurants.find(restaurant => restaurant.id === id) || restaurants[0];

  React.useEffect(() => {
    if (!currentCommand && restaurant) {
      const newCommand: Command = {
        id: '', // This will be set by addCommand
        restaurant,
        userId: 'user123', // Replace with actual user ID
        reservationDetails: {
          date: new Date().toISOString(),
          time: new Date().toTimeString(),
          numberOfPersons: 1,
          type: 'dinein',
          wantToPreOrder: true,
        },
        menuItems: [],
        totalAmount: 0,
        status: 'pending',
        type: 'dinein',
      };

      const newCommandId = addCommand(newCommand);
      setCurrentCommand({ ...newCommand, id: newCommandId });
    }
  }, [currentCommand, restaurant, addCommand, setCurrentCommand]);

  React.useEffect(() => {
    // This will re-render the components when kids mode changes
    console.log('Kids mode changed:', isKidsMode);
  }, [isKidsMode]);

  if (!restaurant) {
    return <Text>Restaurant not found</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        <View style={styles.content}>
          <Categories isKidsMode={isKidsMode} />
          <MenuGrid 
            menuItems={restaurant?.menuItems || []} 
            isKidsMode={isKidsMode} 
            restaurant={restaurant}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    maxWidth: '100%',
    width: '100%',
    marginHorizontal: 'auto',
  },
});

