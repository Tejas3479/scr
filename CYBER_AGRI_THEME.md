# Cyber-Agri Gaming Aesthetic Theme Implementation

## Overview

The Eco Farm application uses a "Cyber-Agri" solarpunk aesthetic with a dark mode gaming interface inspired by cyberpunk HUD designs and agricultural technology visualization.

## Color Palette

### Core Theme
- **Background**: `#0D1117` (Deep Space Charcoal) - Primary dark background
- **Darker Background**: `#050810` - Secondary darker backgrounds
- **Text Primary**: `#E0E0E0` - Main text color

### Neon Data Colors
- **Matrix Green**: `#00FF41` - Yield/health data, primary accent
- **Neon Cyan**: `#00F0FF` - Water metrics, tech indicators
- **Neon Purple**: `#FF00FF` - Secondary accent
- **Neon Orange**: `#FF6B00` - Warnings, secondary data
- **Neon Pink**: `#FF006B` - Alerts, tertiary accent

## Typography

### Font Families
- **JetBrains Mono** - For all numerical data and HUD elements
  - Used for: Data displays, metrics, timestamps, technical information
  - Weight: 500-700 (semibold to bold)
  - Letter spacing: Wide (0.05em - 0.1em)

- **Inter** - For narrative text and UI labels
  - Used for: Descriptions, headings, body text, buttons
  - Weight: 400-700 (regular to bold)
  - Letter spacing: Normal to slightly tight

### Font Sizes (Tailwind)
- `text-xs` (0.75rem) - Labels, small text
- `text-sm` (0.875rem) - Secondary text
- `text-base` (1rem) - Body text
- `text-lg` (1.125rem) - Subheadings
- `text-xl` (1.5rem) - Headings
- `text-2xl` (2rem) - Large headings

## Glassmorphism Effects

### GlassCard Component
Location: `client/web/src/components/GlassCard.tsx`

The reusable GlassCard component provides:
- **Backdrop Blur**: 10px (default, configurable)
- **Background**: `rgba(13, 17, 23, 0.4-0.6)` with transparency
- **Border**: Glowing neon border (1-2px)
- **Glow Effects**: Configurable color variants (cyan, green, purple, orange, pink)

#### Usage Example
```tsx
import GlassCard, { GlassCardHeader, GlassCardContent } from '@/components/GlassCard'

export default function DashboardWidget() {
  return (
    <GlassCard glowColor="cyan" variant="default">
      <GlassCardHeader title="Water Metrics" icon={<WaterIcon />} />
      <GlassCardContent>
        <p className="tech-mono text-neon-cyan">95.2%</p>
      </GlassCardContent>
    </GlassCard>
  )
}
```

### GlassCard Variants
1. **default** - Standard glass effect with cyan glow
2. **elevated** - Enhanced blur with stronger glow
3. **panel** - Panel variant with green accent

### Glow Colors
- `cyan` - Tech metrics, water data
- `green` - Health data, yield metrics
- `purple` - Achievements, gamification elements
- `orange` - Warnings, secondary data
- `pink` - Alerts, urgent notifications

## CSS Classes & Utilities

### Glassmorphism Classes
```css
.glass-card    /* Standard glass card effect */
.glass-panel   /* Panel variant with heavier blur */
.glass-hud     /* HUD variant with strong border */
```

### Glow Classes
```css
.neon-glow-green   /* Text glow in matrix green */
.neon-glow-cyan    /* Text glow in neon cyan */
.neon-glow-purple  /* Text glow in neon purple */
.glow-border-green /* Border and shadow glow */
.glow-border-cyan  /* Cyan border glow */
```

### Typography Classes
```css
.tech-mono        /* JetBrains Mono, 0.05em letter spacing */
.tech-display     /* Inter bold, -0.02em letter spacing */
.data-readout     /* JetBrains Mono with glow animation */
.data-readout-cyan /* Cyan variant of data readout */
```

### HUD Elements
```css
.hud-panel        /* HUD-style panel with border glow */
.hud-corner       /* HUD corner bracket effect */
```

## Animation Classes

