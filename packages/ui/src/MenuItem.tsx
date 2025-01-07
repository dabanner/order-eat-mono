import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { MenuItem as MenuItemType } from '@repo/store/src/restaurantStore';
import { MaterialIcons } from '@expo/vector-icons';

interface MenuItemProps {
  item: MenuItemType;
  onPress: () => void;
  onAddClick: () => void;
  showAddButton?: boolean;
  isKidsMode?: boolean;
  quantity: number;
}

export function MenuItem({ 
  item, 
  onPress, 
  onAddClick,
  showAddButton = false, 
  isKidsMode = false,
  quantity
}: MenuItemProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.menuItem,
        isKidsMode && styles.kidsMenuItem
      ]} 
      onPress={onPress}
    >
      <Image
          source={{ uri: item.images[0] }}
          style={[
            styles.itemImage,
            isKidsMode && styles.kidsItemImage
          ]}
      />
      <View style={[
        styles.itemInfo,
        isKidsMode && styles.kidsItemInfo
      ]}>
        <Text style={[
          styles.itemName,
          isKidsMode && styles.kidsItemName
        ]}>
          {isKidsMode ? `${item.name} 🌟` : item.name}
        </Text>
        <Text style={[
          styles.itemDescription,
          isKidsMode && styles.kidsItemDescription
        ]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[
            styles.itemPrice,
            isKidsMode && styles.kidsItemPrice
          ]}>
            ${item.price.toFixed(2)}
          </Text>
          {showAddButton && (
            <View style={styles.quantityContainer}>
              {quantity > 0 && (
                <View style={[
                  styles.quantityBadge,
                  isKidsMode && styles.kidsQuantityBadge
                ]}>
                  <Text style={[
                    styles.quantityText,
                    isKidsMode && styles.kidsQuantityText
                  ]}>{quantity}</Text>
                </View>
              )}
              <TouchableOpacity
                style={[
                  styles.addButton,
                  isKidsMode && styles.kidsAddButton
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  onAddClick();
                }}
              >
                <MaterialIcons 
                  name={isKidsMode ? "add-circle" : "add"} 
                  size={24} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
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
  kidsMenuItem: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#ffa26d',
    backgroundColor: '#ffeee3',
    transform: [{ scale: 1.02 }],
    ...Platform.select({
      ios: {
        shadowColor: '#ff7622',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 4px 15px rgba(255, 118, 34, 0.2)',
      },
    }),
  },
  itemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  kidsItemImage: {
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 4,
    borderColor: '#fff',
  },
  itemInfo: {
    padding: 12,
  },
  kidsItemInfo: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  kidsItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff7622',
    textAlign: 'center',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  kidsItemDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8C00',
  },
  kidsItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBadge: {
    backgroundColor: '#FF8C00',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  kidsQuantityBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  kidsQuantityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kidsAddButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 40,
    height: 40,
    transform: [{ scale: 1.1 }],
  },
});

