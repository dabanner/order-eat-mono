import React, { useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native"
import { useCommandStore } from "@repo/store/src/commandStore"
import { ItemCard } from "./ItemCard"
import { GenericModal } from "./GenericModal"
import { MaterialIcons } from "@expo/vector-icons"

interface CommandSectionProps {
  sectionId: string
  mode: "left-top" | "left-bottom" | "right-top" | "right-bottom"
}

export default function CommandSection({ sectionId, mode }: CommandSectionProps) {
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false)
  const {
    getCommandBySection,
    updateMenuItemQuantity,
    removeMenuItem,
    toggleItemPaidStatus,
    toggleItemSubmittedStatus,
    addMenuItem,
    submitUnsubmittedItems,
  } = useCommandStore()

  const command = getCommandBySection(sectionId)

  useEffect(() => {
    if (!command) {
      console.error(`No command found for section ${sectionId}`)
    }
  }, [command, sectionId])

  if (!command) {
    return <Text>Loading...</Text>
  }

  const handleQuantityChange = (itemId: string, currentQuantity: number, increment: number): void => {
    const newQuantity = currentQuantity + increment
    if (newQuantity <= 0) {
      removeMenuItem(sectionId, itemId)
    } else {
      updateMenuItemQuantity(sectionId, itemId, newQuantity)
    }
  }

  const handleSubmitOrder = () => {
    if (command.menuItems.length === 0) {
      Alert.alert("Empty Order", "Please add some items to your order before submitting.", [{ text: "OK" }])
      return
    }

    submitUnsubmittedItems(sectionId)
    setSuccessModalVisible(true)
  }

  const groupAndSortItems = (items: any[]) => {
    const groupedItems = items.reduce((acc, item) => {
      const key = `${item.id}-${item.submitted ? "submitted" : "unsubmitted"}-${item.paid ? "paid" : "unpaid"}`
      if (!acc[key]) {
        acc[key] = { ...item, groupQuantity: item.quantity }
      } else {
        acc[key].groupQuantity += item.quantity
      }
      return acc
    }, {})

    return Object.values(groupedItems).sort((a: any, b: any) => {
      if (a.submitted === b.submitted) {
        if (a.paid === b.paid) return 0
        return a.paid ? 1 : -1
      }
      return a.submitted ? 1 : -1
    })
  }

  const hasUnsubmittedItems = () => {
    return command.menuItems.some((item) => !item.submitted)
  }

  const calculateOrderSummary = () => {
    const total = command.totalAmount
    const paid = command.menuItems.reduce((sum, item) => sum + (item.paid ? item.price * item.quantity : 0), 0)
    return {
      totalAmount: total,
      paidAmount: paid,
      remainingAmount: total - paid,
    }
  }

  const groupedAndSortedItems = groupAndSortItems(command.menuItems)
  const { totalAmount, paidAmount, remainingAmount } = calculateOrderSummary()

  if (command.menuItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <MaterialIcons name="restaurant-menu" size={64} color="#4CAF50" />
        </View>
        <Text style={styles.emptyTitle}>Let's start your feast!</Text>
        <Text style={styles.emptyText}>Explore our menu and add some delicious dishes to your order.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
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

      <ScrollView style={styles.itemList}>
        {groupedAndSortedItems.map((item: any, index: number) => (
          <ItemCard
            key={`${item.id}-${item.submitted}-${item.paid}-${index}`}
            item={item}
            onQuantityChange={(itemId, currentQuantity, increment) =>
              handleQuantityChange(itemId, currentQuantity, increment)
            }
            onPaymentStatusChange={() => toggleItemPaidStatus(sectionId, item.id)}
            onSubmitStatusChange={() => toggleItemSubmittedStatus(sectionId, item.id)}
            onAddNewItem={() => addMenuItem(sectionId, item)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {hasUnsubmittedItems() ? (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitOrder}>
            <MaterialIcons name="send" size={24} color="#fff" />
            <Text style={styles.submitButtonText}>Submit Order</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.preparingContainer}>
            <MaterialIcons name="restaurant" size={24} color="#4CAF50" />
            <Text style={styles.preparingText}>Your order is being prepared...</Text>
          </View>
        )}
      </View>

      <GenericModal
        visible={isSuccessModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        image="https://cdn.prod.website-files.com/6364b6fd26e298b11fb9391f/6364b6fd26e298312bb93c5a_63158fe13a6379546cdc4dcb_DrawKit0026_Cooking_%2526_Food_Banner.png"
        title="Order Received!"
        description="Our chefs are firing up the kitchen! We'll serve you when everything's ready. Feel free to add more items if you'd like!"
        buttonText="Got it!"
        autoCloseTime={4}
        mode={mode}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  orderSummary: {
    backgroundColor: "#f0f8ff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  remainingValue: {
    color: "#FF9800",
  },
  itemList: {
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  preparingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  preparingText: {
    marginLeft: 8,
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  emptyIconContainer: {
    backgroundColor: "#E8F5E9",
    borderRadius: 50,
    padding: 16,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24,
  },
})

