import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface QuantityControlsProps {
  itemId: string;
  quantity: number;
  onQuantityChange: (itemId: string, currentQuantity: number, increment: number) => void;
  isPaid?: boolean;
}

export const QuantityControls: React.FC<QuantityControlsProps> = ({ itemId, quantity, onQuantityChange, isPaid }) => (
  <View style={[styles.quantityControls, isPaid && styles.paidQuantityControls]}>
    {!isPaid && (
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={() => onQuantityChange(itemId, quantity, -1)}
      >
        <Text style={styles.quantityButtonText}>-</Text>
      </TouchableOpacity>
    )}
    <Text style={[styles.quantityText, isPaid && styles.paidQuantityText]}>{quantity}</Text>
    {!isPaid && (
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={() => onQuantityChange(itemId, quantity, 1)}
      >
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 8,
  },
  paidQuantityControls: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paidQuantityText: {
    color: '#4CAF50',
  },
});

