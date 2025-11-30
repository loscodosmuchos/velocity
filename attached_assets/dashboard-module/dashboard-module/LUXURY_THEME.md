# Luxury Gold Dark Theme - Installation Guide

This optional theme adds a sophisticated dark aesthetic with gold accents and Damascus steel texture to your Dashboard Builder.

## 🎨 Theme Features

**Luxury Gold Dark** includes:
- Deep charcoal background with gold undertones
- Slate cards elevated from background
- Bright cream text for perfect readability
- Rich gold accents (#ffc940)
- Damascus steel texture at 8% opacity
- Glassmorphism and gold leaf shimmer effects

## 📦 Installation

### Option 1: Include in Initial Setup

If you're installing the dashboard module for the first time, the Luxury Gold Dark theme will be included automatically when you run the seed script.

### Option 2: Add to Existing Installation

If you've already installed the dashboard module and want to add this theme:

#### Step 1: Add the Theme to Database

```bash
# Using the provided SQL file
psql $DATABASE_URL < dashboard-module/seeds/add-luxury-theme.sql

# Or using the execute_sql_tool in Replit
```

#### Step 2: Add Texture CSS

The texture CSS has already been added to `client/src/index.css` if you used the installer. If not, add this to your CSS:

```css
/* ========================================
   LUXURY THEME TEXTURES
   ======================================== */

/* Damascus Steel Texture - Subtle metallic pattern overlay */
[data-luxury-texture="true"] body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  opacity: 0.08;
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      hsl(var(--foreground) / 0.06) 10px,
      hsl(var(--foreground) / 0.06) 20px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 8px,
      hsl(var(--foreground) / 0.04) 8px,
      hsl(var(--foreground) / 0.04) 16px
    ),
    repeating-linear-gradient(
      90deg,
      hsl(var(--primary) / 0.04) 0px,
      transparent 2px,
      transparent 12px,
      hsl(var(--primary) / 0.06) 12px,
      transparent 14px
    );
  pointer-events: none;
}

/* Gold Leaf Shimmer on Cards */
[data-luxury-texture="true"] .card::after,
[data-luxury-texture="true"] [data-card]::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.06;
  border-radius: inherit;
  background-image: 
    radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.08) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, hsl(var(--primary) / 0.06) 0%, transparent 25%),
    radial-gradient(circle at 40% 80%, hsl(var(--primary) / 0.04) 0%, transparent 20%);
  pointer-events: none;
}

/* Glassmorphism Frosted Effect */
[data-glassmorphism="true"] .card,
[data-glassmorphism="true"] [data-card] {
  backdrop-filter: blur(12px) saturate(180%);
  background-color: hsl(var(--card) / 0.7) !important;
  border: 1px solid hsl(var(--border) / 0.3);
}
```

#### Step 3: Enable Texture Effects

To activate the Damascus steel texture, add the `data-luxury-texture="true"` attribute to your HTML root element or body:

```tsx
// In your App.tsx or layout component
useEffect(() => {
  document.documentElement.setAttribute('data-luxury-texture', 'true');
}, []);
```

Or conditionally based on selected theme:

```tsx
useEffect(() => {
  if (selectedTheme?.name === 'Luxury Gold Dark') {
    document.documentElement.setAttribute('data-luxury-texture', 'true');
  } else {
    document.documentElement.removeAttribute('data-luxury-texture');
  }
}, [selectedTheme]);
```

## 🎯 Usage

### Select the Theme

Once installed, users can select "Luxury Gold Dark" from the theme dropdown in the Dashboard Builder interface.

### Color Palette

The theme uses these HSL values:

| Element | HSL Value | Hex Equivalent |
|---------|-----------|----------------|
| Primary (Gold) | h:43 s:100% l:62% | #ffc940 |
| Secondary | h:30 s:20% l:40% | #735e4d |
| Accent (Gold) | h:43 s:100% l:62% | #ffc940 |
| Neutral (Charcoal) | h:20 s:12% l:13% | #241e23 |
| Success (Green) | h:142 s:71% l:45% | #21a049 |
| Warning (Gold) | h:43 s:100% l:62% | #ffc940 |
| Error (Red) | h:0 s:84% l:60% | #ea5959 |

### Typography

- **Font Family**: Inter, sans-serif
- **Scale**: Golden ratio (1.618)
- **Base Size**: 15px

### Spacing

- **Base**: 4px
- **Scale**: 1.618 (golden ratio)

### Border Radius

- **Small**: 6px
- **Medium**: 10px
- **Large**: 14px

## ✨ Visual Effects

### Damascus Steel Texture

The signature effect of this theme - a subtle crosshatch pattern overlay that mimics the wavy organic metallic patterns found in Damascus steel. Applied at 8% opacity to the body background.

### Gold Leaf Shimmer

Subtle radial gradients applied to cards that create an organic shimmer effect reminiscent of gold leaf. Applied at 6% opacity.

### Glassmorphism (Optional)

Enable frosted glass effects on cards with:

```tsx
document.documentElement.setAttribute('data-glassmorphism', 'true');
```

## 🎨 Customization

### Adjust Texture Opacity

Modify the opacity in `index.css`:

```css
[data-luxury-texture="true"] body::before {
  opacity: 0.12; /* Increase from 0.08 for more visible texture */
}
```

### Change Gold Accent Color

Update the primary color in the theme:

```typescript
primary: { h: 40, s: 95, l: 58 }, // Warmer gold
primary: { h: 45, s: 100, l: 70 }, // Lighter gold
```

## 🔧 Troubleshooting

**Textures not visible?**
- Ensure `data-luxury-texture="true"` is set on the HTML element
- Check that the CSS has been added to `index.css`
- Verify z-index stacking - textures should be at z-index: -1

**Cards appear too transparent?**
- Remove `data-glassmorphism="true"` attribute
- Or adjust the opacity in the glassmorphism CSS

**Performance concerns?**
- The textures use CSS patterns (no images) for optimal performance
- All effects are GPU-accelerated where supported

## 📝 Credits

Theme inspired by luxury design patterns including Damascus steel metallurgy, gold leaf artistry, and holographic projection mapping.

---

**Status**: ✅ Production Ready  
**Compatibility**: React 18+, Modern browsers with CSS backdrop-filter support
