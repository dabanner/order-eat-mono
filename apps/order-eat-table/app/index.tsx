import React, { useState, useCallback } from "react"
import { View, StyleSheet, Platform, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler"
import { useCommandStore } from "@repo/store/src/commandStore"
import { useRestaurantStore } from "@repo/store/src/restaurantStore"
import CommandSection from "@repo/ui/src/InRestaurant/CommandSection"
import Categories from "@repo/ui/src/categories"
import MenuGrid from "@repo/ui/src/InRestaurant/MenuGrid"
import CustomSwitch from "react-native-custom-switch-new"
import { MultiTouch } from "@/components/Multitouch"

interface TableSection {
  id: number
  command: any
  kidMode: boolean
  orientation: "up" | "down"
  isActive: boolean
}

export default function Index() {
  const { restaurants } = useRestaurantStore()
  const restaurant = restaurants[0]
  const { setCurrentCommand, addCommand } = useCommandStore()

  const [tableSections, setTableSections] = useState<TableSection[]>([
    { id: 1, command: null, kidMode: false, orientation: "down", isActive: false },
    { id: 2, command: null, kidMode: false, orientation: "down", isActive: false },
    { id: 3, command: null, kidMode: false, orientation: "up", isActive: false },
    { id: 4, command: null, kidMode: false, orientation: "up", isActive: false },
  ])

  React.useEffect(() => {
    if (restaurant) {
      tableSections.forEach((section) => {
        if (!section.command) {
          const newCommand = {
            id: `section-${section.id}`,
            restaurant,
            userId: `user-section-${section.id}`,
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

          const newCommandId = addCommand(newCommand)
          setTableSections((prev) =>
            prev.map((s) => (s.id === section.id ? { ...s, command: { ...newCommand, id: newCommandId } } : s)),
          )
        }
      })
    }
  }, [restaurant, addCommand, tableSections])

  const handleKidModeToggle = useCallback((sectionId: number, value: boolean) => {
    setTableSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, kidMode: value } : section)),
    )
  }, [])

  const handleTouchStart = useCallback(
    (sectionId: number) => {
      setTableSections((prev) =>
        prev.map((section) => ({
          ...section,
          isActive: section.id === sectionId,
        })),
      )
      const section = tableSections.find((s) => s.id === sectionId)
      if (section) {
        setCurrentCommand(section.command)
      }
    },
    [tableSections, setCurrentCommand],
  )

  const handleTouchEnd = useCallback((sectionId: number) => {
    setTableSections((prev) =>
      prev.map((section) => ({
        ...section,
        isActive: false,
      })),
    )
  }, [])

  const renderSection = useCallback(
    (section: TableSection) => (
      <View key={section.id} style={[styles.section, section.isActive && styles.activeSection]}>
        <View style={[styles.sectionContent, section.orientation === "down" && styles.sectionContentRotated]}>
          <View style={styles.menuSection}>
            <View style={styles.categoriesContainer}>
              <Categories isKidsMode={section.kidMode} />
            </View>
            <View style={styles.menuGridWrapper}>
              <MultiTouch
                style={styles.menuGridContainer}
                sectionId={section.id}
                onTouchStart={() => handleTouchStart(section.id)}
              >
                <MenuGrid
                  menuItems={restaurant?.menuItems || []}
                  isKidsMode={section.kidMode}
                  restaurant={restaurant}
                />
              </MultiTouch>
            </View>
          </View>
          {!section.kidMode && (
            <View style={styles.commandSection}>
              <CommandSection />
            </View>
          )}
          <View style={[styles.kidsModeToggle, section.orientation === "down" && styles.kidsModeToggleRotated]}>
            <View style={styles.sectionIdentifier}>
              <Text style={styles.sectionText}>Section {section.id}</Text>
            </View>
            <CustomSwitch
              buttonColor={"#FFFFFF"}
              switchBackgroundColor={"#BB4430"}
              onSwitchBackgroundColor={"#7EBDC2"}
              switchLeftText={"‍👶"}
              switchRightText={"👨"}
              onSwitch={() => handleKidModeToggle(section.id, true)}
              onSwitchReverse={() => handleKidModeToggle(section.id, false)}
              startOnLeft={!section.kidMode}
            />
          </View>
        </View>
      </View>
    ),
    [restaurant, handleKidModeToggle, handleTouchStart],
  )

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.rowTop}>{tableSections.slice(0, 2).map(renderSection)}</View>
          <View style={styles.rowBot}>{tableSections.slice(2, 4).map(renderSection)}</View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FF8C00",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 16,
  },
  rowTop: {
    flex: 1,
    flexDirection: "row",
    gap: 28,
    marginBottom: 28,
  },
  rowBot: {
    flex: 1,
    flexDirection: "row",
    gap: 28,
    marginTop: 28,
  },
  section: {
    flex: 1,
    borderWidth: 3,
    borderColor: "#FF8C00",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    marginLeft: 28,
    marginRight: 28,
  },
  activeSection: {
    borderColor: "#4CAF50",
    borderWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0 0 12px rgba(76, 175, 80, 0.3)",
      },
    }),
  },
  sectionContent: {
    flex: 1,
    flexDirection: "row",
  },
  sectionContentRotated: {
    transform: [{ rotate: "180deg" }],
  },
  menuSection: {
    flex: 1,
    flexDirection: "column",
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuGridWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  menuGridContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  commandSection: {
    width: "30%",
    borderLeftWidth: 1,
    borderLeftColor: "#e0e0e0",
    backgroundColor: "#fff",
    ...Platform.select({
      web: {
        boxShadow: "-4px 0 12px rgba(0, 0, 0, 0.05)",
      },
      default: {
        elevation: 4,
      },
    }),
  },
  kidsModeToggle: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  kidsModeToggleRotated: {
    transform: [{ rotate: "180deg" }],
  },
  sectionIdentifier: {
    marginRight: 8,
    backgroundColor: "#FF8C00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  sectionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
})

