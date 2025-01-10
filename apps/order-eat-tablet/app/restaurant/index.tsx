import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import TabletMenu from '@/components/TabletMenu';
import * as ScreenOrientation from "expo-screen-orientation";
import { Platform } from 'react-native';


export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  if (Platform.OS !== 'web'){
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }
  return <TabletMenu restaurantId={id as string} />;
}

