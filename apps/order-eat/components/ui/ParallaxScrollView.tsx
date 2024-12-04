import type { PropsWithChildren, ReactElement } from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ui/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
    headerImage: ReactElement;
    headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
                                               children,
                                               headerImage,
                                               headerBackgroundColor,
                                           }: Props) {
    const colorScheme = useColorScheme() ?? 'light';
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);
    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
                },
            ],
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.header,
                    { backgroundColor: headerBackgroundColor[colorScheme] },
                    headerAnimatedStyle,
                ]}>
                {headerImage}
            </Animated.View>
            <Animated.ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
            >
                <ThemedView style={styles.content}>{children}</ThemedView>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: HEADER_HEIGHT,
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        zIndex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    content: {
        minHeight: '100%',
        ...Platform.select({
            ios: {
                backgroundColor: '#FFFFFF',
            },
            android: {
                backgroundColor: '#FFFFFF',
            },
            web: {
                backgroundColor: '#121223',
            },
        }),
    },
});
