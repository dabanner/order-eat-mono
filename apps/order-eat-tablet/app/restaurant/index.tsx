import TopBar from "@repo/ui/src/topbar";
import Categories from "@repo/ui/src/categories";
import { Platform, SafeAreaView, ScrollView, StyleSheet } from "react-native";

export default function RestaurantScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={Platform.OS === 'web'}
            >
                <TopBar isPhone={false}></TopBar>
                <Categories></Categories>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingTop: 0,
        maxWidth: '100%',
        width: '100%',
        marginHorizontal: 'auto',
    },
})