import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import { Platform } from "react-native";

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface LocationSubscription {
    remove: () => void;
}

// Platform-specific configurations
const CONFIG = {
    NOTIFICATION_DISTANCE: 1000, // meters - increased for better testing
    LOCATION_SETTINGS: {
        ios: {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 2, // More frequent updates
            timeInterval: 1000, // Check every second
            mayShowUserSettingsDialog: true,
        },
        android: {
            accuracy: Location.Accuracy.BestForNavigation, // Using best accuracy for both platforms
            distanceInterval: 2,
            timeInterval: 1000,
            mayShowUserSettingsDialog: true,
        }
    },
    NOTIFICATION_SETTINGS: {
        ios: {
            sound: true,
            badge: true,
            alert: true,
        },
        android: {
            channelId: 'location-notifications',
            channelName: 'Location Notifications',
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.MAX,
            vibrate: true,
        }
    },
    MAX_NOTIFICATION_FREQUENCY: 30 * 1000, // 30 seconds for testing
    DEBUG: true // Enable detailed logging
} as const;

// Setup platform-specific notification channels
async function setupNotificationChannels() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(CONFIG.NOTIFICATION_SETTINGS.android.channelId, {
            name: CONFIG.NOTIFICATION_SETTINGS.android.channelName,
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            enableVibrate: true,
            enableLights: true,
        });
        CONFIG.DEBUG && console.log('[LocationService] Android notification channel setup complete');
    }
}

// Configure notifications handler with platform-specific settings
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: Platform.OS === 'ios',
        priority: Platform.OS === 'android' ? CONFIG.NOTIFICATION_SETTINGS.android.priority : undefined,
    }),
});

async function schedulePushNotification(title: string, body: string): Promise<void> {
    try {
        const notificationContent: any = {
            title,
            body,
            data: { type: 'location', timestamp: new Date().toISOString() },
        };

        if (Platform.OS === 'ios') {
            notificationContent.sound = CONFIG.NOTIFICATION_SETTINGS.ios.sound;
            notificationContent.badge = 1;
        } else {
            notificationContent.android = {
                channelId: CONFIG.NOTIFICATION_SETTINGS.android.channelId,
                priority: CONFIG.NOTIFICATION_SETTINGS.android.priority,
                vibrate: true,
            };
        }

        await Notifications.scheduleNotificationAsync({
            content: notificationContent,
            trigger: null,
        });

        CONFIG.DEBUG && console.log('[LocationService] Notification scheduled:', { title, body });
    } catch (error) {
        console.error('[LocationService] Failed to schedule notification:', error);
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

async function requestLocationPermission(): Promise<boolean> {
    try {
        CONFIG.DEBUG && console.log('[LocationService] Checking location services...');

        const serviceEnabled = await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) {
            console.warn('[LocationService] Location services are not enabled. Please enable them in your device settings.');
            return false;
        }

        CONFIG.DEBUG && console.log('[LocationService] Requesting foreground permission...');
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted') {
            console.warn('[LocationService] Location permission denied. Please enable location access for this app.');
            return false;
        }

        CONFIG.DEBUG && console.log('[LocationService] Requesting background permission...');
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            // We can continue without background permission, but log a warning
            console.warn('[LocationService] Background location permission denied. Location updates may be limited when app is in background.');
        }

        CONFIG.DEBUG && console.log('[LocationService] Location permissions granted');
        return true;
    } catch (error) {
        console.error('[LocationService] Error requesting location permission:', error);
        return false;
    }
}

