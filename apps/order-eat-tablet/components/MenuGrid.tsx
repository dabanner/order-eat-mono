import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MenuItem } from '@repo/store/src/restaurantStore';
import { MenuItem as MenuItemComponent } from '@repo/ui/src/MenuItem';

interface MenuGridProps {
    menuItems: MenuItem[];
}

export default function MenuGrid({ menuItems }: MenuGridProps) {
    const groupedItems = menuItems.reduce((acc, item) => {
        if (!acc[item.foodCategoryId]) {
            acc[item.foodCategoryId] = [];
        }
        acc[item.foodCategoryId].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    return (
        <View>
            {Object.entries(groupedItems).map(([categoryId, items]) => (
                <View key={categoryId} style={styles.category}>
                    <Text style={styles.categoryTitle}>Category {categoryId}</Text>
                    <View style={styles.grid}>
                        {items.map((item) => (
                            <MenuItemComponent
                                key={item.id}
                                item={item}
                                onPress={() => {}}
                                onAddClick={() => {}}
                                showAddButton={true}
                            />
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    category: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});

