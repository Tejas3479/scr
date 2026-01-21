# Cyber-Agri Theme Quick Reference Guide

## Quick Start

### Web (Next.js)
```tsx
// Import the GlassCard component
import GlassCard, { GlassCardHeader, GlassCardContent } from '@/components/GlassCard'
import { COLORS } from '@/styles/theme'

// Use it
<GlassCard glowColor="green">
  <GlassCardHeader title="Your Title" />
  <GlassCardContent>Content here</GlassCardContent>
</GlassCard>
```

### Mobile (React Native)
```tsx
import { glassCardStyle, dataDisplayStyle, COLORS } from '@/theme'
import { View, Text } from 'react-native'

<View style={glassCardStyle}>
  <Text style={dataDisplayStyle}>Data</Text>
</View>
```

## Color Quick Reference

| Purpose | Color | Hex Value | Class Name |
|---------|-------|-----------|-----------|
| Yield/Health Data | Matrix Green | `#00FF41` | `neon-green` |
| Water/Tech Metrics | Neon Cyan | `#00F0FF` | `neon-cyan` |
| Achievements | Neon Purple | `#FF00FF` | `neon-purple` |
| Warnings | Neon Orange | `#FF6B00` | `neon-orange` |
| Alerts | Neon Pink | `#FF006B` | `neon-pink` |
| Background | Dark | `#0D1117` | `cyber-dark` |

## Typography Quick Reference

### Data Display (Numerical Values)
```tsx
// Web
<p className="tech-mono font-bold text-neon-green text-lg">95.2%</p>

// Mobile
<Text style={dataDisplayStyle}>95.2%</Text>
```

### Narrative Text (Descriptions)
```tsx
// Web
<p className="font-display text-gray-300">Farm status description</p>

// Mobile
<Text style={narrativeTextStyle}>Farm status description</Text>
```

### Headings
```tsx
// Web
<h2 className="tech-display text-2xl text-neon-cyan">Heading</h2>

// Mobile
<Text style={headingStyle}>Heading</Text>
```

## Glass Card Variants

### Cyan Glow (Default - Tech/Water)
```tsx
<GlassCard glowColor="cyan">
```

### Green Glow (Data/Health)
```tsx
<GlassCard glowColor="green">
```

### Purple Glow (Achievements)
```tsx
<GlassCard glowColor="purple">
```

### Card Elevation
```tsx
<GlassCard variant="default">    {/* Basic glass effect */}
<GlassCard variant="elevated">   {/* Enhanced with more blur */}
<GlassCard variant="panel">      {/* Panel style with green accent */}
```

## Common Component Patterns

### Data Widget
```tsx
<GlassCard glowColor="green">
  <GlassCardHeader title="Yield Prediction" />
  <GlassCardContent>
    <p className="tech-mono text-neon-green text-2xl">+24.3%</p>
    <p className="text-sm text-gray-400">Next harvest increase</p>
  </GlassCardContent>
</GlassCard>
```

### Alert/Warning Card
```tsx
<GlassCard glowColor="orange" interactive>
  <GlassCardHeader title="Action Required" />
  <GlassCardContent>
    <p className="text-neon-orange">Water level below threshold</p>
  </GlassCardContent>
</GlassCard>
```

### Interactive Card
```tsx
<GlassCard glowColor="cyan" interactive>
  <GlassCardContent>
    <p className="text-neon-cyan">Click for details</p>
  </GlassCardContent>
</GlassCard>
```

## Animation Classes

### Pulsing Glow
```html
<div class="animate-glow-pulse">
  <!-- Glowing pulse effect -->
</div>
```

### Data Readout Animation
```html
<span class="data-readout animate-data-pulse">
  <!-- Data with pulsing glow -->
</span>
```

### Level Up Effect
```tsx
<motion.div
  animate={{ opacity: 1 }}
  className="animate-level-up"
>
```

