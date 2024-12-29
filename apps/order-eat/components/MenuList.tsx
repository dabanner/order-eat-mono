import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import { MenuItem, Restaurant } from '@repo/store/src/restaurantStore';
import { FoodCategory } from '@repo/store/src/foodCaregoryStore';
import { MaterialIcons } from '@expo/vector-icons';
import { MenuItemModal } from './MenuItemModal';

interface MenuListProps {
  menuItems: MenuItem[];
  categories: FoodCategory[];
  selectedCategory: FoodCategory | null;
  onCategorySelect: (category: FoodCategory | null) => void;
  onItemClick: (itemId: string) => void;
  selectedItems?: (MenuItem & { quantity: number })[];
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
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

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
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => setSelectedMenuItem(item)}
            >
              <Image
                source={{ uri: item.images[0] }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  {showAddButton && (
                    <View style={styles.quantityContainer}>
                      {selectedItem && (
                        <View style={styles.quantityBadge}>
                          <Text style={styles.quantityText}>{selectedItem.quantity}</Text>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          onItemClick(item.id);
                        }}
                      >
                        <MaterialIcons name="add" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
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
    ...Platform.select({
      web: {
        display: 'grid' as any,
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16,
      },
      default: {
        flexDirection: 'column' as 'column',
      },
    }),
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Platform.OS === 'web' ? 0 : 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  itemInfo: {
    padding: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C00',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBadge: {
    backgroundColor: '#FF8C00',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  quantityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

