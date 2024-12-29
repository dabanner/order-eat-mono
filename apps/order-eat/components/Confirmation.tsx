import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Restaurant } from '@repo/store/src/restaurantStore';
import { Command } from '@repo/store/src/commandStore';
import { RestaurantHeader } from './RestaurantHeader';
import { MaterialIcons } from '@expo/vector-icons';

interface ConfirmationProps {
  restaurant: Restaurant;
  command: Command;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ restaurant, command }) => {
  // Log the entire command for debugging
  console.log('Reservation Command:', JSON.stringify(command, null, 2));

  return (
    <View style={styles.container}>
      <RestaurantHeader restaurant={restaurant} />
      
      <View style={styles.confirmationCard}>
        <View style={styles.headerSection}>
          <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
          <Text style={styles.title}>Reservation Confirmed!</Text>
          <Text style={styles.subtitle}>Thank you for your reservation</Text>
        </View>

        <View style={styles.qrSection}>
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrText}>QR Code</Text>
            <Text style={styles.qrSubtext}>Show this at the restaurant</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Reservation Details</Text>
          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={24} color="#666" />
            <Text style={styles.detailText}>Date: {command.reservationDetails.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="schedule" size={24} color="#666" />
            <Text style={styles.detailText}>Time: {command.reservationDetails.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="people" size={24} color="#666" />
            <Text style={styles.detailText}>
              {command.reservationDetails.numberOfPersons} {command.reservationDetails.numberOfPersons === 1 ? 'Person' : 'People'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="restaurant" size={24} color="#666" />
            <Text style={styles.detailText}>
              {command.type === 'dinein' ? 'Dine In' : 'Take Away'}
            </Text>
          </View>
        </View>

        {command.menuItems.length > 0 && (
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Pre-ordered Items</Text>
            {command.menuItems.map((item, index) => (
              <View key={index} style={styles.menuItem}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemQuantity}>x{item.quantity}</Text>
                </View>
                <Text style={styles.menuItemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total Amount</Text>
              <Text style={styles.totalAmount}>${command.totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        )}

        <View style={styles.noteSection}>
          <MaterialIcons name="info" size={24} color="#FF8C00" />
          <Text style={styles.noteText}>
            A confirmation email has been sent to your registered email address.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  confirmationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
  },
  qrText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  qrSubtext: {
    fontSize: 14,
    color: '#999',
  },
  detailsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  menuSection: {
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  menuItemQuantity: {
    fontSize: 16,
    color: '#666',
    marginRight: 16,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C00',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF8C00',
  },
  noteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    padding: 16,
    borderRadius: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
});

