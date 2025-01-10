import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import TabletMenu from '@/components/TabletMenu';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();

  return <TabletMenu restaurantId={id as string} />;
}

