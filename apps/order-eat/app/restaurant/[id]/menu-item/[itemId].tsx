import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRestaurantStore } from '@/store/restaurantStore';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageGallery } from '@/components/ImageGallery';

export default function MenuItemDetail() {
    const { id, itemId } = useLocalSearchParams();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const restaurant = useRestaurantStore(state =>
        state.restaurants.find(r => r.id === id)
    );

    const menuItem = restaurant?.menuItems.find(item => item.id === itemId);

    if (!menuItem) {
        return <Text>Menu item not found</Text>;
    }

    const handleQuantityChange = useCallback((increment: boolean) => {
        setQuantity(prev => increment ? prev + 1 : Math.max(1, prev - 1));
    }, []);

    const handleAddToCart = useCallback(() => {
        // Implement add to cart functionality
        console.log(`Added ${quantity} ${menuItem.name} to cart`);
    }, [quantity, menuItem]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.imageContainer}>
                    <ImageGallery images={menuItem.images || []} />
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Text style={styles.name}>{menuItem.name}</Text>

                    <View style={styles.restaurantName}>
                        <MaterialIcons name="storefront" size={20} color="#FF8C00" style={styles.restaurantIcon} />
                        <Text style={styles.restaurantText}>{restaurant?.name}</Text>
                    </View>

                    <View style={styles.ratingContainer}>
                        <MaterialIcons name="star" size={20} color="#FF8C00" />
                        <Text style={styles.rating}>{restaurant?.rating}</Text>
                        <MaterialIcons name="schedule" size={20} color="#FF8C00" style={styles.clockIcon} />
                        <Text style={styles.prepTime}>{menuItem.preparationTime} min</Text>
                    </View>

                    <Text style={styles.description}>{menuItem.description}</Text>

                    <View style={styles.sizeSection}>
                        <Text style={styles.sectionTitle}>SIZE:</Text>
                        <View style={styles.sizes}>
                            {menuItem.sizes.map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    style={[
                                        styles.sizeButton,
                                        size === menuItem.selectedSize && styles.selectedSize
                                    ]}
                                >
                                    <Text style={[
                                        styles.sizeText,
                                        size === menuItem.selectedSize && styles.selectedSizeText
                                    ]}>{size}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
            <Text style={styles.sectionTitle}>KEY INGREDIENTS</Text>
            {Platform.OS === 'web' ? (
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
            ) : (
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
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ALLERGENS</Text>
            {Platform.OS === 'web' ? (
                <View style={styles.allergens}>
                    {menuItem.allergens.map((allergen, index) => (
                        <View key={index} style={styles.allergen}>
                            <Text style={styles.allergenText}>{allergen}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.allergensScroll}>
                    <View style={styles.allergens}>
                        {menuItem.allergens.map((allergen, index) => (
                            <View key={index} style={styles.allergen}>
                                <Text style={styles.allergenText}>{allergen}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
          </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>NUTRITIONS</Text>
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
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footerContainer}>
                <View style={styles.footer}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.currency}>$</Text>
                        <Text style={styles.price}>{menuItem.price}</Text>
                    </View>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange(false)}
                        >
                            <MaterialIcons name="remove" size={20} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange(true)}
                        >
                            <MaterialIcons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                    <Text style={styles.addButtonText}>ADD TO CART</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
        zIndex: 10,
    },
    content: {
        padding: 20,
    },
    restaurantName: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    restaurantText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    name: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 12,
        color: '#1A1A1A',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    rating: {
        marginLeft: 4,
        marginRight: 16,
        fontSize: 16,
        color: '#1A1A1A',
    },
    restaurantIcon: {
        marginRight: 8,
    },
    clockIcon: {
        marginRight: 8,
    },
    prepTime: {
        fontSize: 16,
        color: '#1A1A1A',
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
        lineHeight: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        textTransform: 'uppercase',
        marginRight: 16,
        marginBottom: 5,
    },
    sizeSection: {
        marginBottom: 32,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sizes: {
        flexDirection: 'row',
        gap: 12,
        flex: 1,
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
    ingredientsScroll: {
        marginBottom: 16,
      },
      allergensScroll: {
        marginBottom: 16,
      },
      ingredients: {
        flexDirection: 'row',
        flexWrap: Platform.OS === 'web' ? 'wrap' : 'nowrap',
        justifyContent: Platform.OS === 'web' ? 'flex-start' : 'space-between',
      },
      ingredient: {
        alignItems: 'center',
        width: Platform.OS === 'web' ? '5%' : '15%',
        marginRight: Platform.OS === 'web' ? 0 : 16,
        marginBottom: Platform.OS === 'web' ? 16 : 0,
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
      allergens: {
        flexDirection: 'row',
        flexWrap: Platform.OS === 'web' ? 'wrap' : 'nowrap',
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
    footerContainer: {
        backgroundColor: '#F0F5FA',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    currency: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        marginRight: 2,
    },
    price: {
        fontSize: 32,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        borderRadius: 30,
        padding: 4,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FF8C00',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantity: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 20,
    },
    addButton: {
        backgroundColor: '#FF8C00',
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 16,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

