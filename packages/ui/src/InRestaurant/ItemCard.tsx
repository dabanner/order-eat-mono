import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MenuItem } from '@repo/store/src/restaurantStore';
import { QuantityControls } from './QuantityControls';

interface ItemCardProps {
  item: MenuItem & { quantity: number; paid: boolean; submitted: boolean; groupQuantity: number };
  onQuantityChange: (itemId: string, currentQuantity: number, increment: number) => void;
  onPaymentStatusChange: () => void;
  onSubmitStatusChange: () => void;
  onAddNewItem: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onQuantityChange,
  onPaymentStatusChange,
  onSubmitStatusChange,
  onAddNewItem
}) => (
  <View style={[
    styles.itemContainer, 
    item.submitted && styles.submittedItemContainer,
    item.paid && styles.paidItemContainer
  ]}>
    <Image
      source={item.images[0]}
      style={styles.itemImage}
    />
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.priceQuantityContainer}>
        <View>
          <Text style={styles.itemPrice}>${(item.price * item.groupQuantity).toFixed(2)}</Text>
          <Text style={[
            styles.itemStatus,
            item.paid ? styles.paidStatus : (item.submitted ? styles.submittedStatus : styles.unpaidStatus)
          ]}>
            {item.paid ? 'Paid' : (item.submitted ? 'Submitted' : 'Unpaid')}
          </Text>
        </View>
        <View style={styles.quantityActionContainer}>
          <Text style={styles.quantityText}>x{item.groupQuantity}</Text>
          {!item.submitted && !item.paid && (
            <QuantityControls
              itemId={item.id}
              quantity={item.quantity}
              onQuantityChange={onQuantityChange}
              isPaid={item.paid}
              isSubmitted={item.submitted}
            />
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
  submittedItemContainer: {
    backgroundColor: '#fff9c4',
    borderColor: '#FFC107',
    borderWidth: 1,
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
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
  },
  itemStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  paidStatus: {
    color: '#4CAF50',
  },
  submittedStatus: {
    color: '#FFC107',
  },
  unpaidStatus: {
    color: '#FF9800',
  },
  quantityActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginRight: 8,
  },
});