## Tailwind Utility Classes

### Background
```html
<div class="bg-cyber-dark">       {/* Primary background */}
<div class="bg-neon-glow-green">  {/* Green glow background */}
<div class="bg-hud-glass">        {/* Glass effect background */}
```

### Text Colors
```html
<p class="text-neon-green">   {/* Matrix green text */}
<p class="text-neon-cyan">    {/* Cyan text */}
<p class="text-gray-400">     {/* Secondary text */}
```

### Borders
```html
<div class="border border-neon-cyan/30">     {/* Cyan border */}
<div class="border border-neon-green/40">    {/* Green border */}
<div class="border border-glow-cyan">        {/* Glowing border */}
```

### Shadows
```html
<div class="shadow-neon-green">  {/* Green glow shadow */}
<div class="shadow-neon-cyan">   {/* Cyan glow shadow */}
<div class="shadow-hud-glow">    {/* HUD glow shadow */}
```

### Backdrop Filters
```html
<div class="backdrop-blur-[10px]">  {/* Standard blur */}
<div class="backdrop-glass">        {/* 10px blur (custom) */}
<div class="backdrop-glass-thick">  {/* 20px blur (custom) */}
```

## Mobile Stylesheet Usage

```tsx
import { StyleGuide } from '@/theme'

<View style={StyleGuide.screenContainer}>
  <View style={StyleGuide.glassCard}>
    <Text style={StyleGuide.dataDisplay}>95.2%</Text>
  </View>
</View>
```

## Creating Custom Colors

### Web
```tsx
import { hexToRgba, getGlowColor } from '@/styles/theme'

const customRgba = hexToRgba('#00FF41', 0.3)
const glowSettings = getGlowColor('green')
```

### Mobile
```tsx
import { COLORS, getGlowColor } from '@/theme'

const textColor = COLORS.neon.green
const glowColor = getGlowColor('cyan')
```

## Font Family Usage

### Web (Tailwind)
```html
<p class="font-tech">95.2%</p>          {/* JetBrains Mono */}
<p class="font-display">Heading</p>     {/* Inter */}
```

### Mobile (React Native)
```tsx
fontFamily: FONTS.family.mono   // 'JetBrains Mono'
fontFamily: FONTS.family.sans   // 'Inter'
```

## Responsive Breakpoints

Use Tailwind breakpoints as normal:
```tsx
<div class="hidden md:block">          {/* Show on medium+ screens */}
<p class="text-sm md:text-base lg:text-lg">  {/* Responsive text */}
```

## Dark Mode

The entire theme is dark mode by default. No light mode toggle is currently implemented.

## Performance Tips

1. **Prefer** `animate-glow-pulse` for continuous effects
2. **Avoid** applying blur to large containers
3. **Use** CSS classes instead of inline styles when possible
4. **Optimize** animations with `will-change: transform`

## Debugging

### Check Active Colors
```tsx
// Web
console.log(COLORS.neon.green) // #00FF41

// Mobile
console.log(COLORS.neon.cyan)  // #00F0FF
```

### Verify Glass Effect
```tsx
// Should have these properties:
- backgroundColor with rgba
- backdropFilter with blur
- border with neon color
```

## Common Issues

**Text not glowing?**
- Add `text-shadow` class or use `neon-glow-*` classes

**Border not visible?**
- Use `border-neon-*/30` or higher opacity (40-50%)

**Blur effect not working?**
- Ensure parent has `overflow-hidden` or `overflow-auto`

**Colors look wrong?**
- Verify exact hex values match the theme

## Related Files

- Main theme: `client/web/src/styles/theme.ts`
- Components: `client/web/src/components/GlassCard.tsx`
- Globals: `client/web/src/app/globals.css`
- Tailwind: `client/web/tailwind.config.js`
- Mobile: `client/mobile/src/theme/theme.ts`
- Full docs: `CYBER_AGRI_THEME.md`
