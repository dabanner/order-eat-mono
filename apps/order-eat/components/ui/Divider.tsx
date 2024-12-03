import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Divider = ({ text }) => {
    return (
        <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>{text}</Text>
            <View style={styles.divider} />
        </View>
    );
};

const styles = StyleSheet.create({
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E5E5',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#666',
    },
});
