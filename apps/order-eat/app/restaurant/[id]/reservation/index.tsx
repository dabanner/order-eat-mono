import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommandStore } from '@repo/store/src/commandStore';
import { useRestaurantStore, MenuItem } from '@repo/store/src/restaurantStore';
import { Footer } from '@/components/Footer';
import { ReservationStepper } from '@/components/ReservationStepper';
import { ReservationForm } from '@/components/ReservationForm';
import { MenuList } from '@/components/MenuList';
import { PaymentForm } from '@/components/PaymentForm';
import { Confirmation } from '@/components/Confirmation';
import { useFoodCategoryStore, FoodCategory } from '@repo/store/src/foodCaregoryStore';

export default function ReservationPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { addCommand } = useCommandStore();
  const { restaurants } = useRestaurantStore();
  const { getFoodCategoryById } = useFoodCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const restaurant = restaurants.find(r => r.id === id);

  const [command, setCommand] = useState(() => {
    if (restaurant) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        restaurant,
        userId: 'user123',
        reservationDetails: {
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          numberOfPersons: 1,
          type: 'dinein' as 'dinein' | 'takeaway',
          wantToPreOrder: false,
        },
        menuItems: [] as (MenuItem & { quantity: number })[],
        totalAmount: 0,
        status: 'pending' as 'pending' | 'confirmed',
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

  const categories = restaurant.menuItems
    ? Array.from(
        new Set(restaurant.menuItems.map((item) => item.foodCategoryId))
      ).map((categoryId) => {
        const category = getFoodCategoryById(categoryId);
        return {
          id: categoryId,
          name: category?.name || 'Unknown',
          price: category?.price || 0,
          image: category?.image || '',
        };
      })
    : [];

  const filteredMenuItems = selectedCategory
    ? restaurant.menuItems.filter((item) => item.foodCategoryId === selectedCategory.id)
    : restaurant.menuItems;

  const handleCategorySelect = (category: FoodCategory | null) => {
    setSelectedCategory(category);
  };

  const handleMenuItemClick = useCallback((itemId: string) => {
    const menuItem = restaurant.menuItems.find(item => item.id === itemId);
    if (!menuItem) return;

    setCommand(prev => {
      if (!prev) return prev;

      const existingItem = prev.menuItems.find(item => item.id === itemId);
      let updatedMenuItems;

      if (existingItem) {
        updatedMenuItems = prev.menuItems.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedMenuItems = [...prev.menuItems, { ...menuItem, quantity: 1 }];
      }

      const totalAmount = updatedMenuItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        ...prev,
        menuItems: updatedMenuItems,
        totalAmount,
      };
    });
  }, [restaurant.menuItems]);

  const steps = [
    { title: 'Info', component: ReservationForm },
    { title: 'Menu', component: MenuList },
    { title: 'Payment', component: PaymentForm },
    { title: 'Confirm', component: Confirmation },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } 
    else {
      command.status = 'confirmed';
      router.replace(`/reservation`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleUpdateReservationDetails = useCallback((details: Partial<typeof command.reservationDetails>) => {
  setCommand(prev => {
    if (!prev) return prev;
    return {
      ...prev,
      reservationDetails: { ...prev.reservationDetails, ...details },
    };
  });
}, []);

  const renderCurrentStep = () => {
    if (currentStep === 0) {
      return (
        <ReservationForm
          initialDetails={command.reservationDetails}
          onUpdate={handleUpdateReservationDetails}
        />
      );
    } else if (currentStep === 1) {
      return (
        <View style={styles.menuContainer}>
          <MenuList 
            menuItems={filteredMenuItems}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            onItemClick={handleMenuItemClick}
            selectedItems={command.menuItems}
            restaurant={restaurant}
            showAddButton={true}
          />
        </View>
      );
    } else {
      const CurrentStepComponent = steps[currentStep].component as React.ComponentType<any>;
      return (
        <CurrentStepComponent
          restaurant={restaurant}
          command={command}
          updateReservationDetails={handleUpdateReservationDetails}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <ReservationStepper 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={(step) => {
            if (step < currentStep) {
              setCurrentStep(step);
            }
          }}
        />
        {renderCurrentStep()}
      </ScrollView>
      <Footer
        text={currentStep === 1 ? `Total: $${command.totalAmount.toFixed(2)}` : currentStep === steps.length - 1 ? 'See your reservations' : 'Next Step'}
        buttonText={currentStep === 0 ? 'Start Reservation' : 'Continue'}
        onClickButton={handleNext}
        updateText={() => {}}
        updateCounter={() => {}}
        counter={command.menuItems.reduce((sum, item) => sum + item.quantity, 0)}
        hideCounter={currentStep !== 1}
      />
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
    paddingHorizontal: Platform.OS === 'web' ? 100 : 20,
    paddingVertical: 20,
  },
  menuContainer: {
    flex: 1,
    ...Platform.select({
      web: {
        marginBottom: 200,
      },
    }),
  }
});

