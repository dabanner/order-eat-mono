import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useRestaurantStore } from '@repo/store/dist/restaurantStore';
import { useCommandStore, Command } from '@repo/store/dist/commandStore';
import Categories from '@repo/ui/src/categories';
import MenuGrid from '@/components/MenuGrid';
import { useThemeStore } from '@/components/theme';
import CommandSection from '@/components/CommandSection';

interface TabletMenuProps {
  restaurantId: string;
}

export default function TabletMenu({ restaurantId }: TabletMenuProps) {
  const kidMode = useThemeStore((state) => state.kidMode);
  const { restaurants } = useRestaurantStore();
  const { currentCommand, setCurrentCommand, addCommand } = useCommandStore();
  
  const restaurant = restaurants.find(restaurant => restaurant.id === restaurantId) || restaurants[0];

  React.useEffect(() => {
    if (!currentCommand && restaurant) {
      const newCommand: Command = {
          id: '',
          restaurant,
          userId: 'user123',
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
          waitstaffRequests: []
      };

      const newCommandId = addCommand(newCommand);
      setCurrentCommand({ ...newCommand, id: newCommandId });
    }
  }, [currentCommand, restaurant, addCommand, setCurrentCommand]);

  if (!restaurant) {
    return <Text>Restaurant not found</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.menuSection}>
          <ScrollView>
            <Categories isKidsMode={kidMode} />
            <MenuGrid 
              menuItems={restaurant?.menuItems || []} 
              isKidsMode={kidMode} 
              restaurant={restaurant}
            />
          </ScrollView>
        </View>
        <View style={styles.commandSection}>
          <CommandSection />
        </View>
      </View>
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
    flexDirection: 'row',
  },
  menuSection: {
    flex: 3,
    paddingLeft: 20,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  commandSection: {
    flex: 1,
    maxWidth: 400, 
  },
});
