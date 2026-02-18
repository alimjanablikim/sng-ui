# ShadNG Theming Guide

ShadNG components work out of the box with a beautiful default theme. You can also fully customize the look and feel to match your brand.

## Quick Start

### Option 1: Use Default Theme (Recommended for beginners)

Just import the default theme and you're ready:

```css
/* styles.css */
@import 'sng-ui/src/lib/styles/default-theme.css';
@import 'tailwindcss';
```

This gives you:
- Light theme (default)
- Dark theme (add `class="dark"` to `<html>`)
- All semantic colors (primary, secondary, destructive, etc.)

### Option 2: Customize Colors

Override any variable in your own CSS:

```css
/* styles.css */
@import 'sng-ui/src/lib/styles/default-theme.css';
@import 'tailwindcss';

/* Override primary color to blue */
:root {
  --primary: #2563eb;
  --ring: #2563eb;
}

.dark {
  --primary: #3b82f6;
  --ring: #3b82f6;
}
```

### Option 3: Full Custom Theme

Create your own theme system for complete control. See [Full Custom Theme](#full-custom-theme-setup) below.

---

## How the Theme System Works

### CSS Variables

ShadNG uses CSS custom properties (variables) for all colors:

```css
:root {
  --primary: #18181b;        /* Primary button, links */
  --background: #ffffff;     /* Page background */
  --foreground: #09090b;     /* Text color */
  /* ... more variables */
}
```

### Tailwind Integration

The `@theme inline` directive maps CSS variables to Tailwind utility classes:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
}
```

This allows you to use classes like `bg-primary`, `text-foreground` in your components.

### Dark Mode

Dark mode is activated by adding the `dark` class to the `<html>` element:

```html
<!-- Light mode -->
<html>

<!-- Dark mode -->
<html class="dark">
```

---

## Available CSS Variables

### Core Colors

| Variable | Light Default | Dark Default | Usage |
|----------|---------------|--------------|-------|
| `--background` | `#ffffff` | `#09090b` | Page background |
| `--foreground` | `#09090b` | `#fafafa` | Default text |

### Action Colors

| Variable | Light Default | Dark Default | Usage |
|----------|---------------|--------------|-------|
| `--primary` | `#18181b` | `#fafafa` | Primary buttons, links |
| `--primary-foreground` | `#fafafa` | `#18181b` | Text on primary |
| `--secondary` | `#f4f4f5` | `#27272a` | Secondary buttons |
| `--secondary-foreground` | `#18181b` | `#fafafa` | Text on secondary |
| `--destructive` | `#ef4444` | `#ef4444` | Delete buttons, errors |
| `--destructive-foreground` | `#fafafa` | `#fafafa` | Text on destructive |

### UI Colors

| Variable | Light Default | Dark Default | Usage |
|----------|---------------|--------------|-------|
| `--muted` | `#f4f4f5` | `#27272a` | Muted backgrounds |
| `--muted-foreground` | `#71717a` | `#a1a1aa` | Muted text, placeholders |
| `--accent` | `#f4f4f5` | `#27272a` | Hover states |
| `--accent-foreground` | `#18181b` | `#fafafa` | Text on accent |

### Border & Input Colors

| Variable | Light Default | Dark Default | Usage |
|----------|---------------|--------------|-------|
| `--border` | `#e4e4e7` | `#27272a` | All borders |
| `--input` | `#e4e4e7` | `#27272a` | Input borders |
| `--ring` | `#18181b` | `#d4d4d8` | Focus rings |

### Surface Colors

| Variable | Light Default | Dark Default | Usage |
|----------|---------------|--------------|-------|
| `--card` | `#ffffff` | `#09090b` | Card background |
| `--card-foreground` | `#09090b` | `#fafafa` | Card text |
| `--popover` | `#ffffff` | `#09090b` | Popover/dropdown bg |
| `--popover-foreground` | `#09090b` | `#fafafa` | Popover text |

---

## Examples

### Example 1: Blue Primary Color

