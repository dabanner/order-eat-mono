import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from "react-native"

interface GenericModalProps {
  visible: boolean
  onClose: () => void
  image: string
  title: string
  description: string
  buttonText: string
  autoCloseTime?: number
  children?: React.ReactNode
  mode: "full" | "left-top" | "left-bottom" | "right-top" | "right-bottom"
}

const MODAL_WIDTH = 400
const MODAL_HEIGHT = 650

export function GenericModal({
  visible,
  onClose,
  image,
  title,
  description,
  buttonText,
  autoCloseTime = 0,
  children,
  mode = "full",
}: GenericModalProps) {
  const [countdown, setCountdown] = useState(autoCloseTime)
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (visible && autoCloseTime > 0) {
      setCountdown(autoCloseTime)
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            onClose()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [visible, autoCloseTime, onClose])

  const getModalPosition = () => {
    if (mode === "full") return {}
    switch (mode) {
      case "left-top":
        return { top: 300, right: 1300 }
      case "left-bottom":
        return { bottom: 300, right: 1300 }
      case "right-top":
        return { top: 300, right: 1300 }
      case "right-bottom":
        return { bottom: 300, right: 1300 }
      default:
        return { top: 0, left: 0 }
    }
  }

  const modalPosition = getModalPosition()

  const modalContent = (
    <View
      style={[
        styles.modalContent,
        styles.modalContentShadow,
        mode === "full" ? styles.fullModeContent : styles.sectionModeContent,
        mode !== "full" && { width: MODAL_WIDTH, height: MODAL_HEIGHT, ...modalPosition },
      ]}
    >
      <Image source={{ uri: image }} style={styles.illustration} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children}
      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>
          {buttonText} {autoCloseTime > 0 && `(${countdown}s)`}
        </Text>
      </TouchableOpacity>
    </View>
  )

  if (mode === "full") {
    return (
      <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
        <View style={[styles.overlay, styles.fullModeOverlay]}>{modalContent}</View>
      </Modal>
    )
  }

  return (
    <View style={[styles.overlay, styles.sectionModeOverlay, { display: visible ? "flex" : "none" }]}>
      {modalContent}
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fullModeOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionModeOverlay: {
    backgroundColor: "transparent",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  fullModeContent: {
    width: "90%",
    maxWidth: 400,
  },
  sectionModeContent: {
    position: "absolute",
  },
  illustration: {
    width: "100%",
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#121223",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  modalContentShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 20px 64px rgba(0, 0, 0, 0.75)",
      },
    }),
  },
})

