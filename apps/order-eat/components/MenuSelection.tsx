import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Restaurant, MenuItem } from '@repo/store/src/restaurantStore';
import { Command } from '@repo/store/src/commandStore';

interface MenuSelectionProps {
  restaurant: Restaurant;
  command: Command;
  updateReservationDetails: (details: Partial<Command>) => void;
}

export const MenuSelection: React.FC<MenuSelectionProps> = ({ restaurant, command, updateReservationDetails }) => {
  const handleAddItem = (item: MenuItem) => {
    const updatedMenuItems = [...command.menuItems];
    const existingItem = updatedMenuItems.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedMenuItems.push({ ...item, quantity: 1 });
    }
    updateReservationDetails({ menuItems: updatedMenuItems });
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedMenuItems = command.menuItems
      .map(item => item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item)
      .filter(item => item.quantity > 0);
    updateReservationDetails({ menuItems: updatedMenuItems });
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const quantity = command.menuItems.find(i => i.id === item.id)?.quantity || 0;
    return (
      <View style={styles.menuItem}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity onPress={() => handleAddItem(item)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Selection</Text>
      <FlatList
        data={restaurant.menuItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#FF8C00',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
});

