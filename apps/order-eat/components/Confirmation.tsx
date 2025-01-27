import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { MenuItem, Restaurant } from '@repo/store/src/restaurantStore';
import { Command } from '@repo/store/src/commandStore';
import { RestaurantHeader } from './RestaurantHeader';
import { MaterialIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

interface ConfirmationProps {
  restaurant: Restaurant;
  command: Command;
}


interface TableOrderResponse {
  _id: string;
  tableNumber: number;
  customersCount: number;
  opened: string;
  lines: Array<{
    item: {
      _id: string;
      shortName: string;
    };
    howMany: number;
    sentForPreparation: boolean;
  }>;
  preparations: any[]; // Simplified for brevity
  billed: string;
}

type MenuItemWithQuantity = MenuItem & {
  quantity: number;
};

interface Table {
  _id: string;
  number: number;
  taken: boolean;
  tableOrderId: string;
}

export async function createOrder(
  menuItems: MenuItemWithQuantity[],
): Promise<string> {
  try {
    // Step 1: Get all tables
    const apiUrl = 'https://adaptation.chhilif.com/dining';
    const tablesResponse = await fetch(`${apiUrl}/tables`);
    const tables: Table[] = await tablesResponse.json();

    // Step 2: Find first available table
    const availableTable = tables.find(table => !table.taken);
    if (!availableTable) {
      throw new Error('No available tables found');
    }

    // Step 3: Create table order
    const orderResponse = await fetch(`${apiUrl}/tableOrders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableNumber: availableTable.number,
        customersCount: 1,
      }),
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create table order');
    }

    const tableOrder: TableOrderResponse = await orderResponse.json();
    const tableOrderId = tableOrder._id;

    // Step 4: Add menu items to the order
    for (const menuItem of menuItems) {
      if (menuItem.quantity > 0) { // Only send items with quantity > 0
        await fetch(`${apiUrl}/tableOrders/${tableOrderId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            menuItemId: menuItem.id,
            menuItemShortName: menuItem.shortName,
            howMany: menuItem.quantity,
          }),
        });
      }
    }

    return tableOrderId;
  } catch (error) {
    console.error('Order creation failed:', error);
    throw error;
  }
}

export const Confirmation: React.FC<ConfirmationProps> = ({ restaurant, command }) => {
  const [tableOrderId, setTableOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const qrCodeSize = Math.min(Dimensions.get('window').width * 0.3, 250);

  useEffect(() => {
    const createOrderAndSetId = async () => {
      try {
        const api_url = process.env.EXPO_PUBLIC_API_URL; // Make sure this is set in your environment
        const orderId = await createOrder(
          command.menuItems,
        );
        
        setTableOrderId(orderId);
      } catch (error) {
        console.error('Order creation failed:', error);
        setError('Failed to create order. Please try again.');
        Alert.alert(
          'Order Error',
          'Could not finalize the order. Please contact staff.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsLoading(false);
      }
    };

    createOrderAndSetId();
  }, []);

  const essentialData = {
    id: tableOrderId,
    tableOrderId: tableOrderId,
    userId: command.userId,
    restaurantId: command.restaurant.id,
    reservationTime: command.reservationDetails.time,
    totalAmount: command.totalAmount,
    status: command.status,
    type: command.type,
    itemCount: command.menuItems.length,
  };

  const finalData = JSON.stringify(essentialData);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Creating your order...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
            {tableOrderId && (
              <QRCode
                value={finalData} // Now includes tableOrderId
                size={qrCodeSize}
                backgroundColor="white"
                color="black"
              />
            )}
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
  errorText: {
  color: 'red',
  fontSize: 16,
  textAlign: 'center',
  marginTop: 20
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

