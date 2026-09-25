# Design System: AmenityHub (Distinct Visual Identity)

## Product Context
AmenityHub is a modern amenity booking & facility management platform for residential societies. 

## Style & Aesthetics Archetype
- **Style Archetype:** Deep Forest & Warm Terracotta Estate Concierge
- **Visual Direction:** Rich organic elegance with Deep Forest Green headers/navigation, warm cream backgrounds, Fraunces serif display headings, and high-conversion Burnt Terracotta CTAs.
- **Mode Support:** Light Warm Cream theme (default `#FAF6EE` background).

## Design Tokens (CSS Variables)

```css
:root {
  /* 1. Deep Forest & Terracotta Palette */
  --primitive-forest-900: #162E22;
  --primitive-forest-800: #1F3D2E; /* Primary Deep Forest Green */
  --primitive-forest-700: #294F3C;
  --primitive-forest-100: #E2EBE5;
  --primitive-forest-50:  #F0F5F2;
  
  --primitive-terracotta-700: #A04419; /* Hover Terracotta */
  --primitive-terracotta-600: #C05621; /* Accent Burnt Terracotta */
  --primitive-terracotta-500: #DD6B20;
  --primitive-terracotta-100: #FEEBC8;

  --primitive-cream-50:  #FAF6EE; /* Warm Cream Background */
  --primitive-cream-100: #F3EDDE;
  --primitive-cream-200: #E7E2D8; /* Border Neutral */
  
  --primitive-charcoal-900: #22221F; /* Primary Charcoal Text */
  --primitive-charcoal-600: #52524E; /* Secondary Body Text */

  --primitive-red-600: #991B1B;

  /* 2. Semantic Color Tokens */
  --color-primary: var(--primitive-forest-800);
  --color-primary-hover: var(--primitive-forest-900);
  --color-on-primary: #FFFFFF;
  
  --color-accent: var(--primitive-terracotta-600);
  --color-accent-hover: var(--primitive-terracotta-700);
  --color-on-accent: #FFFFFF;
  
  --color-background: var(--primitive-cream-50);
  --color-foreground: var(--primitive-charcoal-900);
  
  --color-card: #FFFFFF;
  --color-card-foreground: var(--primitive-charcoal-900);
  
  --color-muted: var(--primitive-cream-100);
  --color-muted-foreground: var(--primitive-charcoal-600);
  
  --color-border: var(--primitive-cream-200);

  --color-destructive: var(--primitive-red-600);
  --color-on-destructive: #FFFFFF;
  
  --color-ring: var(--primitive-terracotta-600);

  /* Status Colors */
  --color-status-pending-bg: #FEF9C3;
  --color-status-pending-text: #854D0E;
  --color-status-accepted-bg: #DCFCE7;
  --color-status-accepted-text: #166534;
  --color-status-rejected-bg: #FEE2E2;
  --color-status-rejected-text: #991B1B;

  /* 3. Typography Scale */
  --font-heading: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', sans-serif;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 34px;
  --text-4xl: 44px;

  /* 4. Elevation Shadows & Radii */
  --shadow-sm: 0 1px 3px 0 rgba(34, 34, 31, 0.05);
  --shadow-md: 0 4px 12px -2px rgba(34, 34, 31, 0.08);
  --shadow-lg: 0 12px 24px -4px rgba(34, 34, 31, 0.1);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}
```

## Typography Guidelines
- **Headings (`<h1>` - `<h6>`):** Use `Fraunces` (`--font-heading`) serif display font for all page titles, section titles, and card headers.
- **Body Text & Controls:** Use `Inter` (`--font-body`) sans-serif for body paragraphs, form labels, metadata, and buttons for strong contrast.

## Key Effects & Micro-Interactions
- **Transitions:** `200ms ease-in-out` hover states with subtle lift (`transform: translateY(-2px)`).
- **Focus Rings:** Mandatory `:focus-visible` ring `2px solid var(--color-ring)`.
- **Reduced Motion:** Mandatory `@media (prefers-reduced-motion: reduce)` block resetting animations.
