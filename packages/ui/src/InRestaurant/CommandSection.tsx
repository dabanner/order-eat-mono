import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useCommandStore } from '@repo/store/src/commandStore';
import { ItemCard } from './ItemCard';
import { WaitstaffModal } from './WaitstaffModal';
import { GenericModal } from '@repo/ui/src/InRestaurant/GenericModal';
import { MaterialIcons } from '@expo/vector-icons';

export default function CommandSection() {
  const [isWaitstaffModalVisible, setWaitstaffModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const {
    currentCommand,
    updateMenuItemQuantity,
    removeMenuItem,
    toggleItemPaidStatus,
    toggleItemSubmittedStatus,
    addWaitstaffRequest,
    confirmCommand,
    addMenuItem,
    submitUnsubmittedItems,
  } = useCommandStore();

  const handleQuantityChange = (itemId: string, currentQuantity: number, increment: number): void => {
    const newQuantity = currentQuantity + increment;
    if (newQuantity <= 0) {
      removeMenuItem(itemId);
    } else {
      updateMenuItemQuantity(itemId, newQuantity);
    }
  };

  const handleSubmitOrder = () => {
    if (!currentCommand) return;
    
    if (currentCommand.menuItems.length === 0) {
      Alert.alert(
        "Empty Order",
        "Please add some items to your order before submitting.",
        [{ text: "OK" }]
      );
      return;
    }

    submitUnsubmittedItems();
    setSuccessModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <ItemCard
      item={item}
      onQuantityChange={handleQuantityChange}
      onPaymentStatusChange={() => toggleItemPaidStatus(item.id)}
      onSubmitStatusChange={() => toggleItemSubmittedStatus(item.id)}
      onAddNewItem={() => addMenuItem(item)}
    />
  );

  const groupAndSortItems = (items: any[]) => {
    const groupedItems = items.reduce((acc, item) => {
      const key = `${item.id}-${item.submitted ? 'submitted' : 'unsubmitted'}-${item.paid ? 'paid' : 'unpaid'}`;
      if (!acc[key]) {
        acc[key] = { ...item, groupQuantity: item.quantity };
      } else {
        acc[key].groupQuantity += item.quantity;
      }
      return acc;
    }, {});

    return Object.values(groupedItems).sort((a, b) => {
      if (a.submitted === b.submitted) {
        if (a.paid === b.paid) return 0;
        return a.paid ? 1 : -1;
      }
      return a.submitted ? 1 : -1;
    });
  };

  const hasUnsubmittedItems = () => {
    return currentCommand?.menuItems.some(item => !item.submitted) ?? false;
  };

  const calculateOrderSummary = () => {
    if (!currentCommand) return { totalAmount: 0, paidAmount: 0, remainingAmount: 0 };

    const total = currentCommand.totalAmount;
    const paid = currentCommand.menuItems.reduce((sum, item) => sum + (item.paid ? item.price * item.quantity : 0), 0);
    return {
      totalAmount: total,
      paidAmount: paid,
      remainingAmount: total - paid
    };
  };

  if (!currentCommand || currentCommand.menuItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <MaterialIcons name="restaurant-menu" size={64} color="#4CAF50" />
        </View>
        <Text style={styles.emptyTitle}>Let's start your feast!</Text>
        <Text style={styles.emptyText}>
          Explore our menu and add some delicious dishes to your order.
        </Text>
      </View>
    );
  }

  const groupedAndSortedItems = groupAndSortItems(currentCommand.menuItems);
  const { totalAmount, paidAmount, remainingAmount } = calculateOrderSummary();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="receipt" size={28} color="#4CAF50" />
          <Text style={styles.headerTitle}>Your Order</Text>
        </View>
        <TouchableOpacity
          style={styles.callWaitstaffButton}
          onPress={() => setWaitstaffModalVisible(true)}
        >
          <MaterialIcons name="room-service" size={20} color="#fff" />
          <Text style={styles.callWaitstaffButtonText}>Call Waitstaff</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.orderSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total:</Text>
          <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
        </View>
        {paidAmount > 0 && (
          <>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Paid:</Text>
              <Text style={styles.summaryValue}>${paidAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Remaining:</Text>
              <Text style={[styles.summaryValue, styles.remainingValue]}>${remainingAmount.toFixed(2)}</Text>
            </View>
          </>
        )}
      </View>
      <FlatList
        data={groupedAndSortedItems}
        renderItem={renderItem}
        keyExtractor={(item: any, index) => `${item.id}-${item.submitted}-${item.paid}-${index}`}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        {hasUnsubmittedItems() ? (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitOrder}
          >
            <MaterialIcons name="send" size={24} color="#fff" />
            <Text style={styles.submitButtonText}>Submit Order</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.preparingContainer}>
            <MaterialIcons name="restaurant" size={24} color="#4CAF50" />
            <Text style={styles.preparingText}>
              Your order is being prepared...
            </Text>
          </View>
        )}
      </View>

      <WaitstaffModal
        visible={isWaitstaffModalVisible}
        onClose={() => setWaitstaffModalVisible(false)}
        onAction={addWaitstaffRequest}
      />

      <GenericModal
        visible={isSuccessModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        image="https://cdn.prod.website-files.com/6364b6fd26e298b11fb9391f/6364b6fd26e298312bb93c5a_63158fe13a6379546cdc4dcb_DrawKit0026_Cooking_%2526_Food_Banner.png"
        title="Order Received!"
        description="Our chefs are firing up the kitchen! We'll serve you when everything's ready. Feel free to add more items if you'd like!"
        buttonText="Got it!"
        autoCloseTime={4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  orderSummary: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  remainingValue: {
    color: '#FF9800',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  emptyIconContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 50,
    padding: 16,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  callWaitstaffButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callWaitstaffButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  preparingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preparingText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
  },
});