### Available Animations
- `animate-glow-pulse` - Glowing pulse effect (3s)
- `animate-glow-pulse-cyan` - Cyan variant
- `animate-level-up` - Level up animation (0.8s)
- `animate-badge-bounce` - Badge bounce effect (2s)
- `animate-data-pulse` - Data readout pulse (2s)
- `animate-scan-line` - Scan line effect (8s)
- `animate-glitch` - Glitch effect (0.3s)

## Implementation Files

### Web (Next.js + Tailwind)
- `client/web/src/app/globals.css` - Global styles and animations
- `client/web/tailwind.config.js` - Tailwind configuration with custom colors
- `client/web/src/components/GlassCard.tsx` - Reusable glass card component
- `client/web/src/styles/theme.ts` - Theme utilities and color functions

### Mobile (React Native)
- `client/mobile/src/theme/theme.ts` - Mobile theme configuration
  - Color palette matching web
  - React Native StyleSheet definitions
  - Mobile-optimized shadow effects
  - Utility functions for styling

## Usage Examples

### Web - Using GlassCard
```tsx
import GlassCard, { GlassCardHeader, GlassCardContent, GlassCardFooter } from '@/components/GlassCard'

<GlassCard glowColor="green" variant="elevated">
  <GlassCardHeader 
    title="Yield Prediction" 
    icon={<TrendingUp />}
    subtitle="Next harvest" 
  />
  <GlassCardContent className="space-y-2">
    <p className="data-readout">+24.3%</p>
  </GlassCardContent>
  <GlassCardFooter>
    <button className="flex-1 px-4 py-2 bg-neon-green/20 hover:bg-neon-green/40">
      View Details
    </button>
  </GlassCardFooter>
</GlassCard>
```

### Web - Using Theme Colors
```tsx
import { getGlowColor, COLORS } from '@/styles/theme'

const textColor = COLORS.neon.green
const glow = getGlowColor('cyan')
```

### Mobile - Using Theme
```tsx
import { glassCardStyle, dataDisplayStyle, COLORS } from '@/theme/theme'

<View style={glassCardStyle}>
  <Text style={dataDisplayStyle}>{yieldPercentage}</Text>
</View>
```

## Tailwind Configuration

The Tailwind config extends with:
- Custom color palette (neon colors)
- Custom backdrop filters (`blur`, `blur-thick`)
- Custom box shadows (glow effects)
- Custom animations (gaming effects)
- Font families (`tech`, `display`)

### Custom Colors Available
```
bg-cyber-dark
bg-neon-green
bg-neon-cyan
border-neon-green
border-neon-cyan
text-neon-green
text-neon-cyan
shadow-neon-green
shadow-neon-cyan
```

## Responsive Design

All components are responsive-first:
- Mobile-first Tailwind breakpoints
- Glass effects scale appropriately
- Typography adjusts for screen size
- Touch-friendly button sizes

## Accessibility Considerations

1. **Color Contrast**: Neon colors tested for contrast ratios
2. **Typography**: Monospace fonts for data clarity
3. **Focus States**: Interactive elements have visible focus
4. **Motion**: Animations respect `prefers-reduced-motion`
5. **Dark Mode**: Full dark theme reduces eye strain

## Browser Support

- Modern browsers with CSS backdrop-filter support
- Graceful degradation for older browsers
- Mobile browsers (iOS Safari 12.2+, Chrome Mobile)

## Performance Optimization

1. **Backdrop Blur**: Optimized blur values (10-30px)
2. **Animations**: GPU-accelerated transforms
3. **Shadows**: Hardware-accelerated shadow rendering
4. **Glass Effects**: Minimal overhead with CSS filters

## Future Enhancements

- [ ] Theme switching (light mode variant)
- [ ] Customizable glow intensity
- [ ] Additional color schemes
- [ ] Animation speed preferences
- [ ] High contrast mode for accessibility

## Related Documentation

- [Gaming Aesthetic Guide](../client/web/GAMING_AESTHETIC_GUIDE.md)
- [Mobile Gaming Aesthetic](../client/mobile/GAMING_AESTHETIC_MOBILE.md)
- [Tailwind Configuration](../client/web/tailwind.config.js)
