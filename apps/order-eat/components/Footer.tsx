import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FooterProps {
    text: string;
    counter: number;
    buttonText: string;
    updateText: (text: string) => void;
    updateCounter: (increment: boolean) => void;
    onClickButton: () => void;
}

export const Footer: React.FC<FooterProps> = ({
    text,
    counter,
    buttonText,
    updateText,
    updateCounter,
    onClickButton,
}) => {
    return (
        <View style={styles.footerContainer}>
            <View style={styles.footerContent}>
                <View style={styles.footer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.price}>{text}</Text>
                    </View>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateCounter(false)}
                        >
                            <MaterialIcons name="remove" size={20} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{counter}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateCounter(true)}
                        >
                            <MaterialIcons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={onClickButton}>
                    <Text style={styles.addButtonText}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        position: Platform.OS === 'web' ? 'fixed' : 'relative',
        bottom: 0,
        left: Platform.OS === 'web' ? '25%' : 0,
        right: Platform.OS === 'web' ? '25%' : 0,
        backgroundColor: 'transparent',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        width: Platform.OS === 'web' ? '50%' : '100%',
        zIndex: 1000,
    },
    footerContent: {
        backgroundColor: '#F0F5FA',
        borderRadius: Platform.OS === 'web' ? 24 : 0,
        padding: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    currency: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        marginRight: 2,
    },
    price: {
        fontSize: 32,
        fontWeight: '600',
        color: '#1A1A1A',
        marginLeft: Platform.OS === 'web' ? 5 : 0,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        borderRadius: 30,
        padding: 4,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FF8C00',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantity: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 20,
    },
    addButton: {
        backgroundColor: '#FF8C00',
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 16,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

