
# ShadNG Badge

Small status descriptors for labels, categories, counts, and status indicators. Lightweight and customizable via Tailwind classes.

## Installation

```bash
npx @shadng/sng-ui add badge
```

## Basic Usage

```html
<!-- Default badge (primary colors) -->
<sng-badge>New</sng-badge>

<!-- Custom styles via class -->
<sng-badge class="bg-secondary text-secondary-foreground">Category</sng-badge>
<sng-badge class="bg-destructive text-white">Error</sng-badge>
<sng-badge class="bg-transparent text-foreground">Outline</sng-badge>
```

## Style Examples

```html
<!-- Default: Primary colored -->
<sng-badge>Default</sng-badge>

<!-- Secondary: Muted colors -->
<sng-badge class="bg-secondary text-secondary-foreground">Secondary</sng-badge>

<!-- Destructive: Error/danger -->
<sng-badge class="bg-destructive text-white">Error</sng-badge>

<!-- Outline: Transparent -->
<sng-badge class="bg-transparent text-foreground">Outline</sng-badge>
```

## Sizes (via Tailwind classes)

```html
<!-- Small: Compact for counts -->
<sng-badge class="px-1.5 py-0 text-[10px]">3</sng-badge>

<!-- Default: Standard labels (built-in) -->
<sng-badge>New</sng-badge>

<!-- Large: Prominent tags -->
<sng-badge class="px-2.5 py-1 text-sm">Featured</sng-badge>
```

## Badge with Icon

```html
<sng-badge class="gap-1">
  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
  Success
</sng-badge>

<sng-badge class="bg-destructive text-white gap-1">
  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
  Error
</sng-badge>
```

## Status Badges

```html
<sng-badge class="gap-1.5 border-transparent bg-green-500/15 text-green-700 dark:text-green-400">
  <span class="h-2 w-2 rounded-full bg-green-500"></span>
  Online
</sng-badge>

<sng-badge class="gap-1.5 border-transparent bg-yellow-500/15 text-yellow-700 dark:text-yellow-400">
  <span class="h-2 w-2 rounded-full bg-yellow-500"></span>
  Away
</sng-badge>

<sng-badge class="gap-1.5 border-transparent bg-red-500/15 text-red-700 dark:text-red-400">
  <span class="h-2 w-2 rounded-full bg-red-500"></span>
  Busy
</sng-badge>
```

## Clickable Badges (Links)

```html
<!-- Wrap badges in anchor tags for clickable behavior -->
<a href="/category/angular" class="no-underline">
  <sng-badge class="bg-secondary text-secondary-foreground hover:bg-secondary/80">Angular</sng-badge>
</a>

<a href="/category/typescript" class="no-underline">
  <sng-badge class="bg-secondary text-secondary-foreground hover:bg-secondary/80">TypeScript</sng-badge>
</a>
```

---

# SngBadge Technical Reference

## Component Architecture

```typescript
// 1 component (standalone):
// SngBadge - Status indicator, customizable via class input
```

## API Reference

```typescript
// SngBadge - Component Interface
// interface SngBadgeApi {
//   class: InputSignal<string>;  // Default: '' - Tailwind classes for styling
// }
// Default style: bg-primary text-primary-foreground
```

## CDK Usage

```typescript
// CDK NOT NEEDED - Badge is a pure presentational component
// - No overlay positioning
// - No focus management
// - No focus navigation
// - Just styled container + content projection
```

## Import Requirements

```typescript
// import { SngBadge } from 'sng-ui';
//
// @Component({
//   standalone: true,
//   imports: [SngBadge],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class MyComponent {}
```

## Styling Patterns

```typescript
// Base classes (always applied):
// 'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium'
// 'w-fit whitespace-nowrap shrink-0 gap-1 select-none'
// 'direct child SVGs are sized to 12px and non-interactive by component defaults'

// Default colors:
// 'border-transparent bg-primary text-primary-foreground'

// Common overrides:
// Secondary: class="bg-secondary text-secondary-foreground"
// Destructive: class="bg-destructive text-white"
// Outline: class="bg-transparent text-foreground"
```

## Do's and Don'ts

### Do
- Use `class` input for all custom styles
- Add `gap-1` or `gap-1.5` when including icons
- Keep text short (1-3 words max)
- Use semantic colors consistently
- Add text alongside color for accessibility

### Don't
- Don't use `className` (React convention) - use `class`
- Don't rely on color alone for meaning
- Don't put long text in badges
- Don't use badges for everything

## Common Mistakes

1. **Using className instead of class** - Angular uses `class` input

2. **Color-only meaning** - Always add text alongside color for colorblind users

3. **Missing gap for icons** - Add `class="gap-1"` when badge contains SVG icons

4. **Long text in badges** - Badges truncate long text. Keep it under 3 words.

5. **Using npm install** - Use `npx @shadng/sng-ui add badge` (copy-paste model)

## Accessibility Summary

### Automatic Features
- Proper text contrast with semantic color tokens

### Developer Responsibilities
- Add descriptive text, don't rely on color alone
- Use `aria-label` on parent for notification counts
- Ensure sufficient color contrast for custom colors
