import type React from "react"
import { View, type ViewProps } from "react-native"
import { GestureDetector, Gesture } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

interface MultiTouchProps extends ViewProps {
  children: React.ReactNode
  onTouchStart?: () => void
  sectionId: number
}

export const MultiTouch: React.FC<MultiTouchProps> = ({ children, style, onTouchStart, sectionId, ...props }) => {
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const translateY = useSharedValue(0)
  const savedTranslateY = useSharedValue(0)

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      onTouchStart?.()
    })
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale
    })
    .onEnd(() => {
      savedScale.value = scale.value
    })

  const panGesture = Gesture.Pan()
    .onStart(() => {
      onTouchStart?.()
    })
    .onUpdate((event) => {
      translateY.value = savedTranslateY.value + event.translationY
    })
    .onEnd(() => {
      savedTranslateY.value = translateY.value
    })

  const composed = Gesture.Simultaneous(pinchGesture, panGesture)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }, { translateY: withSpring(translateY.value) }],
  }))

  return (
    <View style={style} {...props}>
      <GestureDetector gesture={composed}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  )
}