```css
/* styles.css */
@import 'sng-ui/src/lib/styles/default-theme.css';
@import 'tailwindcss';

:root {
  --primary: #2563eb;           /* blue-600 */
  --primary-foreground: #ffffff;
  --ring: #2563eb;
}

.dark {
  --primary: #3b82f6;           /* blue-500 (brighter for dark) */
  --primary-foreground: #ffffff;
  --ring: #3b82f6;
}
```

### Example 2: Green Theme

```css
/* styles.css */
@import 'sng-ui/src/lib/styles/default-theme.css';
@import 'tailwindcss';

:root {
  --primary: #16a34a;           /* green-600 */
  --primary-foreground: #ffffff;
  --ring: #16a34a;
  --destructive: #dc2626;       /* Keep red for destructive */
}

.dark {
  --primary: #22c55e;           /* green-500 */
  --primary-foreground: #ffffff;
  --ring: #22c55e;
}
```

### Example 3: Purple Accent with Custom Background

```css
/* styles.css */
@import 'sng-ui/src/lib/styles/default-theme.css';
@import 'tailwindcss';

:root {
  --primary: #7c3aed;           /* violet-600 */
  --primary-foreground: #ffffff;
  --ring: #7c3aed;
  --background: #faf5ff;        /* Light purple tint */
  --card: #ffffff;
}

.dark {
  --primary: #8b5cf6;           /* violet-500 */
  --primary-foreground: #ffffff;
  --ring: #8b5cf6;
  --background: #0c0a09;        /* Near black */
}
```

---

## Creating Accent Themes

Accent themes let users switch between color schemes (like "Blue mode", "Green mode").

### Step 1: Create accent theme CSS

```css
/* themes/blue.css */
.theme-blue {
  --primary: #2563eb;
  --primary-foreground: #ffffff;
  --ring: #2563eb;
}

.theme-blue.dark,
.dark.theme-blue {
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --ring: #3b82f6;
}
```

### Step 2: Import in your styles

```css
/* styles.css */
@import 'sng-ui/src/lib/styles/default-theme.css';
@import 'tailwindcss';
@import './themes/blue.css';
```

### Step 3: Use in HTML

```html
<!-- Default theme -->
<html>

<!-- Blue theme (light) -->
<html class="theme-blue">

<!-- Blue theme (dark) -->
<html class="dark theme-blue">
```

### Step 4: Toggle with JavaScript

```typescript
// Toggle accent theme
function setAccentTheme(theme: string | null) {
  const html = document.documentElement;

  // Remove existing theme classes
  html.classList.remove('theme-blue', 'theme-green', 'theme-purple');

  // Add new theme class
  if (theme) {
    html.classList.add(`theme-${theme}`);
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}
```

---

## Full Custom Theme Setup

For complete control, create your own theme system:

### Folder Structure

```
your-app/
`-- src/
    `-- styles/
        `-- themes/
            |-- tokens/
            |   |-- index.css       # Imports all tokens
            |   |-- colors.css      # @theme inline mapping
            |   |-- z-index.css     # Z-index scale (optional)
            |   `-- animations.css  # Custom timing (optional)
            |-- light.css           # Light mode colors
            |-- dark.css            # Dark mode colors
            |-- blue.css            # Accent theme (optional)
            `-- index.css           # Main entry point
```

### File: tokens/colors.css

```css
/**
 * Color Token Mapping
 * Maps CSS variables to Tailwind utility classes.
 */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}
```

### File: tokens/z-index.css (optional)

```css
/**
 * Z-Index Scale
 * App-specific layering for overlays and modals.
 */
:root {
  --z-dropdown: 50;
  --z-sticky: 100;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
  --z-toast: 800;
}
```

### File: tokens/animations.css (optional)

```css
/**
 * Animation Tokens
 * Custom timing and easing curves.
 */
