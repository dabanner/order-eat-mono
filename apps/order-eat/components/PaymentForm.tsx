import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Command } from '@repo/store/src/commandStore';

interface PaymentFormProps {
  command: Command;
  updateReservationDetails: (details: Partial<Command>) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ command, updateReservationDetails }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const handlePayment = () => {
    // In a real app, you would process the payment here
    updateReservationDetails({ status: 'confirmed' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="number-pad"
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="MM/YY"
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="number-pad"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Name on Card"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.totalAmount}>Total Amount: ${command.totalAmount.toFixed(2)}</Text>
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  payButton: {
    backgroundColor: '#FF8C00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

