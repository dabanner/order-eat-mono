import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommandStore } from '@repo/store/src/commandStore';
import { Confirmation } from '@/components/Confirmation';
import { Scroll } from 'lucide-react-native';

export default function ReservationDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { pendingCommands, confirmedCommands } = useCommandStore();
  
  const command = [...pendingCommands, ...confirmedCommands].find(
    (cmd) => cmd.id === id
  );

  if (!command) {
    router.replace('/reservation');
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Confirmation 
          restaurant={command.restaurant}
          command={command}
        />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});

