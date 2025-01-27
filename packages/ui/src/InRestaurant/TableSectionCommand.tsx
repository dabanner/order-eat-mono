import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useCommandStore } from "@repo/store/src/commandStore"
import { useRestaurantStore } from "@repo/store/src/restaurantStore"
import { WaitstaffModal } from "./WaitstaffModal"
import CommandSection from "./CommandSection"
import { MaterialIcons } from "@expo/vector-icons"

interface TableSectionCommandProps {
  sectionId: string
  mode: "left-top" | "left-bottom" | "right-top" | "right-bottom"
}

export const TableSectionCommand: React.FC<TableSectionCommandProps> = ({ sectionId, mode }) => {
  const [isWaitstaffModalVisible, setWaitstaffModalVisible] = useState(false)
  const { restaurants } = useRestaurantStore()
  const { addCommand, getCommandBySection, addWaitstaffRequest } = useCommandStore()
  const restaurant = restaurants[0] // Assuming we're using the first restaurant

  useEffect(() => {
    const existingCommand = getCommandBySection(sectionId)
    if (!existingCommand && restaurant) {
      const newCommand = {
        restaurant,
        userId: `user-section-${sectionId}`,
        reservationDetails: {
          date: new Date().toISOString(),
          time: new Date().toTimeString(),
          numberOfPersons: 1,
          type: "dinein",
          wantToPreOrder: true,
        },
        menuItems: [],
        totalAmount: 0,
        status: "pending",
        type: "dinein",
        waitstaffRequests: [],
      }
      addCommand(sectionId, newCommand)
    }
  }, [sectionId, restaurant, addCommand, getCommandBySection])

  const handleWaitstaffRequest = (type: "checkout" | "water" | "other") => {
    addWaitstaffRequest(sectionId, type)
    setWaitstaffModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Order</Text>
        <TouchableOpacity style={styles.callWaitstaffButton} onPress={() => setWaitstaffModalVisible(true)}>
          <MaterialIcons name="room-service" size={20} color="#fff" />
          <Text style={styles.callWaitstaffButtonText}>Call Waitstaff</Text>
        </TouchableOpacity>
      </View>

      <CommandSection sectionId={sectionId} mode={mode} />

      <WaitstaffModal
        visible={isWaitstaffModalVisible}
        onClose={() => setWaitstaffModalVisible(false)}
        onAction={handleWaitstaffRequest}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 64,
    marginLeft: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  callWaitstaffButton: {
    backgroundColor: "#FF9800",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callWaitstaffButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
})

