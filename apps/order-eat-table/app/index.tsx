import React from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/ui/HelloWave';

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        <View style={styles.content}>
          <HelloWave />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
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
    }
});

