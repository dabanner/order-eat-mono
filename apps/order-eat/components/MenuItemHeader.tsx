import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Restaurant, MenuItem } from '@/store/restaurantStore';

interface MenuItemHeaderProps {
  restaurant: Pick<Restaurant, 'name' | 'rating'>;
  menuItem: Pick<MenuItem, 'name' | 'description' | 'price' | 'sizes' | 'selectedSize'>;
  onSizeSelect: (size: string) => void;
}

export const MenuItemHeader: React.FC<MenuItemHeaderProps> = ({
  restaurant,
  menuItem,
  onSizeSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{menuItem.name}</Text>
      <View style={styles.restaurantInfo}>
        <MaterialIcons name="storefront" size={20} color="#FF8C00" style={styles.icon} />
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <MaterialIcons name="star" size={20} color="#FF8C00" style={styles.icon} />
        <Text style={styles.rating}>{restaurant.rating}</Text>
      </View>
      <Text style={styles.description}>{menuItem.description}</Text>
      {menuItem.sizes && menuItem.sizes.length > 0 && (
        <View style={styles.sizeSection}>
          <Text style={styles.sectionTitle}>SIZE:</Text>
          <View style={styles.sizes}>
            {menuItem.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeButton, size === menuItem.selectedSize && styles.selectedSize]}
                onPress={() => onSizeSelect(size)}
              >
                <Text style={[styles.sizeText, size === menuItem.selectedSize && styles.selectedSizeText]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <View style={styles.priceSection}><Text style={styles.sectionTitle}>PRICE: <Text style={styles.priceAmount}>${menuItem.price}</Text></Text></View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  icon: {
    marginRight: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 24,
  },
  sizeSection: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A0A5BA',
    textTransform: 'uppercase',
    marginRight: 16,
  },
  sizes: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  sizeButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#F8F9FB',
  },
  selectedSize: {
    backgroundColor: '#FF8C00',
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  selectedSizeText: {
    color: 'white',
  },
  priceAmount: {
    fontSize: 30,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  priceSection: {
    display: Platform.OS === 'web' ? 'flex' : 'none',
  }
});

