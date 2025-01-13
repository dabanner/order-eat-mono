import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { MenuItem as MenuItemType, Restaurant } from '@repo/store/src/restaurantStore';
import { FoodCategory } from '@repo/store/src/foodCaregoryStore';
import { MenuItemModal } from '@repo/ui/src/MenuItemModal';
import { MenuItem } from '@repo/ui/src/MenuItem'
import {isLoading} from "expo-font";
import MenuListSkeleton from "@repo/ui/src/MenuListSkeleton";

interface MenuListProps {
  menuItems: MenuItemType[];
  categories: FoodCategory[];
  selectedCategory: FoodCategory | null;
  onCategorySelect: (category: FoodCategory | null) => void;
  onItemClick: (itemId: string) => void;
  selectedItems?: (MenuItemType & { quantity: number })[];
  restaurant: Restaurant;
  showAddButton?: boolean;
}

export function MenuList({ 
  menuItems, 
  categories,
  selectedCategory, 
  onCategorySelect,
  onItemClick, 
  selectedItems = [], 
  restaurant,
  showAddButton = false 
}: MenuListProps) {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Loading timeout completed, setting isLoading to false');
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show skeleton while loading
  if (isLoading) {
    return <MenuListSkeleton />;
  }


  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory?.id === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => onCategorySelect(selectedCategory?.id === category.id ? null : category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory?.id === category.id && styles.categoryButtonTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.grid}>
        {menuItems.map((item) => {
          const selectedItem = selectedItems.find(si => si.id === item.id);
          return (
            <MenuItem
              key={item.id}
              item={item}
              onPress={() => setSelectedMenuItem(item)}
              onAddClick={() => onItemClick(item.id)}
              quantity={selectedItem?.quantity}
              showAddButton={showAddButton}
            />
          );
        })}
      </View>

      {selectedMenuItem && (
        <MenuItemModal
          isVisible={!!selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
          menuItem={selectedMenuItem}
          restaurant={restaurant}
          onAddToOrder={() => {
            onItemClick(selectedMenuItem.id);
            setSelectedMenuItem(null);
          }}
          quantity={selectedItems.find(item => item.id === selectedMenuItem.id)?.quantity || 0}
          showAddButton={showAddButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  categoryButtonActive: {
    backgroundColor: '#FF8C00',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});

