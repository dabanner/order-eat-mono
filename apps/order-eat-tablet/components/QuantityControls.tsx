import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface QuantityControlsProps {
  itemId: string;
  quantity: number;
  onQuantityChange: (itemId: string, currentQuantity: number, increment: number) => void;
  isPaid: boolean;
  isSubmitted: boolean;
}

export const QuantityControls: React.FC<QuantityControlsProps> = ({ 
  itemId, 
  quantity, 
  onQuantityChange, 
  isPaid,
  isSubmitted,
}) => {
  return (
    <View style={styles.quantityControls}>
      <TouchableOpacity
        style={[styles.quantityButton, (isPaid || isSubmitted) && styles.disabledButton]}
        onPress={() => onQuantityChange(itemId, quantity, -1)}
        disabled={isPaid || isSubmitted}
      >
        <Text style={styles.quantityButtonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={() => onQuantityChange(itemId, quantity, 1)}
      >
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
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
  disabledButton: {
    backgroundColor: '#ccc',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
    textAlign: 'center',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 24,
    textAlign: 'center',
  },
});

