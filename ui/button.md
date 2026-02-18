# ShadNG Button

Angular button component with class-based styling and loading states. Built with TypeScript and Tailwind CSS using Angular CDK.

## Installation

```bash
npx @shadng/sng-ui add button
```

## Basic Usage

```html
<!-- Default (Primary) style -->
<sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">
  Primary
</sng-button>

<!-- Destructive style -->
<sng-button class="bg-destructive text-white hover:bg-destructive/90">
  Delete
</sng-button>

<!-- Outline style -->
<sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">
  Cancel
</sng-button>
```

## Style Classes Reference

```html
<!-- DEFAULT (Primary action) -->
<sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">
  Default
</sng-button>

<!-- SECONDARY (Less prominent) -->
<sng-button class="bg-secondary text-secondary-foreground hover:bg-secondary/80">
  Secondary
</sng-button>

<!-- DESTRUCTIVE (Dangerous actions) -->
<sng-button class="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20">
  Destructive
</sng-button>

<!-- OUTLINE (With border) -->
<sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
  Outline
</sng-button>

<!-- GHOST (Minimal, transparent) -->
<sng-button class="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
  Ghost
</sng-button>

<!-- LINK (Text link appearance) -->
<sng-button class="text-primary underline-offset-4 hover:underline">
  Link
</sng-button>
```

## Sizes (via Tailwind classes)

```html
<sng-button class="h-8 px-3 text-xs bg-primary text-primary-foreground">Small</sng-button>
<sng-button class="bg-primary text-primary-foreground">Default</sng-button>
<sng-button class="h-10 px-6 text-base bg-primary text-primary-foreground">Large</sng-button>
<sng-button class="size-9 p-0 bg-primary text-primary-foreground" aria-label="Settings">
  <svg>...</svg>
</sng-button>
```

---

# SngButton Technical Reference

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, component composition, accessibility patterns.

## Component Architecture

```typescript
// 1 component (standalone):
// 1. SngButton - Interactive button with class-based styling, loading state, FocusMonitor
```

## API Reference

```typescript
/**
 * Button type attribute.
 */
export type SngButtonType = 'button' | 'submit' | 'reset';

/**
 * Button component for user interactions.
 * Renders as <button> by default, or <a> when href is provided.
 * Style using Tailwind classes via the class input.
 */
@Component({
  selector: 'sng-button',
})
export class SngButton {
  /** Custom CSS classes for styling. See style patterns below. */
  class = input<string>('');

  /** Disabled state. */
  disabled = input(false, { transform: booleanAttribute });

  /** Loading state with spinner. Disables button when true. */
  loading = input(false, { transform: booleanAttribute });

  /** Button type attribute (only for button, not anchor). @default 'button' */
  type = input<SngButtonType>('button');

  /** URL for anchor. When provided, renders as <a> instead of <button>. */
  href = input<string>();

  /** Target attribute for anchor. */
  target = input<string>();

  /** Rel attribute for anchor. */
  rel = input<string>();
}
```

## CDK Usage

```
CDK: FocusMonitor from @angular/cdk/a11y

Button uses FocusMonitor for:
- Tracking focus origin (focus, mouse, touch, programmatic)
- Applying appropriate focus styles based on origin
- No overlay, positioning, or complex CDK primitives needed
```

## Import Requirements

```typescript
import { SngButton, type SngButtonType } from 'sng-ui';

@Component({
  imports: [SngButton],
})
```

## Style Classes Reference

```typescript
/*
 * BUTTON STYLE CLASSES - Copy these Tailwind patterns for consistent styling
 *
 * DEFAULT (Primary action):
 *   bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
 *
 * DESTRUCTIVE (Dangerous actions like delete):
 *   bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60
 *
 * OUTLINE (Secondary with border):
 *   border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50
 *
 * SECONDARY (Less prominent):
 *   bg-secondary text-secondary-foreground hover:bg-secondary/80
 *
 * GHOST (Minimal, transparent):
 *   hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50
 *
 * LINK (Text link appearance):
 *   text-primary underline-offset-4 hover:underline
 *
 * SIZE CLASSES:
 *   SMALL:   h-8 px-3 text-xs
 *   DEFAULT: h-9 px-4 py-2 text-sm (built-in)
 *   LARGE:   h-10 px-6 text-base
 *   ICON:    size-9 p-0
 */
```

## Size via Tailwind Classes

