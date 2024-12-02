import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckboxProps {
    checked: boolean;
    onValueChange: (value: boolean) => void;
}

export function Checkbox({ checked, onValueChange }: CheckboxProps) {
    console.log("onValueChange:", onValueChange); // Debugging log
    return (
        <TouchableOpacity onPress={() => onValueChange(!checked)}>
            <View style={[styles.checkbox, checked && styles.checked]}>
                {checked && <Check size={16} color="#FFFFFF" />}
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#666',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: '#F4804F',
        borderColor: '#F4804F',
    },
});

