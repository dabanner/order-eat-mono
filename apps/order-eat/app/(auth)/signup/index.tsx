import React, { useState } from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { InputField } from "@/components/ui/InputField";
import { useRouter } from 'expo-router';
import { useUserStore} from "@repo/store/src/userStore";

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);

    const handleSignup = () => {
        // TODO: Implement actual signup logic
        if (password === repeatPassword) {
            setUser();
            router.replace('/');
        } else {
            // TODO
            console.log('Passwords do not match');
        }
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <ThemedView style={styles.container}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#121223', dark: '#121223' }}
                headerImage={
                    <ThemedView style={styles.headerContainer}>
                        <Image
                            source={require('@/assets/images/motif1.png')}
                            style={styles.motif1}
                        />
                        <View style={styles.headerContent}>
                            <ThemedText style={styles.headerTitle}>Sign Up</ThemedText>
                            <ThemedText style={styles.headerSubtitle}>
                                Please sign up to get started
                            </ThemedText>
                        </View>
                        <Image
                            source={require('@/assets/images/motif2.png')}
                            style={styles.motif2}
                        />
                    </ThemedView>
                }
            >
                <ThemedView style={styles.formContainer}>
                    <View>
                        <InputField
                            label="FULL NAME"
                            placeholder="Enter your full name"
                            value={name}
                            onChangeText={setName}
                        />
                        <InputField
                            label="EMAIL"
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <InputField
                            label="PASSWORD"
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            rightIcon={
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <ThemedText style={{ color: '#707070'}} >{showPassword ? 'Hide' : 'Show'}</ThemedText>
                                </TouchableOpacity>
                            }
                        />
                        <InputField
                            label="REPEAT PASSWORD"
                            placeholder="Repeat your password"
                            secureTextEntry={!showRepeatPassword}
                            value={repeatPassword}
                            onChangeText={setRepeatPassword}
                            rightIcon={
                                <TouchableOpacity onPress={() => setShowRepeatPassword(!showRepeatPassword)}>
                                    <ThemedText style={{ color: '#707070'}} >{showRepeatPassword ? 'Hide' : 'Show'}</ThemedText>
                                </TouchableOpacity>
                            }
                        />
                    </View>

                    <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                        <ThemedText style={styles.signupButtonText}>Sign Up</ThemedText>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <ThemedText style={styles.loginText}>Do you have an account? </ThemedText>
                        <TouchableOpacity onPress={handleLogin}>
                            <ThemedText style={styles.loginLink}>LOG IN</ThemedText>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            </ParallaxScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        height: 250, // Consistent height for both screens
        justifyContent: 'flex-start', // Changed from center
        alignItems: 'center',
        backgroundColor: '#121223',
        paddingTop: Platform.select({
            ios: 60, // Account for iOS status bar
            android: 50, // Account for Android status bar
            default: 40,
        }),
    },
    headerContent: {
        alignItems: 'center',
        height: 80, // Explicit height for the content
        justifyContent: 'center',
        marginTop: Platform.select({
            ios: 40,
            android: 40,
            default: 40,
        }),
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8, // Add consistent spacing
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.8,
    },
    motif1: {
        position: 'absolute',
        top: -50,
        left: -50,
        width: 130,
        height: 130,
    },
    motif2: {
        position: 'absolute',
        top: 0,
        right: -80,
        width: 200,
        height: 250,
    },
    formContainer: {
        padding: 34,
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
            },
            android: {
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
            },
            web: {
                borderTopLeftRadius: 54,
                borderTopRightRadius: 54,
                borderBottomLeftRadius: 54,
                borderBottomRightRadius: 54,
                marginHorizontal: 450,
            },
        }),
    },
    signupButton: {
        backgroundColor: '#F4804F',
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginText: {
        color: '#666',
    },
    loginLink: {
        color: '#F4804F',
        fontWeight: '600',
    },
});

