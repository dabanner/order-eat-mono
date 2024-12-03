import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const InputField = ({
                               label,
                               placeholder,
                               secureTextEntry,
                               keyboardType,
                               autoCapitalize,
                               onChangeText,
                               rightIcon
                           }) => {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    onChangeText={onChangeText}
                />
                {rightIcon && (
                    <View style={styles.iconWrapper}>
                        {rightIcon}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        borderRadius: 8,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 16,
    },
    iconWrapper: {
        marginLeft: 8,
    },
});
