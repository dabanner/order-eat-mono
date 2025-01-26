import type React from "react"
import { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { useCommandStore } from "@repo/store/src/commandStore"
import { useRestaurantStore } from "@repo/store/src/restaurantStore"
import CommandSection from "@repo/ui/src/InRestaurant/CommandSection"

interface SectionCommandProps {
  sectionId: string
  mode: "left-top" | "left-bottom" | "right-top" | "right-bottom"
}

export const SectionCommand: React.FC<SectionCommandProps> = ({ sectionId, mode }) => {
  const { restaurants } = useRestaurantStore()
  const { addCommand, getCommandBySection } = useCommandStore()
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

  const command = getCommandBySection(sectionId)

  if (!command) {
    return <Text>Loading...</Text>
  }

  return (
    <View style={styles.container}>
      <CommandSection sectionId={sectionId} mode={mode} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

