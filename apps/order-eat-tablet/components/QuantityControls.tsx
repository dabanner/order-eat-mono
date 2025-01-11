import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface QuantityControlsProps {
  itemId: string;
  quantity: number;
  onQuantityChange: (itemId: string, currentQuantity: number, increment: number) => void;
  isPaid: boolean;
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
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  paidQuantityControls: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 6,
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 24,
    textAlign: 'center',
  },
  paidQuantityText: {
    color: '#4CAF50',
  },
});

