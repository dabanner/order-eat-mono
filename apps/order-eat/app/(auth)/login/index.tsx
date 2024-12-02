import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { CheckboxWithLabel } from "@/components/CheckboxWithLabel";
import { SocialButton } from "@/components/SocialButton";
import { InputField } from "@/components/InputField";
import { Divider } from "@/components/Divider";
import { useRouter } from 'expo-router';
import { useUserStore } from '../../../store/userStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = () => {
    // TODO: Implement actual login logic
    setUser();
    router.replace('/');
  };

  const handleForgotPassword = () => {
    // TODO
    console.log('Forgot password pressed');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    // TODO
    console.log(`${provider} login pressed`);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#121223', dark: '#121223' }}
      headerImage={
        <ThemedView style={styles.headerContainer}>
          <Image
            source={require('@/assets/images/motif1.png')}
            style={styles.motif1}
          />
          <View style={styles.headerContent}>
            <ThemedText style={styles.headerTitle}>Log In</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Please sign in to your existing account
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
        </View>

        <View style={styles.rememberForgotContainer}>
          <CheckboxWithLabel
            label="Remember me"
            checked={rememberMe}
            onValueChange={setRememberMe}
          />
          <TouchableOpacity onPress={handleForgotPassword}>
            <ThemedText style={styles.forgotPassword}>Forgot Password?</ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <ThemedText style={styles.loginButtonText}>LOG IN</ThemedText>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <ThemedText style={styles.signupText}>Don't have an account? </ThemedText>
          <TouchableOpacity onPress={handleSignUp}>
            <ThemedText style={styles.signupLink}>SIGN UP</ThemedText>
          </TouchableOpacity>
        </View>

        <Divider text="Or" />

        <View style={styles.socialContainer}>
          <SocialButton
            source={require('@/assets/images/gmail.png')}
            style={styles.gmail}
            onPress={() => handleSocialLogin('google')}
          />
          <SocialButton
            source={require('@/assets/images/apple.png')}
            style={[styles.apple]}
            onPress={() => handleSocialLogin('apple')}
          />
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121223',
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
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
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    rememberForgotContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    forgotPassword: {
        color: '#F4804F',
    },
    loginButton: {
        backgroundColor: '#F4804F',
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    signupText: {
        color: '#666',
    },
    signupLink: {
        color: '#F4804F',
        fontWeight: '600',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    gmail: {
        backgroundColor: '#dcdcdc',
    },
    apple: {
        backgroundColor: '#dcdcdc',
    },
});
