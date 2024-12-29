import { useEffect } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useLocationStore } from '@repo/store/src/restaurantsLocation';

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const NOTIFICATION_DISTANCE = 100; // meters

async function schedulePushNotification(title: string, body: string) {
    console.log('[DEBUG] Scheduling notification:', title, body);
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // null means show immediately
    });
}

export function LocationNotificationService() {
    console.log('[DEBUG] LocationNotificationService mounted');

    const { selectedLocation } = useLocationStore();

    console.log('[DEBUG] Selected location:', selectedLocation);

    useEffect(() => {
        let notificationSubscription: Notifications.Subscription;

        const setupNotifications = async () => {
            // Request permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('[DEBUG] Failed to get push notification permissions!');
                return;
            }

            console.log('[DEBUG] Notification permissions granted');

            // Handle notifications when app is foregrounded
            notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
                console.log('[DEBUG] Notification received:', notification);
            });
        };

        setupNotifications();

        if (!selectedLocation) {
            console.log('[DEBUG] No location available');
            return;
        }

        const setupLocationTracking = async () => {
            try {
                console.log('[DEBUG] Requesting location permission');
                const permission = await requestLocationPermission();

                if (!permission) {
                    console.log('[DEBUG] Location permission denied');
                    return;
                }

                console.log('[DEBUG] Starting location tracking');
                return await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 10,
                    },
                    (location) => {
                        console.log('[DEBUG] New location update:', location);

                        const distance = calculateDistance(
                            location.coords,
                            {
                                latitude: selectedLocation.latitude,
                                longitude: selectedLocation.longitude
                            }
                        );

                        console.log('[DEBUG] Distance to location:', distance);

                        if (distance <= NOTIFICATION_DISTANCE) {
                            schedulePushNotification(
                                `${selectedLocation.name} Nearby!`,
                                "Check out our special offers!"
                            );
                        }
                    }
                );
            } catch (error) {
                console.error('[DEBUG] Error in setupLocationTracking:', error);
            }
        };

        // Start location tracking and store the subscription
        const locationSubscription = setupLocationTracking();

        // Cleanup
        return () => {
            locationSubscription.then(sub => sub?.remove());
            if (notificationSubscription) {
                Notifications.removeNotificationSubscription(notificationSubscription);
            }
        };
    }, [selectedLocation]);

    return null;
}


async function requestLocationPermission() {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('[DEBUG] Location permission status:', status);
        return status === 'granted';
    } catch (error) {
        console.error('[DEBUG] Error requesting location permission:', error);
        return false;
    }
}

function calculateDistance(coords1, coords2) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371e3;

    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}