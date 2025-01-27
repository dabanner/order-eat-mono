import React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface WelcomeScreenProps {
  onSubmit: (name: string) => void
}

export function WelcomeScreen({ onSubmit }: WelcomeScreenProps) {
  const handleStart = () => {
    // Generate a default guest name
    const guestName = `Guest${Math.floor(Math.random() * 1000)}`
    onSubmit(guestName)
  }

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <Image
            source={{
            uri: "https://img.freepik.com/vecteurs-libre/gens-mangent-dans-illustration-du-concept-du-restaurant_114360-23005.jpg",
            }} style={styles.illustration}
        />
        <Image source={require("../../assets/images/LogoLong.png")} style={styles.illustration} />

        <Text style={styles.title}>Welcome to OrderEat!</Text>
        <Text style={styles.subtitle}>Your delicious journey begins here</Text>

        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Click to Start</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  logoAccent: {
    color: "#FF8C00",
  },
  illustration: {
    width: 600,
    height: 240,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF8C00",
    borderRadius: 16,
    padding: 20,
    paddingHorizontal: 32,
    gap: 12,
    ...Platform.select({
      web: {
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
          backgroundColor: "#ff9919",
          transform: "translateY(-2px)",
        },
        ":active": {
          transform: "translateY(0)",
        },
      },
    }),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 4px 14px rgba(255, 140, 0, 0.3)",
      },
    }),
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
})

