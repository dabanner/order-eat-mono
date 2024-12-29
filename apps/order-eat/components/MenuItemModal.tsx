import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { Restaurant, MenuItem } from '@repo/store/src/restaurantStore';
import { ImageGallery } from './ImageGallery';
import { WebNutritionDisplay } from './WebNutritionDisplay';

interface MenuItemModalProps {
  isVisible: boolean;
  onClose: () => void;
  menuItem: MenuItem;
  restaurant: Restaurant;
  onAddToOrder: () => void;
  quantity: number;
  showAddButton?: boolean;
}

export function MenuItemModal({
  isVisible,
  onClose,
  menuItem,
  restaurant,
  onAddToOrder,
  quantity,
  showAddButton = false
}: MenuItemModalProps) {
  const [selectedSize, setSelectedSize] = useState(menuItem.sizes?.[0] || null);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <ScrollView style={styles.scrollContent}>
            <View style={styles.header}>
              <View style={styles.gallerySection}>
                <ImageGallery images={menuItem.images || []} />
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.name}>{menuItem.name}</Text>
              <View style={styles.restaurantInfo}>
                <MaterialIcons name="storefront" size={20} color="#FF8C00" style={styles.icon} />
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={20} color="#FF8C00" style={styles.icon} />
                <Text style={styles.rating}>{restaurant.rating}</Text>
              </View>
              <Text style={styles.description}>{menuItem.description}</Text>

              {menuItem.sizes && menuItem.sizes.length > 0 && (
                <View style={styles.sizeSection}>
                  <Text style={styles.sectionTitle}>SIZE:</Text>
                  <View style={styles.sizes}>
                    {menuItem.sizes.map((size) => (
                      <TouchableOpacity
                        key={size}
                        style={[styles.sizeButton, size === selectedSize && styles.selectedSize]}
                        onPress={() => setSelectedSize(size)}
                      >
                        <Text style={[styles.sizeText, size === selectedSize && styles.selectedSizeText]}>
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>KEY INGREDIENTS</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientsScroll}>
                  <View style={styles.ingredients}>
                    {menuItem.keyIngredients.map((ingredient, index) => (
                      <View key={index} style={styles.ingredient}>
                        <View style={styles.ingredientIcon}>
                          <FontAwesome6 name={ingredient.icon} size={24} color="#FF8C00" />
                        </View>
                        <Text style={styles.ingredientText}>
                          {ingredient.name}
                          {ingredient.isAllergy && (
                            <Text style={styles.allergyText}>{'\n'}(Allergy)</Text>
                          )}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>NUTRITION</Text>
                {Platform.OS === 'web' ? (
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
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${menuItem.price}</Text>
              {quantity > 0 && showAddButton && (
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>{quantity}x</Text>
                </View>
              )}
            </View>
            {showAddButton && (
              <TouchableOpacity style={styles.addButton} onPress={onAddToOrder}>
                <Text style={styles.addButtonText}>Add to Order</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: Platform.OS === 'web' ? '80%' : '100%',
    height: Platform.OS === 'web' ? '90%' : '100%',
    position: 'relative',
    padding: Platform.OS === 'web' ? 24 : 16,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
  },
  scrollContent: {
    flex: 1,
    marginTop: 40,
  },
  header: {
    width: '100%',
  },
  gallerySection: {
    width: '100%',
  },
  detailsContainer: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    color: '#666',
  },
  icon: {
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  sizeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  sizes: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#F8F9FB',
  },
  selectedSize: {
    backgroundColor: '#FF8C00',
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  selectedSizeText: {
    color: 'white',
  },
  section: {
    marginBottom: 24,
  },
  ingredientsScroll: {
    marginBottom: 16,
  },
  ingredients: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  ingredient: {
    alignItems: 'center',
    width: 80,
    marginRight: 16,
  },
  ingredientIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF5E6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  allergyText: {
    color: '#FF8C00',
    fontSize: 10,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  nutritionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#F0F5FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nutritionValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  allergensScroll: {
    marginBottom: 16,
  },
  allergens: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
  },
  allergen: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  allergenText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  quantityBadge: {
    backgroundColor: '#FF8C00',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  quantityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

