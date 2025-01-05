import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import { Platform } from "react-native";

// Configure notifications handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

interface Coordinates {
    latitude: number;
    longitude: number;
}

const CONFIG = {
    NOTIFICATION_DISTANCE: 100,
    LOCATION_SETTINGS: {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5,
    },
};

// Keep track of last notification time to prevent spam
let lastNotificationTime = 0;
const NOTIFICATION_COOLDOWN = 30000; // 30 seconds

async function showLocalNotification(title: string, body: string) {
    const currentTime = Date.now();
    if (currentTime - lastNotificationTime < NOTIFICATION_COOLDOWN) {
        console.log('[DEBUG] Skipping notification - within cooldown period');
        return;
    }

    try {
        console.log('[DEBUG] Attempting to show notification:', { title, body });

        // Ensure we have permission
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        console.log('[DEBUG] Current notification permission:', existingStatus);

        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            console.log('[DEBUG] Requesting notification permission...');
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('[DEBUG] No notification permission');
            return;
        }

        // Schedule the notification
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
                priority: 'high',
            },
            trigger: null, // null means show immediately
        });

        console.log('[DEBUG] Notification scheduled successfully');
        lastNotificationTime = currentTime;
    } catch (error) {
        console.error('[DEBUG] Error showing notification:', error);
    }
}

function calculateDistance(coords1: Coordinates, coords2: Coordinates): number {
    const toRad = (x: number): number => (x * Math.PI) / 180;
    const R = 6371e3;

    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export function LocationNotificationService(): null {
    const { selectedRestaurant, restaurants } = useRestaurantStore();
    const locationSubscription = useRef<Location.LocationSubscription | null>(null);
    const hasNotifiedRef = useRef<{[key: string]: boolean}>({});

    useEffect(() => {
        let isMounted = true;
        console.log('[DEBUG] LocationNotificationService mounted');

        const monitorLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                console.log('[DEBUG] Location permission status:', status);

                if (status !== 'granted') {
                    console.log('[DEBUG] Location permission denied');
                    return;
                }

                console.log('[DEBUG] Starting location monitoring...');

                // Get initial location
                const initialLocation = await Location.getCurrentPositionAsync({});
                console.log('[DEBUG] Initial device location:', {
                    latitude: initialLocation.coords.latitude,
                    longitude: initialLocation.coords.longitude,
                    accuracy: initialLocation.coords.accuracy,
                });

                // Start watching location
                locationSubscription.current = await Location.watchPositionAsync(
                    CONFIG.LOCATION_SETTINGS,
                    (location) => {
                        console.log('[DEBUG] Location update:', {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            accuracy: location.coords.accuracy,
                            timestamp: new Date(location.timestamp).toISOString()
                        });

                        // Calculate distances and show notifications if needed
                        restaurants?.forEach(restaurant => {
                            const distance = calculateDistance(
                                location.coords,
                                {
                                    latitude: restaurant.latitude,
                                    longitude: restaurant.longitude
                                }
                            );
                            console.log(`[DEBUG] Distance to ${restaurant.name}: ${Math.round(distance)} meters`);

                            if (distance <= CONFIG.NOTIFICATION_DISTANCE && !hasNotifiedRef.current[restaurant.id]) {
                                console.log(`[DEBUG] Within notification distance of ${restaurant.name}!`);
                                showLocalNotification(
                                    `${restaurant.name} is ${Math.round(distance)}m away !`,
                                    `You're table n°34. Take a seat and enjoy your meal !`
                                );
                                hasNotifiedRef.current[restaurant.id] = true;
                            } else if (distance > CONFIG.NOTIFICATION_DISTANCE) {
                                // Reset notification flag when moving away
                                hasNotifiedRef.current[restaurant.id] = false;
                            }
                        });
                    }
                );

            } catch (error) {
                console.error('[DEBUG] Error monitoring location:', error);
            }
        };

        monitorLocation();

        return () => {
            console.log('[DEBUG] Cleaning up location service...');
            if (locationSubscription.current) {
                locationSubscription.current.remove();
                console.log('[DEBUG] Location subscription removed');
            }
        };
    }, [restaurants]);

    return null;
}