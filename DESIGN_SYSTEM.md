# Design System Documentation

## Overview
This document describes the complete redesign of the ScrumMaster Pro UI/UX system, featuring a modern dark theme with neon green accents and advanced animations.

## Color Palette

### Light Mode (Professional)
- **Background**: `hsl(0 0% 100%)` - Pure white
- **Foreground**: `hsl(222 47% 11%)` - Dark navy text
- **Primary**: `hsl(221 83% 53%)` - Professional blue
- **Card**: `hsl(0 0% 100%)` - White cards
- **Muted**: `hsl(210 40% 96%)` - Light gray backgrounds

### Dark Mode (Cyberpunk Neon)
- **Background**: `hsl(222 47% 5%)` - Deep dark blue-black
- **Foreground**: `hsl(142 86% 65%)` - Bright neon green text
- **Primary**: `hsl(142 86% 55%)` - Neon green (#00ff88)
- **Card**: `hsl(222 47% 8%)` - Slightly lighter than background
- **Muted**: `hsl(217 33% 17%)` - Dark gray for secondary elements

## Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Scale**: 
  - Hero: 5xl-8xl (48px-96px)
  - Headings: 2xl-5xl (24px-48px)
  - Body: base-xl (16px-20px)

## Animations

### Core Animations
1. **Float** (`animate-float`)
   - Duration: 6s
   - Easing: ease-in-out
   - Effect: Vertical floating motion (±20px)
   - Usage: Background orbs, floating elements

2. **Slide Up** (`animate-slide-up`)
   - Duration: 0.6s
   - Easing: ease-out
   - Effect: Entrance from bottom (30px) with opacity fade
   - Usage: Section reveals, content entrance

3. **Fade In** (`animate-fade-in`)
   - Duration: 0.8s
   - Easing: ease-out
   - Effect: Opacity transition 0→1
   - Usage: General content reveals

4. **Pulse Slow** (`animate-pulse-slow`)
   - Duration: 3s
   - Easing: cubic-bezier
   - Effect: Slow opacity pulsing (1→0.5→1)
   - Usage: Icons, badges, attention elements

5. **Glow** (`animate-glow`)
   - Duration: 2s
   - Easing: ease-in-out
   - Effect: Box shadow pulsing
   - Usage: Primary CTAs, focus states

### Neon Effects
- **Neon Glow** (`.neon-glow`)
  - Text shadow with multiple layers
  - Color: Primary (neon green)
  - Usage: Important headings, key text

- **Neon Border** (`.neon-border`)
  - Border with glow effect
  - Usage: Primary buttons, featured cards

## Layout Structure

### Landing Page Architecture
The new landing page breaks away from traditional hero→features→cards structure:

1. **Fixed Navigation**
   - Backdrop blur (glass effect)
   - Border with opacity
   - Logo with animated pulse
   - Theme toggle integrated

2. **Hero Section**
   - Animated grid background
   - Floating gradient orbs
   - Large-scale typography (8xl)
   - Dual CTA buttons
   - Trust indicators
   - Floating dashboard preview card

3. **Bento Grid Features**
   - Asymmetric layout (3-column grid)
   - Mixed card sizes (1x1, 2x1, 1x2)
   - Hover effects with border color transition
   - Icon badges with primary background

4. **Timeline Workflow**
   - Vertical step-by-step layout
   - Large numbered circles
   - Hover state transforms
   - Clean, minimal design

5. **CTA Section**
   - Gradient background overlay
   - Large heading with neon glow
   - Centered dual CTAs

6. **Footer**
   - 4-column grid
   - Link hover states
   - Brand consistency

## Components

### Button
- **Variants**: default, outline, ghost
- **Sizes**: sm, default, lg
- **Animations**: 
  - Hover: subtle lift (translateY)
  - Icon: translate on hover
  - Duration: 200ms
- **Shadows**: soft-sm, soft-md

### Card
- **Base**: Rounded corners (lg), border
- **Hover**: Border color transition to primary
- **Shadows**: soft-sm → soft-md on hover
- **Background**: Card color from theme

### Theme Toggle
- **Icons**: Sun (light mode), Moon (dark mode)
- **Animation**: Rotate 180° on switch
- **Position**: Fixed in navigation

## Responsive Breakpoints
- **Mobile**: < 768px (sm)
- **Tablet**: 768px-1024px (md)
- **Desktop**: > 1024px (lg, xl)

## Implementation Details

### Files Modified
1. `src/app/globals.css` - Core design tokens, animations
2. `src/app/layout.tsx` - ThemeProvider integration
3. `src/app/page.tsx` - Complete landing page redesign
4. `tailwind.config.ts` - Font family, shadow utilities
5. `src/components/ui/button.tsx` - Refined animations
6. `src/components/ui/card.tsx` - Hover states
7. `src/components/theme-toggle.tsx` - New component
8. `src/components/theme-provider.tsx` - New component

### Dependencies Added
- `next-themes` (^0.4.4) - Theme switching functionality

## Best Practices

### Dark Mode First
- Design with dark mode as default
- Ensure sufficient contrast (WCAG AA)
- Use neon accents sparingly for emphasis

### Performance
- Use CSS animations over JavaScript
- Leverage backdrop-filter for glass effects
- Optimize animation duration (prefer 200-600ms)

### Accessibility
- Maintain color contrast ratios
- Provide theme toggle in accessible location
- Support system theme preferences
- Use semantic HTML

### Animation Guidelines
- Entrance animations: Use once on load
- Hover animations: Keep subtle (< 300ms)
- Floating elements: Long duration (3-6s)
- Respect `prefers-reduced-motion`

## Future Enhancements
- [ ] Add scroll-triggered animations
- [ ] Implement parallax effects
- [ ] Create loading skeletons
- [ ] Add page transitions
- [ ] Enhance mobile interactions
- [ ] Add dark mode to all dashboard pages

## Resources
- Color Tool: https://uicolors.app
- Animation Inspiration: https://animista.net
- Bento Grids: https://bento.me/en/home
- Neon Effects: CSS text-shadow and box-shadow