```html
<!-- Default size (h-9) is built-in -->
<sng-button class="bg-primary text-primary-foreground">Default</sng-button>

<!-- Small -->
<sng-button class="h-8 px-3 text-xs bg-primary text-primary-foreground">Small</sng-button>

<!-- Large -->
<sng-button class="h-10 px-6 text-base bg-primary text-primary-foreground">Large</sng-button>

<!-- Icon button -->
<sng-button class="size-9 p-0 bg-primary text-primary-foreground" aria-label="Close">
  <svg>...</svg>
</sng-button>

<!-- Extra large (custom) -->
<sng-button class="h-12 px-8 bg-primary text-primary-foreground">Extra Large</sng-button>

<!-- Full width -->
<sng-button class="w-full bg-primary text-primary-foreground">Full Width</sng-button>
```

## Loading State Pattern

```html
<!-- Loading spinner shown automatically -->
<sng-button [loading]="isSubmitting" class="bg-primary text-primary-foreground">
  {{ isSubmitting ? 'Saving...' : 'Save' }}
</sng-button>
```

```typescript
// Component logic
isSubmitting = signal(false);

async onSubmit() {
  this.isSubmitting.set(true);
  try {
    await this.service.save();
  } finally {
    this.isSubmitting.set(false);
  }
}
```

## Anchor Button Pattern

```html
<!-- Link styled as button -->
<sng-button href="/docs" class="bg-primary text-primary-foreground">Documentation</sng-button>

<!-- Internal route -->
<sng-button href="/settings" class="bg-primary text-primary-foreground">Settings</sng-button>

<!-- External link -->
<sng-button class="border bg-background shadow-xs hover:bg-accent" href="https://github.com" target="_blank">
  GitHub
</sng-button>
```

## Accessibility Patterns

```html
<!-- Standard button -->
<sng-button class="bg-primary text-primary-foreground">Submit</sng-button>

<!-- Disabled with explanation -->
<sng-button [disabled]="!form.valid" title="Fill all required fields" class="bg-primary text-primary-foreground">
  Submit
</sng-button>

<!-- Icon button with accessible label -->
<sng-button class="size-9 p-0 hover:bg-accent hover:text-accent-foreground" aria-label="Close dialog">
  <svg><!-- X icon --></svg>
</sng-button>

<!-- Button that opens menu -->
<sng-button aria-haspopup="menu" aria-expanded="false" class="bg-primary text-primary-foreground">
  Options
</sng-button>
```

## Do's and Don'ts

### Do
- Use documented Tailwind class patterns for consistent styling
- Use `class` input with appropriate style and size classes
- Use `loading` input during async operations
- Use `href` input for navigation buttons (renders as anchor)
- Add `aria-label` to icon-only buttons
- One primary action per view

### Don't
- Don't create custom style inputs (use `class` with Tailwind patterns)
- Don't use multiple primary buttons competing for attention
- Don't hide unavailable buttons (disable them instead)
- Don't use ghost style for important actions
- Don't forget loading state feedback during async operations

## Common Mistakes

1. **Missing style classes**
   ```html
   <!-- [X] Wrong - no style classes -->
   <sng-button>Click me</sng-button>

   <!-- [OK] Correct - with style classes -->
   <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">
     Click me
   </sng-button>
   ```

2. **Missing loading state during async**
   ```html
   <!-- [X] Wrong - no feedback -->
   <sng-button (click)="save()" class="bg-primary text-primary-foreground">Save</sng-button>

   <!-- [OK] Correct -->
   <sng-button [loading]="isSaving" (click)="save()" class="bg-primary text-primary-foreground">
     Save
   </sng-button>
   ```

3. **Icon button without accessible label**
   ```html
   <!-- [X] Wrong -->
   <sng-button class="size-9 p-0 bg-primary text-primary-foreground"><svg>...</svg></sng-button>

   <!-- [OK] Correct -->
   <sng-button class="size-9 p-0 bg-primary text-primary-foreground" aria-label="Close">
     <svg>...</svg>
   </sng-button>
   ```

## Performance Notes

```
- OnPush change detection for minimal re-renders
- FocusMonitor cleanup in ngOnDestroy prevents memory leaks
- Loading spinner is conditionally rendered with @if
- buttonClasses computed() only recalculates when inputs change
- No animations library - hover states via Tailwind CSS
```

## Accessibility Summary

```
- Native button semantics preserved
- aria-disabled reflects disabled/loading state
- aria-busy indicates loading state to assistive technology
- Focus ring visible on focus navigation (focus-visible)
- Disabled state prevents pointer events
- FocusMonitor tracks focus origin for appropriate styling
```
