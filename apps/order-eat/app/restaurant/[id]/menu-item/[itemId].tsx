import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageGallery } from '@/components/ImageGallery';
import { WebNutritionDisplay } from '@/components/WebNutritionDisplay';
import { MenuItemHeader } from '@/components/MenuItemHeader';
import { Footer } from '@/components/Footer';
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

    const onSizeSelect = useCallback((size) => {
        console.log(`Selected size: ${size}`);
    }, []);

    const renderMenuItemHeader = () => (
        <MenuItemHeader
            restaurant={{
                name: restaurant?.name || '',
                rating: restaurant?.rating || 0,
            }}
            menuItem={{
                name: menuItem.name,
                description: menuItem.description,
                price: menuItem.price,
                sizes: menuItem.sizes,
                selectedSize: menuItem.selectedSize,
            }}
            onSizeSelect={onSizeSelect}
        />
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.gallerySection}>
                            <ImageGallery images={menuItem.images || []} />
                        </View>
                        {Platform.OS === 'web' && (
                            <View style={styles.infoSection}>
                                {renderMenuItemHeader()}
                            </View>
                        )}
                    </View>
                </View>
                {Platform.OS !== 'web' && renderMenuItemHeader()}

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
            </ScrollView>
            <Footer
                text={'$' + menuItem.price.toString()}
                counter={quantity}
                buttonText="ADD TO CART"
                updateText={(newPrice) => {
                    // Implement logic to update the price if needed
                    console.log('Update price to:', newPrice);
                }}
                updateCounter={handleQuantityChange}
                onClickButton={handleAddToCart}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
    },
    header: {
        position: 'relative',
    },
    headerContent: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        padding: Platform.OS === 'web' ? 20 : 5,
        paddingBottom: 0,
    },
    gallerySection: {
        flex: Platform.OS === 'web' ? 3 : 1,
    },
    infoSection: {
        flex: 2,
        paddingLeft: Platform.OS === 'web' ? 40 : 0,
    },
    section: {
        padding: 20,
        paddingBottom: 0,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    ingredientsScroll: {
        marginBottom: 16,
    },
    ingredients: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: Platform.OS === 'web' ? 'flex-start' : 'space-between',
    },
    ingredient: {
        alignItems: 'center',
        width: Platform.OS === 'web' ? '20%' : 80,
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
    allergensScroll: {
        marginBottom: Platform.OS === 'web' ? 170 : 10,
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
        position: Platform.OS === 'web' ? 'fixed' : 'relative',
        bottom: 0,
        left: Platform.OS === 'web' ? '25%' : 0,
        right: Platform.OS === 'web' ? '25%' : 0,
        backgroundColor: 'transparent',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        width: Platform.OS === 'web' ? '50%' : '100%',
        zIndex: 1000,
    },
    footerContent: {
        backgroundColor: '#F0F5FA',
        borderRadius: Platform.OS === 'web' ? 24 : 0,
        padding: 20,
    }
});
