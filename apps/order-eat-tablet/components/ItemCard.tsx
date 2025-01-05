import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MenuItem } from '@repo/store/src/restaurantStore';
import { QuantityControls } from './QuantityControls';

interface ItemCardProps {
  item: MenuItem & { quantity: number };
  onQuantityChange: (itemId: string, currentQuantity: number, increment: number) => void;
  onPaymentStatusChange?: () => void;
  isPaid?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onQuantityChange, onPaymentStatusChange, isPaid }) => (
  <View style={[styles.itemContainer, isPaid && styles.paidItemContainer]}>
    <Image
      source={{ uri: item.images[0] }}
      style={styles.itemImage}
    />
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.priceQuantityContainer}>
        <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
        <View style={styles.quantityActionContainer}>
          <QuantityControls
            itemId={item.id}
            quantity={item.quantity}
            onQuantityChange={onQuantityChange}
            isPaid={isPaid}
          />
          {isPaid && onPaymentStatusChange && (
            <TouchableOpacity
              style={[styles.paymentStatusButton, isPaid && styles.paidButton]}
              onPress={onPaymentStatusChange}
            >
              <MaterialIcons 
                name="check-circle" 
                size={24} 
                color="#4CAF50" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paidItemContainer: {
    backgroundColor: '#f9f9f9',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
  },
  quantityActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentStatusButton: {
    padding: 4,
    marginLeft: 8,
  },
  paidButton: {
    opacity: 0.7,
  },
});
