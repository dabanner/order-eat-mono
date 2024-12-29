import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommandStore } from '@repo/store/src/commandStore';
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import { Footer } from '@/components/Footer';
import { ReservationStepper } from '@/components/ReservationStepper';
import { ReservationForm } from '@/components/ReservationForm';
import { MenuSelection } from '@/components/MenuSelection';
import { PaymentForm } from '@/components/PaymentForm';
import { Confirmation } from '@/components/Confirmation';

export default function ReservationPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { addCommand } = useCommandStore();
  const { restaurants } = useRestaurantStore();

  const restaurant = restaurants.find(r => r.id === id);

  const [command, setCommand] = useState(() => {
    if (restaurant) {
      return {
        restaurant,
        userId: 'user123', // Replace with actual user ID
        reservationDetails: {
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          numberOfPersons: 1,
          type: 'dinein' as const,
          wantToPreOrder: false,
        },
        menuItems: [],
        totalAmount: 0,
        status: 'pending' as const,
        type: 'dinein' as const,
      };
    }
    return null;
  });

  useEffect(() => {
    if (!restaurant) {
      router.replace('/');
    }
  }, [restaurant, router]);

  if (!restaurant || !command) {
    return null;
  }

  const steps = [
    { title: 'Info', component: ReservationForm },
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
      addCommand(command);
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

  const handleUpdateReservationDetails = (details: Partial<typeof command.reservationDetails>) => {
    setCommand(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        reservationDetails: { ...prev.reservationDetails, ...details },
      };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <ReservationStepper steps={steps} currentStep={currentStep} />
        {currentStep === 0 ? (
          <ReservationForm
            initialDetails={command.reservationDetails}
            onUpdate={handleUpdateReservationDetails}
          />
        ) : (
          <CurrentStepComponent
            restaurant={restaurant}
            command={command}
            updateReservationDetails={handleUpdateReservationDetails}
          />
        )}
      </ScrollView>
      <Footer
        text={currentStep === steps.length - 1 ? 'Confirm Reservation' : 'Next Step'}
        buttonText={currentStep === 0 ? 'Start Reservation' : 'Continue'}
        onClickButton={handleNext}
        updateText={() => {}}
        updateCounter={() => {}}
        counter={1}
        hideCounter
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    ...Platform.select({
      web: {
        marginBottom: 200,
      },
    }),
  },
  content: {
    flex: 1,
    paddingHorizontal: Platform.OS === 'web' ? 100 : 20,
    paddingVertical: 20,
  },
});

