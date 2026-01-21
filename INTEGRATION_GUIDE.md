# Integration Guide: Cyber-Agri Theme for Existing Components

This guide shows how to integrate the new Cyber-Agri theme into your existing dashboard components.

## Before & After Examples

### Example 1: Dashboard Widget

#### Before (Generic styling)
```tsx
<div className="p-4 bg-white border rounded-lg">
  <h3>Yield Prediction</h3>
  <p>+24.3%</p>
</div>
```

#### After (With Cyber-Agri theme)
```tsx
import GlassCard, { GlassCardHeader, GlassCardContent } from '@/components/GlassCard'
import { TrendingUp } from 'lucide-react'

<GlassCard glowColor="green">
  <GlassCardHeader 
    title="Yield Prediction" 
    icon={<TrendingUp className="w-5 h-5" />}
    subtitle="Next harvest forecast"
  />
  <GlassCardContent>
    <p className="tech-mono text-neon-green text-2xl font-bold">+24.3%</p>
  </GlassCardContent>
</GlassCard>
```

### Example 2: Data Display

#### Before
```tsx
<div>
  <label>Water Level</label>
  <p>95.2%</p>
</div>
```

#### After
```tsx
<div className="space-y-2">
  <label className="tech-mono text-sm text-gray-400">WATER LEVEL</label>
  <p className="data-readout text-3xl">95.2%</p>
</div>
```

### Example 3: Alert/Warning

#### Before
```tsx
<div className="p-4 bg-red-100 border border-red-300 rounded">
  <p className="text-red-800">Warning: Soil moisture critical</p>
</div>
```

#### After
```tsx
<GlassCard glowColor="orange" interactive>
  <GlassCardContent>
    <div className="flex gap-3">
      <AlertCircle className="text-neon-orange" />
      <p className="text-neon-orange">Soil moisture critical - Action required</p>
    </div>
  </GlassCardContent>
</GlassCard>
```

## Integration Steps

### Step 1: Import Components & Theme
```tsx
import GlassCard, { 
  GlassCardHeader, 
  GlassCardContent, 
  GlassCardFooter 
} from '@/components/GlassCard'
import { COLORS } from '@/styles/theme'
```

### Step 2: Replace Generic Divs with GlassCard
```tsx
// OLD
<div className="p-4 border rounded-lg bg-gray-50">

// NEW
<GlassCard glowColor="cyan">
  <GlassCardContent>
```

### Step 3: Update Typography
```tsx
// OLD
<h3 className="text-lg font-bold">Title</h3>
<p className="text-gray-600">Description</p>

// NEW
<h3 className="tech-display text-xl text-neon-cyan">Title</h3>
<p className="text-gray-400">Description</p>
```

### Step 4: Color Data Numerically
```tsx
// OLD
<p className="text-gray-800">42.5</p>

// NEW
<p className="tech-mono text-neon-green text-2xl font-bold">42.5</p>
```

## Component Migration Guide

### Stats Cards
```tsx
// Replace your existing stats card with:
import GlassCard, { GlassCardContent } from '@/components/GlassCard'

<GlassCard glowColor="green" variant="elevated">
  <GlassCardContent className="space-y-2">
    <p className="tech-mono text-sm text-gray-400">YIELD</p>
    <p className="tech-mono text-3xl text-neon-green font-bold">+24%</p>
    <p className="text-xs text-gray-500">vs last harvest</p>
  </GlassCardContent>
</GlassCard>
```

### Mission Cards
```tsx
<GlassCard glowColor="cyan" interactive>
  <GlassCardHeader 
    title="Daily Mission: Water Crops"
    subtitle="Reward: 50 XP"
  />
  <GlassCardContent>
    <div className="w-full bg-cyber-dark rounded h-2">
      <div 
        className="bg-neon-green h-full rounded" 
        style={{ width: '75%' }}
      />
    </div>
    <p className="text-sm text-gray-400 mt-2">3/4 plots completed</p>
  </GlassCardContent>
</GlassCard>
```

### Achievement Badges
```tsx
<GlassCard glowColor="purple" interactive className="text-center">
  <GlassCardContent>
    <div className="text-4xl mb-2">🏆</div>
    <p className="font-bold text-neon-purple">Master Farmer</p>
    <p className="text-xs text-gray-400">Unlock 10 achievements</p>
  </GlassCardContent>
</GlassCard>
```

### Alert/Notification
```tsx
import { AlertCircle, Check } from 'lucide-react'

<GlassCard glowColor="orange">
  <GlassCardContent className="flex gap-3">
    <AlertCircle className="text-neon-orange flex-shrink-0" />
    <div>
      <p className="font-semibold text-neon-orange">Attention Required</p>
      <p className="text-sm text-gray-400">Your irrigation schedule needs update</p>
    </div>
  </GlassCardContent>
</GlassCard>
```

### Success Message
```tsx
<GlassCard glowColor="green">
  <GlassCardContent className="flex gap-3">
    <Check className="text-neon-green flex-shrink-0" />
    <div>
      <p className="font-semibold text-neon-green">Success!</p>
      <p className="text-sm text-gray-400">Your farm has been updated</p>
    </div>
  </GlassCardContent>
</GlassCard>
```

## Common Patterns

### Data Card with Label and Value
```tsx
<GlassCard glowColor="cyan">
  <GlassCardHeader title="Soil pH" />
  <GlassCardContent className="text-center">
    <p className="tech-mono text-4xl text-neon-cyan font-bold">7.2</p>
    <p className="text-sm text-gray-400 mt-2">Optimal range</p>
  </GlassCardContent>
</GlassCard>
```