:root {
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}
```

### File: tokens/index.css

```css
@import './z-index.css';
@import './animations.css';
@import './colors.css';
```

### File: light.css

```css
@layer theme {
  :root {
    /* Core */
    --background: #ffffff;
    --foreground: #09090b;

    /* Surfaces */
    --card: #ffffff;
    --card-foreground: #09090b;
    --popover: #ffffff;
    --popover-foreground: #09090b;

    /* Actions */
    --primary: #18181b;
    --primary-foreground: #fafafa;
    --secondary: #f4f4f5;
    --secondary-foreground: #18181b;
    --destructive: #ef4444;
    --destructive-foreground: #fafafa;

    /* UI Elements */
    --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --accent: #f4f4f5;
    --accent-foreground: #18181b;

    /* Borders & Inputs */
    --border: #e4e4e7;
    --input: #e4e4e7;
    --ring: #18181b;
  }
}
```

### File: dark.css

```css
@layer theme {
  .dark {
    /* Core */
    --background: #09090b;
    --foreground: #fafafa;

    /* Surfaces */
    --card: #09090b;
    --card-foreground: #fafafa;
    --popover: #09090b;
    --popover-foreground: #fafafa;

    /* Actions */
    --primary: #fafafa;
    --primary-foreground: #18181b;
    --secondary: #27272a;
    --secondary-foreground: #fafafa;
    --destructive: #ef4444;
    --destructive-foreground: #fafafa;

    /* UI Elements */
    --muted: #27272a;
    --muted-foreground: #a1a1aa;
    --accent: #27272a;
    --accent-foreground: #fafafa;

    /* Borders & Inputs */
    --border: #27272a;
    --input: #27272a;
    --ring: #d4d4d8;
  }
}
```

### File: index.css

```css
/**
 * Theme System Entry Point
 */
@import './tokens/index.css';
@import './light.css';
@import './dark.css';

/* Optional accent themes */
/* @import './blue.css'; */
/* @import './green.css'; */
```

### File: styles.css (your app's main styles)

```css
/* Use your custom theme instead of default */
@import './themes/index.css';
@import 'tailwindcss';

/* Your app styles below */
```

---

## Tips & Best Practices

### 1. Use Tailwind's Color Palette

Stick to Tailwind's color scale for consistency:

```css
/* Good - using Tailwind colors */
--primary: #2563eb;  /* blue-600 */
--primary: #3b82f6;  /* blue-500 */

/* Avoid - random hex values */
--primary: #2468ac;
```

Reference: https://tailwindcss.com/docs/customizing-colors

### 2. Maintain Contrast Ratios

Ensure text is readable:

```css
/* Light mode: dark text on light bg */
--background: #ffffff;
--foreground: #09090b;  /* Good contrast */

/* Dark mode: light text on dark bg */
--background: #09090b;
--foreground: #fafafa;  /* Good contrast */
```

### 3. Test Both Modes

Always test your theme in both light and dark modes:

```javascript
// Quick toggle for testing
document.documentElement.classList.toggle('dark');
```

### 4. Use Semantic Variables

Don't hardcode colors in components:

```html
<!-- Good -->
<button class="bg-primary text-primary-foreground">

<!-- Bad -->
<button class="bg-blue-600 text-white">
```

---

## Migration from Other Theme Systems

### From Tailwind's Default Colors

Replace direct color classes with semantic ones:

```html
<!-- Before -->
<button class="bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">

<!-- After -->
<button class="bg-primary text-primary-foreground">
```

### From CSS-in-JS

Move your color definitions to CSS variables:

```typescript
// Before (styled-components)
const Button = styled.button`
  background: ${props => props.theme.primary};
`;

// After (CSS variables)
// CSS: --primary: #18181b;
// HTML: <button class="bg-primary">
```

---

## Troubleshooting

### Colors Not Applying

1. Check import order (theme CSS before Tailwind):
   ```css
   @import 'sng-ui/src/lib/styles/default-theme.css';  /* First */
   @import 'tailwindcss';                               /* Second */
   ```

2. Verify `@theme inline` is present in your colors.css

3. Check browser DevTools for CSS variable values

### Dark Mode Not Working

1. Ensure `.dark` class is on `<html>`, not `<body>`:
   ```html
   <html class="dark">  <!-- Correct -->
   <body class="dark">  <!-- Won't work -->
   ```

2. Check that dark mode variables are defined:
   ```css
   .dark {
     --primary: #fafafa;  /* Must be defined */
   }
   ```

### Accent Theme Not Overriding

Ensure accent theme is imported after base themes:

```css
@import './light.css';
@import './dark.css';
@import './blue.css';  /* Must be last */
```

---

## Resources

- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
