import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import { Platform } from "react-native";
import { useCommandStore } from '@repo/store/src/commandStore';

type LocationTaskData = {
    locations: Array<{
        coords: {
            latitude: number;
            longitude: number;
            altitude: number | null;
            accuracy: number | null;
            altitudeAccuracy: number | null;
            heading: number | null;
            speed: number | null;
        };
        timestamp: number;
    }>;
};

type LocationTaskError = {
    message: string;
};

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface NotificationSettings {
    ios?: {
        sound: boolean;
        badge: boolean;
        alert: boolean;
    };
    android?: {
        channelId: string;
        channelName: string;
        sound: string;
        priority: Notifications.AndroidNotificationPriority;
        vibrate: boolean;
    };
}

interface Config {
    NOTIFICATION_DISTANCE: number;
    LOCATION_SETTINGS: Location.LocationTaskOptions;
    NOTIFICATION_SETTINGS: NotificationSettings;
    MAX_NOTIFICATION_FREQUENCY: number;
}

const LOCATION_TASK_NAME = 'background-location-task';

const CONFIG: Config = {
    NOTIFICATION_DISTANCE: 1000,
    LOCATION_SETTINGS: {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 2,
        timeInterval: 1000,
        foregroundService: {
            notificationTitle: "Location Tracking Active",
            notificationBody: "Tracking your location to notify you about nearby restaurants",
            notificationColor: "#FF231F7C",
        },
        mayShowUserSettingsDialog: true,
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
        },
        default: {},
    } as NotificationSettings,
    MAX_NOTIFICATION_FREQUENCY: 30 * 1000,
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: { 
    data: LocationTaskData; 
    error: LocationTaskError | null;
}) => {
    if (error) {
        console.error('[BackgroundLocation] Task error:', error);
        return;
    }

    const { locations } = data;
    const restaurant = useRestaurantStore.getState().selectedRestaurant;
    
    if (!restaurant || !locations || locations.length === 0) return;

    const distance = calculateDistance(
        locations[0].coords,
        {
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
        }
    );

    if (distance <= CONFIG.NOTIFICATION_DISTANCE) {
        await schedulePushNotification(
            `${restaurant.name} Nearby!`,
            `You're ${Math.round(distance)}m away. Check out our special menu!`
        );
    }
});

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

async function setupNotifications(): Promise<void> {
    if (Platform.OS === 'android') {
        console.log(CONFIG)
        await Notifications.setNotificationChannelAsync(
            CONFIG.NOTIFICATION_SETTINGS.android!.channelId,
            {
                name: CONFIG.NOTIFICATION_SETTINGS.android!.channelName,
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                enableVibrate: true,
                enableLights: true,
            }
        );
    }

    await Notifications.requestPermissionsAsync();
}

async function schedulePushNotification(title: string, body: string): Promise<void> {
    const notificationContent: Notifications.NotificationContentInput = {
        title,
        body,
        data: { type: 'location', timestamp: new Date().toISOString() },
        ...(Platform.OS === 'android' ? {
            sound: true,
            android: {
                channelId: CONFIG.NOTIFICATION_SETTINGS.android!.channelId,
                priority: CONFIG.NOTIFICATION_SETTINGS.android!.priority,
                vibrate: true,
            }
        } : {
            sound: true,
            badge: 1,
        })
    };

    await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: null,
    });
}

export function BackgroundLocationService(): null {
    const { pendingCommands, confirmedCommands } = useCommandStore();
    const isTracking = useRef<boolean>(false);

    const currentCommand = [...pendingCommands, confirmedCommands].pop();

    useEffect(() => {
        let isMounted = true;

        const startBackgroundTracking = async (): Promise<void> => {
            console.log('tracking ...')
            try {
                const { status: foreground } = await Location.requestForegroundPermissionsAsync();
                const { status: background } = await Location.requestBackgroundPermissionsAsync();

                console.log("foreground", foreground);
                console.log("background", background);
                
                if (foreground !== 'granted' || background !== 'granted') {
                    console.warn('[BackgroundLocation] Location permissions denied');
                    return;
                }

                console.log("background", background);
                await setupNotifications();
                
                console.log("background", background);
                if (!isTracking.current) {
                    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, CONFIG.LOCATION_SETTINGS);
                    isTracking.current = true;
                }
            } catch (error) {
                console.error('[BackgroundLocation] Error starting tracking:', error);
            }
        };

        if (currentCommand && isMounted) {
            startBackgroundTracking();
        }

        return () => {
            isMounted = false;
            if (isTracking.current) {
                Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
                isTracking.current = false;
            }
        };
    }, [currentCommand]);

    return null;
}