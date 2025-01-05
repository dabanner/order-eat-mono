import React from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TopBarProps {
  isPhone: boolean;
  isKidsMode?: boolean;
  onKidsModeToggle?: (value: boolean) => void;
}

const TopBar: React.FC<TopBarProps> = ({ isPhone, isKidsMode, onKidsModeToggle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <MaterialIcons name="restaurant-menu" size={24} color="#FF8C00" />
        <Text style={styles.title}>Menu</Text>
      </View>
      
      <View style={styles.rightSection}>
        <View style={styles.kidsModeContainer}>
          <MaterialIcons 
            name={isKidsMode ? "child-care" : "person"} 
            size={24} 
            color={isKidsMode ? "#f5dd4b" : "#666"} 
          />
          <Switch
            style={styles.switch}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isKidsMode ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onKidsModeToggle}
            value={isKidsMode}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kidsModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 20,
    gap: 8,
  },
  switch: {
    transform: Platform.OS === 'ios' ? [{ scale: 0.8 }] : [],
  }
});

export default TopBar; 