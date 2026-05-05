---
name: Collectible Vault
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

This design system is engineered to evoke the atmosphere of an ultra-high-end physical vault or a boutique luxury gallery. The aesthetic is rooted in **Minimalism** and **Glassmorphism**, utilizing a strict monochromatic palette to shift the focus entirely onto the assets being displayed. 

The target audience consists of high-net-worth collectors who value precision, security, and understated elegance. The interface avoids all "loud" trends, opting instead for a timeless, high-contrast look that feels both technologically advanced and classically luxurious. Every element must feel intentional, with heavy use of whitespace to signify exclusivity.

## Colors

The system operates on an absolute dark mode foundation. 
- **Absolute Black (#000000)** is the primary surface color, creating a "void" that allows collectibles to pop.
- **Pure White (#FFFFFF)** is reserved for critical information, primary actions, and branding.
- **Grayscale spectrum** handles everything else: secondary text uses muted grays to establish hierarchy, while borders utilize subtle dark grays to define structure without breaking the minimalist flow. 
- **No accent colors** are permitted; status (success/error) should be communicated through iconography, typography weight, or high-contrast shifts rather than color.

## Typography

The design system utilizes **Plus Jakarta Sans** for all text to achieve a sharp, geometric, and modern feel. 
- **Headings** should be bold and tightly tracked to feel like headlines in a luxury magazine.
- **Body text** remains clean with generous line height for readability.
- **Labels** often use uppercase with increased letter spacing to create a technical, "serialized" aesthetic reminiscent of luxury watch engraving or certificates of authenticity.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to ensure a curated, gallery-like experience regardless of monitor size. 
- Content is centered within a 1440px container.
- A 12-column system is used with generous 24px gutters.
- Vertical rhythm is driven by an 8px base unit, but "negative space" is used aggressively—sections should be separated by large padding (80px+) to maintain a premium, airy feel.

## Elevation & Depth

Depth is conveyed through **Grayscale Glassmorphism** and subtle tonal layering rather than traditional drop shadows.
- **Glass Effects:** Use a background blur (20px to 40px) combined with a highly transparent white fill (`rgba(255, 255, 255, 0.03)`).
- **Surface Borders:** Elements are defined by 1px solid borders in dark gray (`#1A1A1A` or `#333333`).
- **Stacking:** Higher elevation levels are represented by slightly lighter surface grays or increased blur intensity. Avoid drop shadows unless they are "glow" style white shadows used very sparingly for active state highlights.

## Shapes

The shape language is precise and disciplined. 
- **Cards & Buttons:** Use a consistent **8px** radius to maintain a modern but structured appearance.
- **Inputs:** Use a slightly softer **12px** radius to make interaction areas feel more approachable and distinct from layout containers.
- **Icons:** Should be stroke-based (linear) with a 1.5px or 2px weight to match the sharpness of the typography.

## Components

### Buttons
- **Primary:** Solid White background with Absolute Black text. High-boldness typography.
- **Secondary:** Transparent background with a 1px White border.
- **Ghost:** Transparent background, white text, no border until hover (then #1A1A1A background).

### Cards
- **Asset Cards:** 8px radius. Background is `#0A0A0A` with a 1px border of `#1A1A1A`. On hover, the border brightens to `#FFFFFF`.
- **Glass Panels:** Used for overlays. 40px backdrop blur with a thin `#333333` top-border to simulate a light catch on a glass edge.

### Inputs
- **Text Fields:** 12px radius. Background is `#000000` with a `#333333` border. Focus state features a 1px White border.
- **Dropdowns:** Glassmorphic menus that blur the content beneath them, ensuring the "Vault" feel remains consistent.

### Navigation
- A top-fixed navigation bar using the grayscale glassmorphism effect. Navigation links use the `label-caps` typography style for a sophisticated, archival look.

### Additional Elements
- **Value Indicators:** Large, bold H2 or H1 white text for asset values.
- **Status Tags:** Simple 1px borders with `label-caps` text. No background fills.