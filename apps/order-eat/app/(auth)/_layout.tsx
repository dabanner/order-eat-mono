import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (

        <Stack
            screenOptions={{
                headerShown: false,
                header: () => null,
                animation: 'fade',
            }}
        >
            <Stack.Screen
                name="login"
                options={{
                    headerShown: false,
                    header: () => null,
                }}
            />
            <Stack.Screen
                name="signup"
                options={{
                    headerShown: false,
                    header: () => null,
                }}
            />
        </Stack>

    );
}