### List Items with Glow
```tsx
<div className="space-y-2">
  {items.map((item) => (
    <div 
      key={item.id}
      className="p-3 bg-cyber-dark/40 border border-neon-cyan/20 rounded-lg hover:border-neon-cyan/50 transition-colors"
    >
      <p className="tech-mono text-neon-cyan">{item.name}</p>
      <p className="text-gray-400">{item.description}</p>
    </div>
  ))}
</div>
```

### Button Styling
```tsx
// Primary Button
<button className="px-4 py-2 bg-neon-green text-cyber-dark font-bold rounded tech-mono hover:bg-neon-green/90 transition-colors">
  Action
</button>

// Secondary Button
<button className="px-4 py-2 border border-neon-cyan/50 text-neon-cyan font-bold rounded tech-mono hover:border-neon-cyan transition-colors">
  Secondary
</button>

// Glass Button
<button className="px-4 py-2 bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold rounded tech-mono hover:bg-neon-cyan/30 transition-colors">
  Glass Button
</button>
```

### Loading State
```tsx
<GlassCard glowColor="cyan">
  <GlassCardContent className="text-center py-8">
    <div className="animate-spin inline-block text-2xl">⟳</div>
    <p className="text-gray-400 mt-2">Loading data...</p>
  </GlassCardContent>
</GlassCard>
```

### Empty State
```tsx
<GlassCard glowColor="purple">
  <GlassCardContent className="text-center py-8">
    <p className="text-4xl mb-2">📭</p>
    <p className="font-semibold text-gray-300">No data available</p>
    <p className="text-sm text-gray-400">Start a mission to see results here</p>
  </GlassCardContent>
</GlassCard>
```

## Accessibility Tips

### Color Only
Don't rely only on color to convey information:
```tsx
// BAD - Only color differentiates
<p className="text-neon-green">Success</p>

// GOOD - Color + icon/text
<div className="flex gap-2 items-center">
  <Check className="text-neon-green" />
  <p className="text-neon-green">Success</p>
</div>
```

### Text Contrast
Ensure sufficient contrast for text:
```tsx
// GOOD - Light text on dark
<p className="text-neon-green">High contrast</p>

// AVOID - Gray text
<p className="text-gray-600">Low contrast on dark bg</p>
```

### Focus States
Use Tailwind focus utilities:
```tsx
<button className="... focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:ring-offset-2 focus:ring-offset-cyber-dark">
  Accessible Button
</button>
```

## Mobile Integration

### React Native Components
```tsx
import { View, Text } from 'react-native'
import { glassCardStyle, dataDisplayStyle, COLORS } from '@/theme'

<View style={glassCardStyle}>
  <Text style={dataDisplayStyle}>95.2%</Text>
</View>
```

### Matching Web Colors
```tsx
// Use same color constants
import { COLORS } from '@/theme'

const styles = StyleSheet.create({
  text: {
    color: COLORS.neon.green,
  },
})
```

## File Organization

When using the theme across components:

```
src/
├── components/
│   ├── GlassCard.tsx              (NEW - Use this)
│   ├── DashboardWidget.tsx        (UPDATE - Use GlassCard)
│   ├── StatsCard.tsx              (UPDATE - Use GlassCard)
│   ├── MissionCard.tsx            (UPDATE - Use GlassCard)
│   └── ...other components
├── styles/
│   └── theme.ts                   (NEW - Import from here)
└── app/
    └── globals.css                (UPDATED - Styles ready)
```

## Testing Your Integration

### Visual Testing Checklist
- [ ] Colors display correctly
- [ ] Glow effects are visible
- [ ] Blur effect is working
- [ ] Borders glow as expected
- [ ] Text is readable
- [ ] Animations are smooth
- [ ] Hover states work
- [ ] Responsive layout is correct

### Browser Testing
- [ ] Chrome/Edge works
- [ ] Firefox works
- [ ] Safari works
- [ ] Mobile browser works

### Performance Testing
- [ ] Page loads quickly
- [ ] No jank in animations
- [ ] Scrolling is smooth
- [ ] Interactions are responsive

## Troubleshooting

### Glass Effect Not Visible
- Check: Parent element has `overflow-hidden`
- Check: Browser supports backdrop-filter
- Check: Opacity values are correct

### Colors Look Wrong
- Verify: Hex values match theme
- Check: No conflicting CSS
- Clear: Browser cache

### Text Not Glowing
- Add: `neon-glow-*` class
- Check: Text shadow CSS is loaded
- Verify: Color contrast is sufficient

### Animations Janky
- Reduce: Animation duration
- Check: GPU acceleration enabled
- Profile: Performance in DevTools

## Performance Best Practices

1. **Use CSS Classes** over inline styles
2. **Memoize** components with GlassCard
3. **Optimize** images for dark background
4. **Lazy Load** heavy animations
5. **Minimize** blur on large containers

## Going Live

Before deploying:

1. ✅ Test all components visually
2. ✅ Verify responsive design
3. ✅ Check accessibility (WCAG)
4. ✅ Performance audit
5. ✅ Browser compatibility
6. ✅ Mobile testing
7. ✅ Animation smoothness

## Support Resources

- **Theme Documentation**: `CYBER_AGRI_THEME.md`
- **Quick Reference**: `THEME_QUICK_REFERENCE.md`
- **Implementation Checklist**: `CYBER_AGRI_IMPLEMENTATION_COMPLETE.md`
- **Component**: `client/web/src/components/GlassCard.tsx`
- **Theme Utils**: `client/web/src/styles/theme.ts`

## Next Steps

1. Start with one component
2. Use GlassCard as wrapper
3. Update typography classes
4. Color data appropriately
5. Test and iterate
6. Expand to other components

Good luck with your integration!
