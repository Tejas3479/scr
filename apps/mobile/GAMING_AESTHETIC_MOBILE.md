# 📱 React Native Solarpunk HUD Design Guide — Eco Farm v4.0

This guide details how to apply the **Solarpunk Cognitive HUD** aesthetic to the React Native mobile app in `apps/mobile/`.

---

## 🎨 Color System & Aurora Gradients

We use vibrant, high-contrast HSL gradients and cyber-glass backgrounds:
```javascript
export const SolarpunkColors = {
  bgDark: '#04080F',
  hudGreen: '#00FF41',
  neuroBlue: '#00F0FF',
  quantumGold: '#FFB800',
  warningRed: '#FF0055',
  
  gradients: {
    aurora: ['#00FF41', '#00F0FF'],
    telemetry: ['#FFB800', '#FF0055'],
  }
}
```

---

## 🧠 Brain-Computer Interface (BCI) Mobile HUD

The mobile screen incorporates a real-time floating BCI status overlay that monitors farmer focus:
```jsx
import React from 'react'
import { Text, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

export function BciFloatingIndicator({ attentionScore, stressLevel }) {
  const animatedGlow = useAnimatedStyle(() => ({
    shadowRadius: attentionScore * 15,
    opacity: 1.0 - stressLevel,
  }))

  return (
    <Animated.View style={[styles.hudBadge, animatedGlow]}>
      <Text style={styles.text}>BCI LINKED: {(attentionScore * 100).toFixed(0)}% FOCUS</Text>
    </Animated.View>
  )
}
```

---

## 📡 Edge SNN Outage Status Bar

Shows whether the edge PyTorch SNN engine is buffering local alerts due to a LoRaWAN backhaul failure:
```jsx
export function OutageStatusIndicator({ isOffline, bufferedCount }) {
  if (!isOffline) return null;
  return (
    <View style={styles.outageBar}>
      <Text style={styles.outageText}>LIF-SNN OFFLINE BUFFERING: {bufferedCount} PENDING ALERTS</Text>
    </View>
  )
}
```
