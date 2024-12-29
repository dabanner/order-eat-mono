import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommandStore } from '@repo/store/src/commandStore';
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import { Footer } from '@/components/Footer';
import { ReservationStepper } from '@/components/ReservationStepper';
import { RestaurantInfo } from '@/components/RestaurantInfo';
import { MenuSelection } from '@/components/MenuSelection';
import { PaymentForm } from '@/components/PaymentForm';
import { Confirmation } from '@/components/Confirmation';

export default function ReservationPage() {
  const { id, reservationId } = useLocalSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { pendingCommands, updateReservationDetails } = useCommandStore();
  const { restaurants } = useRestaurantStore();

  const restaurant = restaurants.find(r => r.id === id);
  const command = pendingCommands.find(c => c.id === reservationId);

  useEffect(() => {
    if (!restaurant || !command) {
      router.replace('/');
    }
  }, [restaurant, command, router]);

  if (!restaurant || !command) {
    return null;
  }

  const steps = [
    { title: 'Info', component: RestaurantInfo },
    { title: 'Menu', component: MenuSelection },
    { title: 'Payment', component: PaymentForm },
    { title: 'Confirm', component: Confirmation },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle reservation completion
      router.replace(`/restaurant/${id}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <ReservationStepper steps={steps} currentStep={currentStep} />
        <CurrentStepComponent
          restaurant={restaurant}
          command={command}
          updateReservationDetails={updateReservationDetails}
        />
      </ScrollView>
      <Footer
        text={currentStep === steps.length - 1 ? 'Confirm Reservation' : 'Next Step'}
        buttonText={currentStep === 0 ? 'Continue to Menu Selection' : 'Continue'}
        onClickButton={handleNext}
        hideCounter counter={0} updateText={function (text: string): void {
        } } updateCounter={function (increment: boolean): void {
        } }      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    ...Platform.select({
      web: {
        marginBottom: 100,
      },
    }),
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

