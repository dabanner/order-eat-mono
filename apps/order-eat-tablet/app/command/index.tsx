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
} from 'react-native';
import { useRouter } from 'expo-router';
import { MenuItem } from '@repo/store/src/restaurantStore';
import { useCommandStore, WaitstaffRequest } from '@repo/store/src/commandStore';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

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

const QuantityControls: React.FC<QuantityControlsProps> = ({ itemId, quantity, onQuantityChange, isPaid }) => (
  <View style={styles.quantityControls}>
    {(!isPaid&&<TouchableOpacity
      style={styles.quantityButton}
      onPress={() => onQuantityChange(itemId, quantity, -1)}
    >
      <Text style={styles.quantityButtonText}>-</Text>
    </TouchableOpacity>
    )}

    <Text style={styles.quantityText}>{quantity}</Text>
    
    {(!isPaid&&<TouchableOpacity
      style={styles.quantityButton}
      onPress={() => onQuantityChange(itemId, quantity, 1)}
    >
      <Text style={styles.quantityButtonText}>+</Text>
    </TouchableOpacity>
    )}
  </View>
);

const ItemCard: React.FC<ItemCardProps> = ({ item, onQuantityChange, onPaymentStatusChange, isPaid }) => (
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
        {!isPaid && (
          <QuantityControls
            itemId={item.id}
            quantity={item.quantity}
            onQuantityChange={onQuantityChange}
            isPaid={isPaid}
          />
        )}
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
);


const WaitstaffModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onAction: (type: WaitstaffRequest['type']) => void;
}> = ({ visible, onClose, onAction }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>How can we help?</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.checkoutButton]}
            onPress={() => {
              onAction('checkout');
              onClose();
            }}
          >
            <MaterialIcons name="payment" size={24} color="#fff" />
            <Text style={styles.modalButtonText}>Checkout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modalButton, styles.waterButton]}
            onPress={() => {
              onAction('water');
              onClose();
            }}
          >
            <MaterialCommunityIcons name="water" size={24} color="#fff" />
            <Text style={styles.modalButtonText}>Add Water</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modalButton, styles.otherButton]}
            onPress={() => {
              onAction('other');
              onClose();
            }}
          >
            <MaterialIcons name="more-horiz" size={24} color="#fff" />
            <Text style={styles.modalButtonText}>Others</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

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
    <View style={styles.container}>
      <FlatList
        data={currentCommand.menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Unpaid Items</Text>
            <Text style={styles.totalAmount}>
              Total: ${currentCommand.totalAmount.toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No unpaid items</Text>
        )}
      />

      {currentCommand.paidItems && currentCommand.paidItems.length > 0 && (
        <View style={styles.paidItemsContainer}>
          <Text style={styles.paidItemsTitle}>Paid Items</Text>
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
  <TouchableOpacity
    style={[styles.actionButton, styles.outlineButton]}
    onPress={() => setWaitstaffModalVisible(true)}
  >
    <Text style={styles.actionButtonText}>Call Waitstaff</Text>
  </TouchableOpacity>
</View>

      <WaitstaffModal
        visible={isWaitstaffModalVisible}
        onClose={() => setWaitstaffModalVisible(false)}
        onAction={addWaitstaffRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 18,
    color: '#FF9800',
    fontWeight: '600',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  paymentStatusButton: {
    padding: 4,
  },
  paidButton: {
    opacity: 0.7,
  },
  paidItemsContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  paidItemsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
    color: '#4CAF50',
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
  paidItemContainer: {
    backgroundColor: '#f9f9f9',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
});

