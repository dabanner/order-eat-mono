import React from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';

const MenuListSkeleton = () => {
    // Create arrays for skeleton placeholders
    const categoryPlaceholders = Array(3).fill(null);
    const menuItemPlaceholders = Array(6).fill(null);

    return (
        <View style={styles.container}>
            {/* Categories skeleton */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
            >
                {categoryPlaceholders.map((_, index) => (
                    <View
                        key={`category-${index}`}
                        style={[styles.categoryButton, styles.shimmer]}
                    />
                ))}
            </ScrollView>

            {/* Menu items grid skeleton */}
            <View style={styles.grid}>
                {menuItemPlaceholders.map((_, index) => (
                    <View
                        key={`menu-item-${index}`}
                        style={styles.menuItemContainer}
                    >
                        {/* Image placeholder */}
                        <View style={[styles.imagePlaceholder, styles.shimmer]} />

                        {/* Content placeholders */}
                        <View style={styles.contentContainer}>
                            {/* Title placeholder */}
                            <View style={[styles.titlePlaceholder, styles.shimmer]} />

                            {/* Description placeholders */}
                            <View style={styles.descriptionContainer}>
                                <View style={[styles.descriptionLine, styles.shimmer]} />
                                <View style={[styles.descriptionLine, styles.shimmer, styles.shortLine]} />
                            </View>

                            {/* Price and button placeholder */}
                            <View style={styles.footer}>
                                <View style={[styles.pricePlaceholder, styles.shimmer]} />
                                <View style={[styles.buttonPlaceholder, styles.shimmer]} />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    categoriesContainer: {
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    categoryButton: {
        width: 120,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#E1E1E1',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    menuItemContainer: {
        width: Platform.OS === 'web' ? '31%' : '48%',
        marginBottom: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
            web: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            }
        }),
    },
    imagePlaceholder: {
        width: '100%',
        height: 150,
        backgroundColor: '#E1E1E1',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    contentContainer: {
        padding: 12,
    },
    titlePlaceholder: {
        height: 20,
        backgroundColor: '#E1E1E1',
        borderRadius: 4,
        marginBottom: 12,
        width: '80%',
    },
    descriptionContainer: {
        marginBottom: 12,
    },
    descriptionLine: {
        height: 12,
        backgroundColor: '#E1E1E1',
        borderRadius: 4,
        marginBottom: 8,
    },
    shortLine: {
        width: '60%',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    pricePlaceholder: {
        width: 60,
        height: 20,
        backgroundColor: '#E1E1E1',
        borderRadius: 4,
    },
    buttonPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E1E1E1',
    },
    shimmer: {
        opacity: 0.7,
    },
});

export default MenuListSkeleton;