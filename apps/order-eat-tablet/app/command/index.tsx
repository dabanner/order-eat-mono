import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ListRenderItem,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MenuItem } from '@repo/store/src/restaurantStore';
import { useCommandStore, WaitstaffRequest } from '@repo/store/src/commandStore';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { QuantityControls } from '@/components/QuantityControls';
import { ItemCard } from '@/components/ItemCard';
import { WaitstaffModal } from '@/components/WaitstaffModal';

type OrderMenuItem = MenuItem & {
  quantity: number;
};

interface QuantityControlsProps {
  itemId: string;
  quantity: number;
  onQuantityChange: (itemId: string, currentQuantity: number, increment: number) => void;
  isPaid?: boolean;
}

interface ItemCardProps {
  item: OrderMenuItem;
  onQuantityChange: (itemId: string, currentQuantity: number, increment: number) => void;
  onPaymentStatusChange?: () => void;
  isPaid?: boolean;
}


export default function CommandItemsScreen() {
  const [isWaitstaffModalVisible, setWaitstaffModalVisible] = useState(false);
  const {
    currentCommand,
    updateMenuItemQuantity,
    removeMenuItem,
    moveItemToPaid,
    moveItemToUnpaid,
    addWaitstaffRequest,
  } = useCommandStore();
  const router = useRouter();

  const handleQuantityChange = (itemId: string, currentQuantity: number, increment: number): void => {
    const newQuantity = currentQuantity + increment;
    if (newQuantity <= 0) {
      removeMenuItem(itemId);
    } else {
      updateMenuItemQuantity(itemId, newQuantity);
    }
  };

  const handleSubmitOrder = () => {
    // Handle order submission
    console.log('Order submitted');
    router.back();
  };

  const renderItem: ListRenderItem<OrderMenuItem> = ({ item }) => (
    <ItemCard
      item={item}
      onQuantityChange={handleQuantityChange}
      onPaymentStatusChange={() => moveItemToPaid(item.id)}
      isPaid={false}
    />
  );

  const renderPaidItem: ListRenderItem<OrderMenuItem> = ({ item }) => (
    <ItemCard
      item={item}
      onQuantityChange={handleQuantityChange}
      onPaymentStatusChange={() => moveItemToUnpaid(item.id)}
      isPaid={true}
    />
  );

  if (!currentCommand) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No active command</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Order</Text>
        <TouchableOpacity
          style={styles.callWaitstaffButton}
          onPress={() => setWaitstaffModalVisible(true)}
        >
          <Text style={styles.callWaitstaffButtonText}>Call Waitstaff</Text>
        </TouchableOpacity>
      </View>
      <View>
        {currentCommand.menuItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onQuantityChange={handleQuantityChange}
            onPaymentStatusChange={() => moveItemToPaid(item.id)}
            isPaid={false}
          />
        ))}
      </View>

      {currentCommand.paidItems && currentCommand.paidItems.length > 0 && (
        <View style={styles.paidItemsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Paid Items</Text>
          </View>
          <FlatList
            data={currentCommand.paidItems}
            renderItem={renderPaidItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.defaultButton]}
          onPress={handleSubmitOrder}
        >
          <Text style={styles.actionButtonText}>Submit Order</Text>
        </TouchableOpacity>
      </View>

      <WaitstaffModal
        visible={isWaitstaffModalVisible}
        onClose={() => setWaitstaffModalVisible(false)}
        onAction={addWaitstaffRequest}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    color: '#FF9800',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  paymentStatusButton: {
    padding: 4,
    marginLeft: 8,
  },
  paidButton: {
    opacity: 0.7,
  },
  paidItemsContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  modalButtons: {
    gap: 16,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
  },
  waterButton: {
    backgroundColor: '#2196F3',
  },
  otherButton: {
    backgroundColor: '#FF9800',
  },
  closeButton: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  defaultButton: {
    backgroundColor: '#4CAF50',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#FF9800',
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#FF9800',
  },
  callWaitstaffButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  callWaitstaffButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

