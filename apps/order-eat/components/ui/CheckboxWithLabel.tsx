import React from 'react';
import { Checkbox } from "@/components/ui/Checkbox";
import { Text, View, StyleSheet } from "react-native";

interface CheckboxWithLabelProps {
    label: string;
    checked: boolean;
    onValueChange: (value: boolean) => void;
}

export function CheckboxWithLabel({ label, checked, onValueChange }: CheckboxWithLabelProps) {
    return (
        <View style={styles.checkboxContainer}>
            <Checkbox
                checked={checked}
                onValueChange={onValueChange}
            />
            <Text style={styles.rememberText}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberText: {
        marginLeft: 8,
        color: '#666',
    },
});