export function LocationNotificationService(): null {
    const { selectedRestaurant } = useRestaurantStore();
    const lastNotificationTime = useRef<number>(0);
    const locationSubscriptionRef = useRef<LocationSubscription | null>(null);
    const notificationSetupDone = useRef<boolean>(false);

    useEffect(() => {
        console.log('[LocationService] Effect triggered');
        console.log('[LocationService] Selected restaurant state:', selectedRestaurant?.name || 'none');

        schedulePushNotification('Welcome to OrderEat!', 'We will notify you when you are near a restaurant.');

        let notificationSubscription: Notifications.Subscription;
        let isMounted = true;

        const setupNotifications = async (): Promise<void> => {
            console.log('[LocationService] Setting up notifications');
            if (notificationSetupDone.current) {
                console.log('[LocationService] Notifications already setup');
                return;
            }

            try {
                if (Platform.OS === 'android') {
                    await setupNotificationChannels();
                }

                const settings = await Notifications.getPermissionsAsync();
                console.log('[LocationService] Current notification settings:', settings);

                if (!settings.granted) {
                    console.log('[LocationService] Requesting notification permissions');
                    const permissionOptions = Platform.OS === 'ios' ? {
                        ios: {
                            allowAlert: true,
                            allowBadge: true,
                            allowSound: true,
                            allowAnnouncements: true,
                        }
                    } : undefined;

                    const { status } = await Notifications.requestPermissionsAsync(permissionOptions);
                    console.log('[LocationService] Notification permission status:', status);

                    if (status !== 'granted') {
                        console.warn('[LocationService] Notification permissions denied');
                        return;
                    }
                }

                notificationSetupDone.current = true;
                console.log('[LocationService] Notifications setup complete');

                notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
                    console.log('[LocationService] Notification received:', notification);
                });
            } catch (error) {
                console.error('[LocationService] Error setting up notifications:', error);
            }
        };

        const startLocationTracking = async (): Promise<void> => {
            if (!selectedRestaurant) {
                console.log('[LocationService] No restaurant selected, skipping location tracking');
                return;
            }

            console.log('[LocationService] Selected restaurant:', {
                name: selectedRestaurant.name,
                latitude: selectedRestaurant.latitude,
                longitude: selectedRestaurant.longitude
            });

            try {
                const hasPermission = await requestLocationPermission();
                if (!hasPermission) return;

                if (locationSubscriptionRef.current) {
                    locationSubscriptionRef.current.remove();
                }

                const initialLocation = await Location.getCurrentPositionAsync({
                    accuracy: Platform.OS === 'ios'
                        ? CONFIG.LOCATION_SETTINGS.ios.accuracy
                        : CONFIG.LOCATION_SETTINGS.android.accuracy,
                });
                console.log('[LocationService] Initial location:', initialLocation);

                const locationSettings = Platform.OS === 'ios'
                    ? CONFIG.LOCATION_SETTINGS.ios
                    : CONFIG.LOCATION_SETTINGS.android;

                console.log('[LocationService] Starting location watching with settings:', locationSettings);
                const subscription = await Location.watchPositionAsync(
                    locationSettings,
                    (location) => {
                        if (!isMounted || !selectedRestaurant) return;

                        const distance = calculateDistance(
                            location.coords,
                            {
                                latitude: selectedRestaurant.latitude,
                                longitude: selectedRestaurant.longitude,
                            }
                        );

                        console.log('[LocationService] Location update:', {
                            currentLat: location.coords.latitude,
                            currentLon: location.coords.longitude,
                            distance: Math.round(distance),
                            restaurant: selectedRestaurant.name
                        });

                        const currentTime = Date.now();
                        const timeSinceLastNotification = currentTime - lastNotificationTime.current;

                        if (distance <= CONFIG.NOTIFICATION_DISTANCE &&
                            timeSinceLastNotification >= CONFIG.MAX_NOTIFICATION_FREQUENCY) {
                            console.log('[LocationService] Triggering notification for restaurant:', selectedRestaurant.name);
                            schedulePushNotification(
                                `${selectedRestaurant.name} Nearby!`,
                                `You're ${Math.round(distance)}m away from ${selectedRestaurant.name}. Check out our special menu!`
                            );
                            lastNotificationTime.current = currentTime;
                        }
                    }
                );

                locationSubscriptionRef.current = subscription;
                console.log('[LocationService] Location tracking started successfully');
            } catch (error) {
                console.error('[LocationService] Error in location tracking:', error);
            }
        };

        setupNotifications();
        startLocationTracking();

        return () => {
            console.log('[LocationService] Cleaning up location service');
            isMounted = false;
            if (locationSubscriptionRef.current) {
                locationSubscriptionRef.current.remove();
            }
            if (notificationSubscription) {
                Notifications.removeNotificationSubscription(notificationSubscription);
            }
        };
    }, [selectedRestaurant]);

    return null;
}