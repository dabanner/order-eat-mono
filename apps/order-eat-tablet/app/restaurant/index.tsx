import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import TopBar from "@repo/ui/src/topbar";
import Categories from "@repo/ui/src/categories";
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import MenuGrid from '@/components/MenuGrid';

export default function RestaurantScreen() {
    const { restaurants } = useRestaurantStore();
    const firstRestaurant = restaurants[0];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={Platform.OS === 'web'}
            >
                <TopBar isPhone={false} />
                <View style={styles.content}>
                <Categories />
                    <MenuGrid menuItems={firstRestaurant.menuItems} />
                </View>
            </ScrollView>
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
    content: {
        padding: 16,
        paddingTop: 0,
        maxWidth: '100%',
        width: '100%',
        marginHorizontal: 'auto',
    },
});
