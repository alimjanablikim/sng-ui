
# ShadNG Alert

Static feedback component for displaying success, error, warning, and informational messages. Uses semantic HTML with `role="alert"` for screen reader announcements.

## Installation

```bash
npx @shadng/sng-ui add alert
```

## Basic Usage

```html
<sng-alert>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
  <sng-alert-title>Success</sng-alert-title>
  <sng-alert-description>Your changes have been saved.</sng-alert-description>
</sng-alert>
```

## Destructive Style

Apply via class input for error/failure messages:

```html
<sng-alert class="text-destructive">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="m15 9-6 6M9 9l6 6"/>
  </svg>
  <sng-alert-title>Error</sng-alert-title>
  <sng-alert-description>Something went wrong.</sng-alert-description>
</sng-alert>
```

## Custom Styling with Classes

```html
<!-- Warning style -->
<sng-alert class="border-yellow-500/50 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
  <svg><!-- warning icon --></svg>
  <sng-alert-title>Warning</sng-alert-title>
  <sng-alert-description>Storage almost full.</sng-alert-description>
</sng-alert>

<!-- Success style -->
<sng-alert class="border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200">
  <svg><!-- check icon --></svg>
  <sng-alert-title>Success</sng-alert-title>
  <sng-alert-description>Operation completed.</sng-alert-description>
</sng-alert>
```

## Dismissible Alert

```typescript
import { Component, signal } from '@angular/core';
import { SngAlert, SngAlertTitle, SngAlertDescription } from 'sng-ui';

@Component({
  template: `
    @if (visible()) {
      <sng-alert class="relative pr-10">
        <sng-alert-title>Notification</sng-alert-title>
        <sng-alert-description>This can be dismissed.</sng-alert-description>
        <button
          class="absolute top-3 right-3 opacity-70 hover:opacity-100"
          (click)="visible.set(false)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
          <span class="sr-only">Close</span>
        </button>
      </sng-alert>
    }
  `
})
export class DismissibleComponent {
  visible = signal(true);
}
```

---

# SngAlert Technical Reference

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, component architecture, edge cases.

## API Reference

```typescript
// SngAlert - Root Container Component
interface SngAlertApi {
  // INPUTS (all via input())
  class: InputSignal<string>;  // Default: ''
}

// Host attributes: role="alert"
// Default classes:
//   Layout: 'relative w-full rounded-lg border px-4 py-3 text-sm'
//   Color: 'bg-card text-card-foreground'
//   Grid: 'grid grid-cols-[0_1fr] gap-y-0.5 items-start'
// Internal CSS: sng-alert:has(>svg) and sng-alert:has(>sng-icon) apply icon column + gap
//   Icon: direct child svg/sng-icon is aligned internally (offset, currentColor)

// SngAlertTitle - Title Component
interface SngAlertTitleApi {
  class: InputSignal<string>;  // Default: ''
}

// Default classes: 'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight'
// Selector: sng-alert-title (component, renders <h5>)

// SngAlertDescription - Description Component
interface SngAlertDescriptionApi {
  class: InputSignal<string>;  // Default: ''
}

// Default classes: 'col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground'
// Selector: sng-alert-description (component, renders <div>)
```

## Component Architecture

```typescript
/**
 * Architecture Overview
 *
 * CDK Modules: None (pure styling component)
 * Animations: None
 * Pattern: Compound component (container + title + description)
 * Layout: CSS Grid with direct-icon conditional columns (svg or sng-icon)
 * A11y: role="alert" (ARIA live region), semantic heading structure
 *
 * File Structure:
 * projects/sng-ui/src/lib/alert/
 * |-- sng-alert.ts              # Root component (selector: 'sng-alert')
 * |-- sng-alert-title.ts        # Title component (selector: 'sng-alert-title')
 * |-- sng-alert-description.ts  # Description component (selector: 'sng-alert-description')
 * `-- index.ts                  # Barrel export
 */
```

## Import Requirements

```typescript
import {
  SngAlert,
  SngAlertTitle,
  SngAlertDescription
} from 'sng-ui';

@Component({
  standalone: true,
  imports: [SngAlert, SngAlertTitle, SngAlertDescription],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent { }
```

## Grid Layout System

```typescript
/**
 * Alert uses CSS Grid with conditional columns based on direct icon presence:
 *
 * WITH ICON (sng-icon or svg as direct child):
 * +-----------------------------------------+
 * | [SVG]  |  Title (col-start-2)           |
 * |  4rem  |  Description (col-start-2)     |
 * +-----------------------------------------+
 * Grid: :has(>svg) or :has(>sng-icon) => grid-cols-[calc(var(--spacing)*4)_1fr]
 *
 * WITHOUT ICON:
 * +-----------------------------------------+
 * | Title (col-start-2, col 1 width = 0)   |
 * | Description                             |
 * +-----------------------------------------+
 * Grid: grid-cols-[0_1fr]
 *
 * CRITICAL: Icon must be a direct child for detection to work
 * WRONG: <div><sng-icon .../></div> or <div><svg>...</svg></div>
 * CORRECT: <sng-icon .../> or <svg>...</svg> directly under sng-alert
 */
```

## Custom Styling Examples

```typescript
// Apply colors via class input - no built-in variants

// Destructive (error)
class="text-destructive"

// Warning (yellow)
class="border-yellow-500/50 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"

// Success (green)
class="border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200"

// Info (blue)
class="border-blue-500/50 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
```

## Do's and Don'ts

### Do
- Apply colors via `class` input for full customization
- Place icon (`sng-icon` or `svg`) as a direct child of `sng-alert` for grid layout
- Use `@if` control flow for conditional rendering of dismissible alerts
- Include `<span class="sr-only">Close</span>` in dismiss buttons
- Use theme tokens like `text-destructive` instead of hardcoded colors
- Keep alert messages concise and actionable

### Don't
- Wrap icon in a container div (breaks direct-child detection)
- Use inline styles like `style="color: red"` for colors
- Use `[hidden]` or `display: none` instead of `@if` for conditional rendering
- Write long paragraph text - keep messages scannable
- Use alert for temporary confirmations (use Toast instead)
- Forget dark mode variants when using custom colors

## Common Mistakes

1. **Icon wrapped in div breaks grid layout** - The grid checks for a direct `sng-icon`/`svg` child. Wrapping icons in a div breaks detection.

2. **Missing dark mode variants** - Custom color classes like `bg-yellow-50` need `dark:` variants: `dark:bg-yellow-950`.

3. **Using Alert vs Alert Dialog** - Alert is passive notification. Alert Dialog is modal requiring response. Use Alert Dialog for confirmations.

4. **Forgetting sr-only text** - Dismiss buttons need `<span class="sr-only">Close</span>` for screen readers.

5. **Using npm install** - Use `npx @shadng/sng-ui add alert` (copy-paste model, not npm dependency).

## Accessibility Summary

| Feature | Implementation |
|---------|----------------|
| Live Region | `role="alert"` announces content immediately to screen readers |
| Semantic Structure | Use `<h5>` (or appropriate level) for title, proper heading hierarchy |
| Close Button | Include `<span class="sr-only">Close</span>` for screen reader text |
| Color Contrast | Use theme tokens for sufficient contrast in all themes |
| Focus Management | Dismiss button must be focus focusable |

### Screen Reader Behavior

- `role="alert"` creates ARIA live region with `aria-live="assertive"`
- Content announced immediately when rendered or changed
- Avoid frequent updates - each change triggers announcement
- Use for important, time-sensitive information
