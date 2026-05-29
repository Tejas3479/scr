# FarmQuest Mobile - Gaming Aesthetic Implementation Guide

## 📱 React Native Gaming Aesthetic

This guide provides instructions for applying the Cyber-Agri gaming aesthetic to the React Native mobile app in `client/mobile/`.

---

## 🎨 Color System (React Native)

### Implementation with React Native

```javascript
// colors.js
export const CyberColors = {
  // Base Colors
  cyberDark: '#0D1117',
  cyberDarker: '#050810',
  
  // Neon Colors
  matrixGreen: '#00FF41',
  neonCyan: '#00F0FF',
  neonPurple: '#FF00FF',
  neonOrange: '#FF6B00',
  neonPink: '#FF006B',
  
  // Gradients (for LinearGradient component)
  gradients: {
    neon: ['#00FF41', '#00F0FF'],
    aurora: ['#FF00FF', '#00F0FF'],
    greenCyan: ['#00FF41', '#00F0FF'],
  }
}
```

---

## 🎯 Key Dependencies

### Required Packages
```json
{
  "react-native": "^0.72.0",
  "react-native-linear-gradient": "^2.8.0",
  "react-native-reanimated": "^3.3.0",
  "react-native-blur": "^4.3.0",
  "react-native-svg": "^13.9.0",
  "@react-navigation/native": "^6.1.0"
}
```

### Installation
```bash
npm install react-native-linear-gradient react-native-reanimated react-native-blur
npx pod-install  # For iOS
```

---

## 🎮 Component Patterns

### Pattern 1: Glassmorphism Effect

```jsx
import { View } from 'react-native'
import { BlurView } from '@react-native-blur/blur'

export function GlassCard({ children }) {
  return (
    <BlurView 
      style={styles.blurContainer}
      blurAmount={10}
      blurType="dark"
    >
      <View style={styles.card}>
        {children}
      </View>
    </BlurView>
  )
}

const styles = {
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
  },
  card: {
    padding: 16,
    backgroundColor: 'rgba(13, 17, 23, 0.4)',
  }
}
```

### Pattern 2: Neon Text Glow

```jsx
import { View, Text, StyleSheet } from 'react-native'
import { Shadow } from 'react-native-shadow-2'

export function NeonText({ text, color = 'green' }) {
  const glowColor = {
    green: 'rgba(0, 255, 65, 0.8)',
    cyan: 'rgba(0, 240, 255, 0.8)',
    purple: 'rgba(255, 0, 255, 0.8)',
  }[color]

  return (
    <Shadow
      distance={15}
      startColor={glowColor}
      adjustsFontSizeToFit={true}
    >
      <Text style={[
        styles.neonText,
        {
          color: color === 'green' ? '#00FF41' : 
                 color === 'cyan' ? '#00F0FF' : '#FF00FF'
        }
      ]}>
        {text}
      </Text>
    </Shadow>
  )
}

const styles = StyleSheet.create({
  neonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Courier New', // Monospace alternative for mobile
  }
})
```

### Pattern 3: Gaming Gradient Button

```jsx
import { TouchableOpacity, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

export function GamingButton({ title, onPress, color = 'green' }) {
  const gradientColors = {
    green: ['#00FF41', '#00F0FF'],
    purple: ['#FF00FF', '#FF006B'],
    orange: ['#FF6B00', '#FF00FF'],
  }[color]

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0D1117',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
})
```

### Pattern 4: Animated HUD Card

```jsx
import { View, Text } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

export function AnimatedHUDCard({ title, value }) {
  const opacity = useSharedValue(0.5)

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    shadowOpacity: opacity.value * 0.5,
  }))

  return (
    <Animated.View style={[styles.hudCard, animatedStyle]}>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  hudCard: {
    backgroundColor: 'rgba(13, 17, 23, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  label: {
    color: 'rgba(0, 255, 65, 0.7)',
    fontSize: 11,
    fontFamily: 'Courier New',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    color: '#00FF41',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 255, 65, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  }
})
```

---

## 🎬 Mobile Animations

### Level Up Alert

```jsx
import { View, Text } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

export function LevelUpAlert({ level }) {
  const scale = useSharedValue(0)
  const rotate = useSharedValue(0)

  React.useEffect(() => {
    scale.value = withSpring(1, { damping: 5, mass: 1 })
    rotate.value = withSequence(
      withTiming(360, { duration: 800 })
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` }
    ]
  }))

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.title}>LEVEL UP!</Text>
      <Text style={styles.level}>{level}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13, 17, 23, 0.9)',
    borderWidth: 2,
    borderColor: '#00FF41',
    borderRadius: 20,
    padding: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00FF41',
    textShadowColor: 'rgba(0, 255, 65, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  level: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#00FF41',
    marginTop: 20,
  }
})
```

---

## 📱 Complete Screen Template

```jsx
import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { BlurView } from '@react-native-blur/blur'

