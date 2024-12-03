import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FoodCategory } from '@/store/foodCaregoryStore';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface MenuListProps {
  menuItems: MenuItem[];
  selectedCategory: FoodCategory | null;
}

export const MenuList: React.FC<MenuListProps> = ({ menuItems, selectedCategory }) => {
  return (
    <View style={styles.menuContainer}>
      <Text style={styles.menuTitle}>
        {selectedCategory ? `${selectedCategory.name} (${menuItems.length})` : 'All Items'}
      </Text>
      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <View key={item.id} style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.menuItemImage} />
            <Text style={styles.menuItemName}>{item.name}</Text>
            <Text style={styles.menuItemDescription}>{item.description}</Text>
            <View style={styles.menuItemFooter}>
              <Text style={styles.menuItemPrice}>${item.price}</Text>
              <TouchableOpacity style={styles.addButton}>
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    padding: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        justifyContent: 'space-evenly',
        gap: 25,
      },
    }),
  },
  menuItem: {
    width: Platform.OS === 'web' ? '30%' : '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    ...Platform.select({
      web: {
        marginBottom: 0,
      },
    }),
  },
  menuItemImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        height: 200,
      },
    }),
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 50,
  },
});

