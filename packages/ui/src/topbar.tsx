import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommandStore } from '@repo/store/src/commandStore';
import { SideMenu } from './side-menu';


interface TopBarProps {
    onBack?: () => void;
    onHome?: () => void;
    onActionButton?: () => void;
    isChildRoute?: boolean;
}

export default function TopBar({
                                   onBack,
                                   onHome,
                                   onActionButton,
                                   isChildRoute
                               }: TopBarProps) {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const { pendingCommands, confirmedCommands } = useCommandStore();

    const openSideMenu = () => {
        setIsSideMenuOpen(true);
    };

    const totalCommands = pendingCommands.length + confirmedCommands.length;

    return (
        <>
            <SafeAreaView edges={['top']}>
                <View style={[styles.header]}>
                    {isChildRoute && onBack ? (
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <MaterialIcons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity onPress={onHome} style={styles.logoButton}>
                        <Image
                            source={require('../assets/images/LogoLong.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openSideMenu} style={styles.menuButton}>
                        <MaterialIcons name="menu" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={onActionButton}
                    >
                        <MaterialCommunityIcons name="shopping-outline" size={24} color="#000" />
                        {totalCommands > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{totalCommands}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {isSideMenuOpen && (
                <SideMenu
                    visible={isSideMenuOpen}
                    onClose={() => setIsSideMenuOpen(false)}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: Platform.OS === 'web' ? 64 : 56,
    },
    logoButton: {
        padding: 8,
        position: 'absolute',
        left: 5,
        display: Platform.OS === 'web' ? 'flex' : 'none',
    },
    logoImage: {
        width: 160,
        display: Platform.OS === 'web' ? 'flex' : 'none',
    },
    menuButton: {
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 50,
        marginRight: 8,
    },
    backButton: {
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 50,
        position: 'absolute',
        left: 16,
        zIndex: 10,
    },
    cartButton: {
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 50,
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FF8C00',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
});