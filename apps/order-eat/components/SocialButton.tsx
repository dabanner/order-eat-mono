import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

export const SocialButton = ({ source, style, onPress }) => {
    return (
        <TouchableOpacity style={[styles.socialButton, style]} onPress={onPress}>
            <Image
                source={source}
                style={styles.socialIcon}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    socialButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIcon: {
        width: 34,
        height: 34,
    },
});
