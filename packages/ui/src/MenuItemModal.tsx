import React, { useState } from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, ScrollView } from "react-native"
import { MaterialIcons, FontAwesome6 } from "@expo/vector-icons"
import type { Restaurant, MenuItem } from "@repo/store/src/restaurantStore"
import { ImageGallery } from "./ImageGallery"
import { WebNutritionDisplay } from "../../../apps/order-eat/components/WebNutritionDisplay"

interface MenuItemModalProps {
  isVisible: boolean
  onClose: () => void
  menuItem: MenuItem
  restaurant: Restaurant
  onAddToOrder: () => void
  quantity: number
  showAddButton?: boolean
  isKidsMode?: boolean
  mode: "left-top" | "left-bottom" | "right-top" | "right-bottom" | "full"
}

export function MenuItemModal({
  isVisible,
  onClose,
  menuItem,
  restaurant,
  onAddToOrder,
  quantity,
  showAddButton = false,
  isKidsMode = false,
  mode = "left-top",
}: MenuItemModalProps) {
  const [selectedSize, setSelectedSize] = useState(menuItem.sizes?.[0] || null)

  const getModalPositionStyle = () => {
    const baseStyles = {
      width: "65%",
      height: "19%",
      position: "fixed" as const,
      maxHeight: "calc(50vh - 90px)",
      overflowY: "auto" as const,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 1,
          shadowRadius: 24,
        },
        android: {
          elevation: 16,
        },
        web: {
          boxShadow: "0 8px 60px rgba(0, 0, 0, 0.75)",
        },
      }),
    }

    switch (mode) {
      case "left-top":
        return {
          ...baseStyles,
          top: 0,
          left: 0,
          marginLeft: 350,
          marginTop: 55,
        }
      case "right-top":
        return {
          ...baseStyles,
          top: 0,
          right: 0,
          marginRight: 350,
          marginTop: 55,
        }
      case "right-bottom":
        return {
          ...baseStyles,
          bottom: 0,
          right: 0,
          marginRight: 240,
          marginBottom: 3600,
        }
      case "left-bottom":
        return {
          ...baseStyles,
          bottom: 0,
          left: 0,
          marginLeft: 240,
          marginBottom: 3600,
        }
      default:
        return {
          width: Platform.OS === "web" ? "80%" : "100%",
          height: Platform.OS === "web" ? "90%" : "100%",
          transform: [{ translateY: 0 }],
        }
    }
  }

  if (!isVisible) return null

  return (
    <View style={[styles.modalOverlay, mode === "full" ? styles.fullModeOverlay : styles.sectionModeOverlay]}>
      <View style={[styles.modalContent, getModalPositionStyle(), isKidsMode && styles.kidsModalContent]}>
        <TouchableOpacity style={[styles.closeButton, isKidsMode && styles.kidsCloseButton]} onPress={onClose}>
          <MaterialIcons name={"close"} size={28} color={isKidsMode ? "#ff7622" : "#000"} />
        </TouchableOpacity>

        <ScrollView style={styles.scrollContent}>
          <View style={styles.header}>
            <View style={[styles.gallerySection, isKidsMode && styles.kidsGallerySection]}>
              <ImageGallery images={menuItem.images || []} />
            </View>
          </View>

          <View style={[styles.detailsContainer, isKidsMode && styles.kidsDetailsContainer]}>
            <Text style={[styles.name, isKidsMode && styles.kidsName]}>
              {isKidsMode ? `${menuItem.name} 🌟` : menuItem.name}
            </Text>

            <Text style={[styles.description, isKidsMode && styles.kidsDescription]}>
              {isKidsMode ? menuItem.descriptionForKids : menuItem.description}
            </Text>

            {menuItem.sizes && menuItem.sizes.length > 0 && (
              <View style={[styles.sizeSection, isKidsMode && styles.kidsSizeSection]}>
                <Text style={[styles.sectionTitle, isKidsMode && styles.kidsSectionTitle]}>
                  {isKidsMode ? "Choose Your Size! 📏" : "SIZE:"}
                </Text>
                <View style={styles.sizes}>
                  {menuItem.sizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        size === selectedSize && styles.selectedSize,
                        isKidsMode && styles.kidsSizeButton,
                        size === selectedSize && isKidsMode && styles.kidsSelectedSize,
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text
                        style={[
                          styles.sizeText,
                          size === selectedSize && styles.selectedSizeText,
                          isKidsMode && styles.kidsSizeText,
                          size === selectedSize && isKidsMode && styles.kidsSelectedSizeText,
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={[styles.section, isKidsMode && styles.kidsSection]}>
              <Text style={[styles.sectionTitle, isKidsMode && styles.kidsSectionTitle]}>
                {isKidsMode ? "Special Ingredients! ✨" : "KEY INGREDIENTS"}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientsScroll}>
                <View style={styles.ingredients}>
                  {menuItem.keyIngredients.map((ingredient, index) => (
                    <View key={index} style={[styles.ingredient, isKidsMode && styles.kidsIngredient]}>
                      <View style={[styles.ingredientIcon, isKidsMode && styles.kidsIngredientIcon]}>
                        <FontAwesome6 name={ingredient.icon} size={24} color={isKidsMode ? "#ff7622" : "#FF8C00"} />
                      </View>
                      <Text style={[styles.ingredientText, isKidsMode && styles.kidsIngredientText]}>
                        {ingredient.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {!isKidsMode && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>NUTRITION</Text>
                {Platform.OS === "web" ? (
                  <WebNutritionDisplay nutrition={menuItem.nutrition} image={menuItem.images[0]} />
                ) : (
                  <View style={styles.nutritionGrid}>
                    <View style={styles.nutritionItem}>
                      <View style={styles.nutritionIcon}>
                        <FontAwesome6 name="wheat-awn" size={24} color="#666" />
                      </View>
                      <Text style={styles.nutritionValue}>{menuItem.nutrition.carbs}g carbs</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <View style={styles.nutritionIcon}>
                        <FontAwesome6 name="egg" size={24} color="#666" />
                      </View>
                      <Text style={styles.nutritionValue}>{menuItem.nutrition.proteins}g proteins</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <View style={styles.nutritionIcon}>
                        <FontAwesome6 name="fire" size={24} color="#666" />
                      </View>
                      <Text style={styles.nutritionValue}>{menuItem.nutrition.calories} Kcal</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <View style={styles.nutritionIcon}>
                        <FontAwesome6 name="cheese" size={24} color="#666" />
                      </View>
                      <Text style={styles.nutritionValue}>{menuItem.nutrition.fats}g fats</Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {!isKidsMode && menuItem.allergens.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ALLERGENS</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.allergensScroll}>
                  <View style={styles.allergens}>
                    {menuItem.allergens.map((allergen, index) => (
                      <View key={index} style={styles.allergen}>
                        <Text style={styles.allergenText}>{allergen}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={[styles.footer, isKidsMode && styles.kidsFooter]}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, isKidsMode && styles.kidsPrice]}>${menuItem.price}</Text>
            {quantity > 0 && showAddButton && (
              <View style={[styles.quantityBadge, isKidsMode && styles.kidsQuantityBadge]}>
                <Text style={[styles.quantityText, isKidsMode && styles.kidsQuantityText]}>{quantity}x</Text>
              </View>
            )}
          </View>
          {showAddButton && (
            <TouchableOpacity style={[styles.addButton, isKidsMode && styles.kidsAddButton]} onPress={onAddToOrder}>
              <Text style={[styles.addButtonText, isKidsMode && styles.kidsAddButtonText]}>
                {isKidsMode ? "Add to My Plate! 🍽️" : "Add to Order"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  fullModeOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sectionModeOverlay: {
    backgroundColor: "transparent",
    pointerEvents: "box-none",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: Platform.OS === "web" ? 24 : 16,
    overflow: "hidden",
  },
  kidsModalContent: {
    backgroundColor: "#fff9f6",
    borderRadius: 30,
    borderWidth: 4,
    borderColor: "#ff7622",
    padding: Platform.OS === "web" ? 32 : 24,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
  },
  kidsCloseButton: {
    backgroundColor: "#ffeee3",
    borderRadius: 25,
    padding: 12,
    borderWidth: 2,
    borderColor: "#ff7622",
  },
  scrollContent: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    width: "100%",
  },
  gallerySection: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  kidsGallerySection: {
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#ff7622",
  },
  detailsContainer: {
    padding: 20,
  },
  kidsDetailsContainer: {
    padding: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1A1A1A",
  },
  kidsName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff7622",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    lineHeight: 24,
  },
  kidsDescription: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 32,
  },
  sizeSection: {
    marginBottom: 24,
  },
  kidsSizeSection: {
    backgroundColor: "#ffeee3",
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  kidsSectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff7622",
    textAlign: "center",
    marginBottom: 20,
  },
  sizes: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  sizeButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#F8F9FB",
    textAlign: "center",
  },
  kidsSizeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    textAlign: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ffa26d",
  },
  selectedSize: {
    backgroundColor: "#FF8C00",
  },
  kidsSelectedSize: {
    backgroundColor: "#ff7622",
    borderColor: "#ff7622",
    transform: [{ scale: 1.1 }],
  },
  sizeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  kidsSizeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff7622",
  },
  selectedSizeText: {
    color: "white",
  },
  kidsSelectedSizeText: {
    color: "#fff",
  },
  section: {
    marginBottom: 24,
  },
  kidsSection: {
    backgroundColor: "#ffeee3",
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
  },
  ingredientsScroll: {
    marginBottom: 16,
  },
  ingredients: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
  },
  ingredient: {
    alignItems: "center",
    width: 80,
    marginRight: 16,
  },
  kidsIngredient: {
    width: 100,
    marginRight: 20,
  },
  ingredientIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#FFF5E6",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  kidsIngredientIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ff7622",
    marginBottom: 12,
  },
  ingredientText: {
    fontSize: 12,
    textAlign: "center",
    color: "#1A1A1A",
  },
  kidsIngredientText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff7622",
  },
  allergyText: {
    color: "#FF8C00",
    fontSize: 10,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  nutritionItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 16,
  },
  nutritionIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#F0F5FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  nutritionValue: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  allergensScroll: {
    marginBottom: 16,
  },
  allergens: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 8,
  },
  allergen: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FB",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  allergenText: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  kidsFooter: {
    backgroundColor: "#ffeee3",
    borderTopWidth: 2,
    borderTopColor: "#ff7622",
    padding: 24,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  kidsPrice: {
    fontSize: 28,
    color: "#ff7622",
  },
  quantityBadge: {
    backgroundColor: "#FF8C00",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  kidsQuantityBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quantityText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  kidsQuantityText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#FF8C00",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  kidsAddButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    transform: [{ scale: 1.1 }],
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  kidsAddButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
})

