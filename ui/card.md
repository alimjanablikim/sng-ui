
# ShadNG Card

Angular card component with header, content, and footer sections. Built with TypeScript and Tailwind CSS.

## Installation

```bash
npx @shadng/sng-ui add card
```

## Basic Usage

```html
<sng-card class="w-[350px]">
  <sng-card-header>
    <sng-card-title>Create project</sng-card-title>
    <sng-card-description>Deploy your new project in one-click.</sng-card-description>
  </sng-card-header>
  <sng-card-content>
    <!-- Content here -->
  </sng-card-content>
  <sng-card-footer>
    <sng-button>Deploy</sng-button>
  </sng-card-footer>
</sng-card>
```

## Components

| Component | Type | Purpose |
|-----------|------|---------|
| `sng-card` | Component | Container with border, shadow, and padding |
| `sng-card-header` | Component | Header section for title and description |
| `sng-card-title` | Component | Title with semantic heading (h1-h6 via level input) |
| `sng-card-description` | Component | Description text styling |
| `sng-card-content` | Component | Main content area |
| `sng-card-footer` | Component | Footer section for actions |

---

# SngCard Technical Reference

High-performance technical reference for SngCard component. Card is a compound presentational component - no CDK needed.

## TypeScript Interfaces

```typescript
// All card components share the same simple API
interface SngCardInputs {
  /** Custom CSS classes to merge with default styles */
  class: InputSignal<string>; // default: ''
}

// Component selectors (all use element selectors)
type CardSelectors =
  | 'sng-card'              // Container component
  | 'sng-card-header'       // Header component
  | 'sng-card-content'      // Content component
  | 'sng-card-footer'       // Footer component
  | 'sng-card-title'        // Title component (element selector)
  | 'sng-card-description'; // Description component (element selector)

// SngCardTitle additional inputs
interface SngCardTitleInputs {
  /** Heading level. @default 'h3' */
  level: InputSignal<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;
}
```

## CDK Assessment

```typescript
// CDK Decision: NO CDK NEEDED
// Card is purely presentational:
// - No overlay/portal positioning
// - No focus trapping
// - No focus navigation
// - No accordion behavior
// - No listbox/menu interactions

// Card uses ONLY:
// - Tailwind CSS for styling
// - Angular signals for class input
// - cn() utility for class merging
```

## Component Architecture

```typescript
// Compound component pattern - 6 parts
// Each part is independently usable

// SngCard - Container
@Component({
  selector: 'sng-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngCard {
  class = input<string>('');
  hostClasses = computed(() =>
    cn('flex flex-col gap-6 rounded-xl border border-border bg-card text-card-foreground py-6 shadow-sm', this.class())
  );
}

// SngCardHeader - Header section
@Component({
  selector: 'sng-card-header',
  host: { '[class]': 'hostClasses()' },
  // ...
})
// Base: 'flex flex-col gap-1.5 px-6'

// SngCardContent - Main content
@Component({
  selector: 'sng-card-content',
  host: { '[class]': 'hostClasses()' },
  // ...
})
// Base: 'px-6'

// SngCardFooter - Footer actions
@Component({
  selector: 'sng-card-footer',
  host: { '[class]': 'hostClasses()' },
  // ...
})
// Base: 'flex items-center px-6'

// SngCardTitle - Title component (element selector)
@Component({
  selector: 'sng-card-title',
  host: { 'class': 'contents' },
  template: `
    @switch (level()) {
      @case ('h1') { <h1 [class]="titleClasses()"><ng-content /></h1> }
      @case ('h2') { <h2 [class]="titleClasses()"><ng-content /></h2> }
      // ... other cases
      @default { <h3 [class]="titleClasses()"><ng-content /></h3> }
    }
  `,
})
export class SngCardTitle {
  level = input<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>('h3');
  class = input<string>('');
}
// Base: '!m-0 font-semibold leading-none tracking-tight'

// SngCardDescription - Description component (element selector)
@Component({
  selector: 'sng-card-description',
  host: { 'class': 'contents' },
  template: `<p [class]="descriptionClasses()"><ng-content /></p>`,
})
// Base: '!m-0 text-sm text-muted-foreground'
```

## Import Pattern

```typescript
import {
  SngCard,
  SngCardHeader,
  SngCardTitle,
  SngCardDescription,
  SngCardContent,
  SngCardFooter,
} from 'sng-ui';

@Component({
  imports: [
    SngCard,
    SngCardHeader,
    SngCardTitle,
    SngCardDescription,
    SngCardContent,
    SngCardFooter,
  ],
})
```

## Usage Patterns

```html
<!-- Full card with all parts -->
<sng-card class="w-[350px]">
  <sng-card-header>
    <sng-card-title>Title</sng-card-title>
    <sng-card-description>Description text</sng-card-description>
  </sng-card-header>
  <sng-card-content>
    Content here
  </sng-card-content>
  <sng-card-footer class="justify-between">
    <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Cancel</sng-button>
    <sng-button>Submit</sng-button>
  </sng-card-footer>
</sng-card>

<!-- Minimal card (content only) -->
<sng-card>
  <sng-card-content>
    Just content, no header or footer
  </sng-card-content>
</sng-card>

<!-- Stats card (header + content) -->
<sng-card>
  <sng-card-header>
    <sng-card-description>Total Revenue</sng-card-description>
    <sng-card-title class="text-3xl">$15,231.89</sng-card-title>
  </sng-card-header>
  <sng-card-content>
    <!-- Chart content -->
  </sng-card-content>
</sng-card>

<!-- Card grid layout -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <sng-card>...</sng-card>
  <sng-card>...</sng-card>
  <sng-card>...</sng-card>
</div>
```

## Do's and Don'ts

### Do
- Use `sng-card-title` component with `level` input for semantic headings
- Set width on the card, not the parent container
- Use `class` input for custom styling (margins, widths)
- Keep card content scannable - title + description + action
- Use CSS Grid for card layouts: `grid grid-cols-3 gap-4`

### Don't
- Don't nest cards inside cards (visual confusion)
- Don't use all parts if not needed (cards are composable)
- Don't put long paragraphs in cards (use different layout)
- Don't apply width to individual cards in a grid (let grid control)
- Don't use `className` (React convention) - use `class`

## Common Mistakes

```typescript
// WRONG: Using className (React convention)
<sng-card className="w-full">  // Won't work

// CORRECT: Using class input
<sng-card class="w-full">

// WRONG: Not using card title component
<span>Title</span>  // Works but not semantic

// CORRECT: Using card title component (renders h3 by default)
<sng-card-title>Title</sng-card-title>
<sng-card-title level="h2">Section Title</sng-card-title>

// WRONG: Nested cards
<sng-card>
  <sng-card>Inner</sng-card>  // Visual confusion
</sng-card>

// CORRECT: Use dividers or sections
<sng-card>
  <div class="border-t pt-4">Section</div>
</sng-card>
```

## Accessibility Summary

- Use semantic headings (h1-h6) for card titles
- Card structure provides natural reading order
- No special ARIA attributes needed (purely presentational)
- For clickable cards, wrap in anchor or add role="button"
- Ensure sufficient color contrast in card content
- Focus management: if card is interactive, add tabindex and focus styles
