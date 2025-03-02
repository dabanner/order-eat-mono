import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MenuItem, Restaurant } from '@repo/store/src/restaurantStore';
import { MenuItem as MenuItemComponent } from '@repo/ui/src/MenuItem';
import { useFoodCategoryStore } from '@repo/store/src/foodCaregoryStore';
import { MenuItemModal } from '@repo/ui/src/MenuItemModal';
import { useCommandStore } from '@repo/store/src/commandStore';

interface MenuGridProps {
    menuItems: MenuItem[];
    isKidsMode?: boolean;
    restaurant: Restaurant;
}

export default function MenuGrid({ menuItems, isKidsMode, restaurant }: MenuGridProps) {
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
    const { addMenuItem, currentCommand } = useCommandStore();

    const newItems = isKidsMode ? menuItems.filter((menuItem)=> menuItem.descriptionForKids.length > 0) : menuItems

    const groupedItems = newItems.reduce((acc, item) => {
        if (!acc[item.foodCategoryId]) {
            acc[item.foodCategoryId] = [];
        }
        acc[item.foodCategoryId].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    const getCategoryName = (categoryId: string) => {
        const category = useFoodCategoryStore.getState().getFoodCategoryById(categoryId);
        return category?.name;
    };

    const getCategoryEmoji = (categoryId: string) => {
        const category = useFoodCategoryStore.getState().getFoodCategoryById(categoryId);
        return category?.emoji;
    };

    const handleAddMenuItem = (item: MenuItem) => {
        console.log('[CURRENT COMMAND]', currentCommand);
        addMenuItem(item);
    };

    const getItemQuantity = (itemId: string) => {
        return currentCommand?.menuItems
            .filter(item => item.id === itemId && !item.submitted)
            .reduce((total, item) => total + item.quantity, 0) || 0;
    };

    return (
        <View style={[
            styles.container,
            isKidsMode && styles.kidsContainer
        ]}>
            {Object.entries(groupedItems).map(([categoryId, items]) => (
                <View 
                    key={categoryId} 
                    style={[
                        styles.category,
                        isKidsMode && styles.kidsCategory
                    ]}
                >
                    <View style={[
                        styles.categoryHeader,
                        isKidsMode && styles.kidsCategoryHeader
                    ]}>
                        <Text style={[
                            styles.categoryTitle,
                            isKidsMode && styles.kidsCategoryTitle
                        ]}>
                            {isKidsMode ? `${getCategoryEmoji(categoryId)} ${getCategoryName(categoryId)} Time !` : getCategoryName(categoryId)}
                        </Text>
                    </View>
                    <View style={[
                        styles.grid,
                        isKidsMode && styles.kidsGrid
                    ]}>
                        {items.map((item) => (
                            <MenuItemComponent
                                key={item.id}
                                item={item}
                                onPress={() => setSelectedMenuItem(item)}
                                onAddClick={() => handleAddMenuItem(item)}
                                showAddButton={true}
                                isKidsMode={isKidsMode}
                                quantity={getItemQuantity(item.id)}
                            />
                        ))}
                    </View>
                </View>
            ))}

            {selectedMenuItem && (
                <MenuItemModal
                    isVisible={!!selectedMenuItem}
                    onClose={() => setSelectedMenuItem(null)}
                    menuItem={selectedMenuItem}
                    restaurant={restaurant}
                    onAddToOrder={() => {
                        handleAddMenuItem(selectedMenuItem);
                        setSelectedMenuItem(null);
                    }}
                    quantity={getItemQuantity(selectedMenuItem.id)}
                    showAddButton={true}
                    isKidsMode={isKidsMode}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    kidsContainer: {
        backgroundColor: '#fff9f6',
        borderRadius: 30,
        padding: 16,
    },
    category: {
        marginBottom: 24,
    },
    kidsCategory: {
        backgroundColor: '#ffeee3',
        borderRadius: 25,
        padding: 16,
        marginBottom: 32,
        ...Platform.select({
            ios: {
                shadowColor: '#ff7622',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
            web: {
                boxShadow: '0px 4px 15px rgba(255, 118, 34, 0.2)',
            },
        }),
    },
    categoryHeader: {
        marginBottom: 16,
    },
    kidsCategoryHeader: {
        backgroundColor: '#ffa26d',
        borderRadius: 20,
        padding: 12,
        marginBottom: 20,
        transform: [{ translateY: -25 }],
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            },
        }),
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    kidsCategoryTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 0,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 16,
    },
    kidsGrid: {
        gap: 24,
        padding: 8,
    },
});