export function GamingScreenTemplate() {
  return (
    <LinearGradient
      colors={['#0D1117', '#050810']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>FARMQUEST NEXUS</Text>
          <Text style={styles.subtitle}>v2.0 CYBER-AGRI</Text>
        </View>

        {/* Glass Card Section */}
        <View style={styles.cardSection}>
          <BlurView
            style={styles.blurContainer}
            blurAmount={10}
            blurType="dark"
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>YOUR STATS</Text>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>LEVEL</Text>
                <Text style={styles.statValue}>8</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>XP</Text>
                <Text style={styles.statValue}>7,250</Text>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBar, { width: '75%' }]} />
              </View>
            </View>
          </BlurView>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 65, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00FF41',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 255, 65, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(0, 255, 65, 0.5)',
    letterSpacing: 1,
    marginTop: 4,
  },
  cardSection: {
    padding: 16,
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
  },
  card: {
    backgroundColor: 'rgba(13, 17, 23, 0.5)',
    padding: 20,
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgba(0, 255, 65, 0.7)',
    fontFamily: 'Courier New',
    letterSpacing: 1,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 65, 0.1)',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(0, 240, 255, 0.7)',
    fontFamily: 'Courier New',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FF41',
    textShadowColor: 'rgba(0, 255, 65, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00FF41',
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  }
})
```

---

## 🚀 Best Practices for Mobile

### 1. **Performance Optimization**
```javascript
// Use memoization for heavy components
const GamingCard = React.memo(({ title, value }) => (
  // Component code
))

// Lazy load animations
const AnimationComponent = React.lazy(() => 
  import('./AnimationComponent')
)
```

### 2. **Responsive Design**
```javascript
import { useWindowDimensions } from 'react-native'

export function ResponsiveCard() {
  const { width } = useWindowDimensions()
  const isSmall = width < 375
  
  return (
    <View style={{
      padding: isSmall ? 12 : 20,
      borderRadius: isSmall ? 6 : 12,
    }}>
      {/* Content */}
    </View>
  )
}
```

### 3. **Accessibility**
```javascript
<View
  accessible={true}
  accessibilityLabel="Level up notification"
  accessibilityHint="You have reached level 8"
>
  <Text>LEVEL UP: 8</Text>
</View>
```

### 4. **Touch Feedback**
```javascript
<TouchableOpacity 
  activeOpacity={0.7}
  onPress={handlePress}
>
  <LinearGradient
    colors={['#00FF41', '#00F0FF']}
    style={styles.button}
  >
    <Text>PRESS ME</Text>
  </LinearGradient>
</TouchableOpacity>
```

---

## 📊 Platform Differences

| Feature | Web | Mobile |
|---------|-----|--------|
| Glass Effect | `backdrop-filter` | `BlurView` |
| Text Glow | `text-shadow` | `Shadow` component |
| Gradients | Tailwind/CSS | `LinearGradient` |
| Animations | Framer Motion | Reanimated |
| Icons | SVG | SVG or Custom |

---

## 🔄 Sync with Web Design System

To keep mobile and web consistent:

1. **Use Same Color Constants**
   - Export from shared `constants/colors.js`
   - Apply to both platforms

2. **Mirror Component Structure**
   - Same component hierarchy
   - Same prop interfaces
   - Same animation timings

3. **Test Across Devices**
   - iPhone SE (320px) to iPhone 15 Pro Max (430px)
   - Android devices (various sizes)
   - Tablets (iPad, Android)

---

## 📚 Additional Resources

### React Native Libraries
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Blur](https://github.com/react-native-blur/react-native-blur)
- [React Native Linear Gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient)
- [React Native SVG](https://github.com/react-native-svg/react-native-svg)

### Performance
- Use `FlatList` for large lists
- Implement `SectionList` for grouped data
- Profile with React DevTools Profiler
- Use `InteractionManager` for heavy operations

---

## ✅ Mobile Implementation Checklist

- [ ] Install required dependencies
- [ ] Create color constants file
- [ ] Implement glass card component
- [ ] Create neon text component
- [ ] Build gradient button component
- [ ] Implement animations
- [ ] Test on iOS devices
- [ ] Test on Android devices
- [ ] Performance profile (60fps target)
- [ ] Accessibility audit
- [ ] Dark mode verification

---

## 🎮 Next Steps

1. Start with `GlassCard` pattern
2. Build `NeonText` wrapper
3. Create `GamingButton` component
4. Implement `AnimatedHUDCard`
5. Build complete screens using templates
6. Test performance on real devices
7. Gather user feedback
8. Iterate and improve

---

**Version**: 1.0 (Mobile)  
**Framework**: React Native  
**Last Updated**: January 2026  
**Status**: Ready for Implementation
