import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

interface Step {
  title: string;
  component: React.ComponentType<any>;
}

interface ReservationStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const ReservationStepper: React.FC<ReservationStepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <TouchableOpacity 
            key={index}
            onPress={() => index < currentStep ? onStepClick(index) : undefined}
            style={[
              styles.stepCircle,
              index <= currentStep && styles.activeStep,
              index < currentStep && styles.clickableStep
            ]}
          >
            <Text style={[styles.stepNumber, index <= currentStep && styles.activeStepNumber]}>
              {index + 1}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.stepTitle, index <= currentStep && styles.activeStepTitle]}>
            {step.title}
          </Text>
          {index < steps.length - 1 && <View style={[styles.stepLine, index < currentStep && styles.activeStepLine]} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#FF8C00',
  },
  clickableStep: {
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  stepNumber: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeStepNumber: {
    color: '#fff',
  },
  stepTitle: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  activeStepTitle: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  stepLine: {
    position: 'absolute',
    top: 15,
    right: -50,
    width: 100,
    height: 2,
    backgroundColor: '#E5E7EB',
    zIndex: -1,
  },
  activeStepLine: {
    backgroundColor: '#FF8C00',
  },
});

