# Quick Reference: Cyber-Agri Gaming Aesthetic

## 🎨 Color Codes

```
Deep Space:      #0D1117  (bg-cyber-dark)
Cyber Darker:    #050810  (bg-cyber-darker)
Matrix Green:    #00FF41  (text-neon-green)
Neon Cyan:       #00F0FF  (text-neon-cyan)
Neon Purple:     #FF00FF  (text-neon-purple)
Neon Orange:     #FF6B00  (text-neon-orange)
Neon Pink:       #FF006B  (text-neon-pink)
```

## 🎯 Common CSS Classes

### Glass Effects
```
glass-card        - Light glass panel
glass-hud         - Premium HUD panel with glow
glass-panel       - Thick blur background
hud-panel         - Gaming HUD with borders
hud-corner        - Corner bracket decorations
```

### Text Effects
```
neon-glow-green   - Green text with glow
neon-glow-cyan    - Cyan text with glow
neon-glow-purple  - Purple text with glow
data-readout      - Monospace glowing data text
tech-mono         - Monospace technical font
tech-display      - Bold display headings
```

### Animations
```
animate-glow-pulse          - Pulsing green glow
animate-glow-pulse-cyan     - Pulsing cyan glow
animate-level-up            - Level up splash effect
animate-badge-bounce        - Bouncing animation
animate-data-pulse          - Heartbeat pulse
animate-scan-line           - Scanning effect
animate-glitch              - Glitch distortion
```

### Shadows/Glows
```
shadow-neon-green           - Green glow shadow
shadow-neon-cyan            - Cyan glow shadow
shadow-neon-purple          - Purple glow shadow
shadow-glow-sm              - Small glow
shadow-glow-md              - Medium glow
shadow-glow-lg              - Large glow
```

## 🎮 Component Quick Start

### Basic HUD Component
```tsx
<motion.div className="glass-hud p-6">
  <h2 className="tech-display neon-glow-green">TITLE</h2>
  <p className="tech-mono text-neon-cyan/70">description</p>
</motion.div>
```

### Stat Card
```tsx
<div className="glass-card border-neon-green/40 p-4">
  <span className="tech-mono text-xs text-neon-cyan/70">LABEL</span>
  <p className="text-3xl font-bold neon-glow-green">999</p>
</div>
```

### Button
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  className="glass-card border-neon-green/50 px-4 py-2 
             tech-mono text-neon-green font-bold"
>
  ACTION
</motion.button>
```

### Icon with Glow
```tsx
<GamingIcon 
  className="w-5 h-5" 
  color="green" 
  animated={true} 
/>
```

## 🎬 Animation Patterns

### Scale + Rotate (Level Up)
```tsx
animate={{ scale: [0, 1.2, 1], rotate: [-180, 0] }}
transition={{ duration: 0.8, type: 'spring' }}
```

### Bounce
```tsx
animate={{ y: [0, -10, 0] }}
transition={{ duration: 2, repeat: Infinity }}
```

### Pulsing Opacity
```tsx
animate={{ opacity: [1, 0.5, 1] }}
transition={{ duration: 2, repeat: Infinity }}
```

### Hover Scale
```tsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

## 📱 Responsive Breakpoints

```
sm: 640px   - Tablets
md: 768px   - iPads
lg: 1024px  - Desktops
xl: 1280px  - Large screens
```

## 🎯 Border Colors

```
border-neon-green    - Green accent
border-neon-cyan     - Cyan accent
border-neon-purple   - Purple accent
border-neon-orange   - Orange accent
border-neon-pink     - Pink accent
border-glow-green    - Green with soft glow
border-glow-cyan     - Cyan with soft glow
```

## 📊 Font Families

```
Inter           - Display & body text
JetBrains Mono  - Technical/data readout
```

## 💡 Pro Tips

1. **Always use glass panels** - Creates immersive HUD feel
2. **Add motion** - Every interaction should feel responsive
3. **Color sparingly** - Stick to 2-3 colors per component
4. **Text glow** - Essential for cyberpunk aesthetic
5. **Spacing** - Use 4px base unit (p-1, p-2, etc.)
6. **Contrast** - Ensure WCAG AA on all text
7. **Performance** - Profile animations for 60fps
8. **Mobile first** - Test at 320px width

## 🔗 Related Files

- `tailwind.config.js` - Theme configuration
- `globals.css` - Global styles & keyframes
- `GamingIcons.tsx` - Icon components
- `SignalStrengthMeter.tsx` - Connection indicator
- `GAMING_AESTHETIC_GUIDE.md` - Full documentation
