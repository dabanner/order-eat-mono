import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import TopBar from "@repo/ui/src/topbar";
import Categories from "@repo/ui/src/categories";
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import MenuGrid from '@/components/MenuGrid';
import { useLocalSearchParams } from 'expo-router';


export default function RestaurantScreen() {
    const { id } = useLocalSearchParams();
    const { restaurants } = useRestaurantStore();
    const [isKidsMode, setIsKidsMode] = useState(false);

    // Find the restaurant with the given id 
    const restaurant = restaurants.find(restaurant => restaurant.id === id) || restaurants[0];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={Platform.OS === 'web'}
            >
                <TopBar isStandard={false} isTablet={true} isKidsMode={isKidsMode} onKidsModeToggle={setIsKidsMode}/>
                <View style={styles.content}>
                    <Categories isKidsMode={isKidsMode}/>
                    <MenuGrid menuItems={restaurant?.menuItems || []} isKidsMode={isKidsMode} restaurant={restaurant}/>
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
