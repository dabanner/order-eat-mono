import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SideMenu } from './side-menu';
import { usePathname, useRouter } from 'expo-router';
import CustomSwitch from 'react-native-custom-switch-new';

interface TopBarProps {
    onHome?: () => void;
    onActionButton?: () => void;
    isStandard?: boolean;
    isTablet?: boolean;
    isKidsMode?: boolean;
    totalItems?: number;
    onKidsModeToggle?: (value: boolean) => void;
    visible?: boolean;
    backable?: string[];
}

export default function TopBar({
    onHome,
    onActionButton,
    isStandard,
    isTablet,
    isKidsMode,
    totalItems,
    onKidsModeToggle,
    visible = true,
    backable,
}: TopBarProps) {
    const router = useRouter();
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const pathname = usePathname();
    const openSideMenu = () => {
        setIsSideMenuOpen(true);
    };

    return (
        (visible) &&
        <>
            <SafeAreaView edges={['top']}>
                <View style={[styles.header]}>
                    {((pathname.split('/').length > 2 ||backable?.includes(pathname.split('/')[1]))&& Platform.OS!='web') && (
                        <TouchableOpacity onPress={() => router.back()}  style={styles.backButton}>
                            <MaterialIcons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={onHome} style={styles.logoButton}>
                        <Image
                            source={require('../assets/images/LogoLong.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    { !isKidsMode && onActionButton ? (
                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={onActionButton}
                        >
                        <MaterialCommunityIcons name="shopping-outline" size={24} color="#000" />
                        {totalItems!=undefined && totalItems > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{totalItems}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    ) : null }
                    {isStandard ? (

                        <TouchableOpacity onPress={openSideMenu} style={styles.menuButton}>
                            <MaterialIcons name="menu" size={24} color="#000" />
                        </TouchableOpacity>
                    ) : null }
                    { isTablet ? (
                        <View style={styles.rightSection}>
                            <View style={styles.kidsModeContainer}>
                            <CustomSwitch 
                                buttonColor={'#FFFFFF'}
                                switchBackgroundColor={'#BB4430'}
                                onSwitchBackgroundColor={'#7EBDC2'}
                                switchLeftText={"‍👶"}
                                switchRightText={"👨"}
                                onSwitch={() => onKidsModeToggle?.(true)}
                                onSwitchReverse={() => onKidsModeToggle?.(false)}
                                startOnLeft={false}
                                />
                            </View>
                        </View>
                    ) : null }
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
