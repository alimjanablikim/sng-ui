
# ShadNG Tooltip

Lightweight tooltip directive for displaying contextual information on hover or focus. Built with Angular CDK Overlay for smart positioning, styled with Tailwind CSS.

## Installation

```bash
npx @shadng/sng-ui add tooltip
```

## Basic Usage

```html
<button [sngTooltip]="'Add to library'">
  <svg><!-- icon --></svg>
</button>
```

## Positioning

```html
<button [sngTooltip]="'Top tooltip'" sngTooltipPosition="top">Top</button>
<button [sngTooltip]="'Right tooltip'" sngTooltipPosition="right">Right</button>
<button [sngTooltip]="'Bottom tooltip'" sngTooltipPosition="bottom">Bottom</button>
<button [sngTooltip]="'Left tooltip'" sngTooltipPosition="left">Left</button>
```

## Custom Styling

```html
<button [sngTooltip]="'Danger action'" sngTooltipClass="bg-destructive text-destructive-foreground">
  Delete
</button>
```

## Icon Buttons with Tooltips

```html
<button [sngTooltip]="'Bold'" class="h-9 w-9 p-0">
  <svg><!-- bold icon --></svg>
</button>
<button [sngTooltip]="'Italic'" class="h-9 w-9 p-0">
  <svg><!-- italic icon --></svg>
</button>
```

## Focus Behavior

- Focus on the trigger shows the tooltip
- Blur on the trigger hides the tooltip

---

# SngTooltip Technical Reference

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, CDK primitives, edge cases.

## Component Architecture

```typescript
// 2 components - directive + internal content:
// 1. SngTooltip          - Directive applied to trigger elements
//                          Handles hover/focus events, creates CDK Overlay
// 2. SngTooltipContent   - Internal component created dynamically via ComponentPortal
//                          Renders tooltip text with animations

// Communication pattern:
// - SngTooltip creates SngTooltipContent via ComponentPortal
// - Sets text, side, state, customClass via componentRef.instance signals
// - No injection tokens (direct signal assignment)
```

## Component Interfaces

```typescript
// SngTooltip - Directive applied to trigger elements
interface SngTooltipApi {
  // INPUTS (all via input())
  sngTooltip: InputSignalWithTransform<string, string>;  // REQUIRED - tooltip text
  sngTooltipPosition: InputSignal<'top' | 'bottom' | 'left' | 'right'>;  // Default: 'top'
  sngTooltipClass: InputSignal<string>;  // Default: '' - custom CSS classes

  // METHODS (internal)
  show(): void;   // Shows tooltip via CDK Overlay
  hide(): void;   // Hides tooltip immediately
}

// SngTooltipContent - Internal component (created dynamically)
interface SngTooltipContentApi {
  // SIGNALS (set by parent directive)
  text: WritableSignal<string>;
  side: WritableSignal<'top' | 'bottom' | 'left' | 'right'>;
  state: WritableSignal<'open' | 'closed'>;
  customClass: WritableSignal<string>;

  // COMPUTED
  hostClasses(): string;  // Combines base + animation + custom classes
}
```

### TypeScript Types

```typescript
/** Tooltip position relative to trigger */
type SngTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/** Open/closed state for animations */
type SngTooltipState = 'open' | 'closed';
```

## Angular CDK Integration

```typescript
// SngTooltip uses CDK Overlay for positioning
@Directive({
  selector: '[sngTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focus)': 'show()',
    '(blur)': 'hide()',
  },
})
export class SngTooltip implements OnDestroy {
  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef);
}

// CDK Overlay provides:
// - FlexibleConnectedPositionStrategy for smart positioning
// - ScrollStrategy (close on scroll)
// - ComponentPortal for dynamic content
// - Automatic viewport edge detection
```

## Import Requirements

```typescript
// SINGLE DIRECTIVE IMPORT
import { SngTooltip } from 'sng-ui';

@Component({
  standalone: true,
  imports: [SngTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent { }
```

## Animation System

```typescript
// Self-contained CSS @keyframes in component styles block (no shared animation files)
// Per-side directional enter animations + generic exit animation

styles: [`
  sng-tooltip-content[data-state=open][data-side=bottom] { animation: sng-tooltip-enter-bottom 150ms ease both; }
  sng-tooltip-content[data-state=open][data-side=top] { animation: sng-tooltip-enter-top 150ms ease both; }
  sng-tooltip-content[data-state=open][data-side=left] { animation: sng-tooltip-enter-left 150ms ease both; }
  sng-tooltip-content[data-state=open][data-side=right] { animation: sng-tooltip-enter-right 150ms ease both; }
  sng-tooltip-content[data-state=closed] { animation: sng-tooltip-exit 150ms ease both; }
  @keyframes sng-tooltip-enter-bottom { from { opacity: 0; transform: scale(0.95) translateY(-0.5rem); } }
  @keyframes sng-tooltip-enter-top { from { opacity: 0; transform: scale(0.95) translateY(0.5rem); } }
  @keyframes sng-tooltip-enter-left { from { opacity: 0; transform: scale(0.95) translateX(0.5rem); } }
  @keyframes sng-tooltip-enter-right { from { opacity: 0; transform: scale(0.95) translateX(-0.5rem); } }
  @keyframes sng-tooltip-exit { to { opacity: 0; transform: scale(0.95); } }
`],

// Animations triggered by data-state and data-side host attributes
// Close disposes overlay - exit animation plays during dispose
```

## ARIA Compliance (Automatic)

```html
<!-- Generated ARIA structure -->
<button
  (mouseenter)="show()"
  (mouseleave)="hide()"
  (focus)="show()"
  (blur)="hide()">
  Trigger Text
</button>

<!-- CDK Overlay creates tooltip content -->
<sng-tooltip-content
  role="tooltip"
  data-side="top"
  data-state="open">
  Tooltip text
</sng-tooltip-content>
```

## Position Strategy

```typescript
// CDK flexibleConnectedTo positions
private getPosition(position: 'top' | 'bottom' | 'left' | 'right') {
  const positions = {
    top: {
      originX: 'center', originY: 'top',
      overlayX: 'center', overlayY: 'bottom',
      offsetY: -8,  // 8px gap above trigger
    },
    bottom: {
      originX: 'center', originY: 'bottom',
      overlayX: 'center', overlayY: 'top',
      offsetY: 8,   // 8px gap below trigger
    },
    left: {
      originX: 'start', originY: 'center',
      overlayX: 'end', overlayY: 'center',
      offsetX: -8,  // 8px gap left of trigger
    },
    right: {
      originX: 'end', originY: 'center',
      overlayX: 'start', overlayY: 'center',
      offsetX: 8,   // 8px gap right of trigger
    },
  };
  return positions[position];
}

// Scroll strategy: close on scroll
scrollStrategy: this.overlay.scrollStrategies.close()
```

## Edge Cases & Constraints

```typescript
// 1. DISABLED ELEMENTS DON'T FIRE EVENTS
// Wrap disabled buttons in a span:
<span [sngTooltip]="'Action unavailable'">
  <button disabled>Submit</button>
</span>

// 2. TOOLTIP CLOSES ON SCROLL
// Intentional UX - scroll strategy is CloseScrollStrategy
// Tooltip repositioning during scroll looks broken

// 3. NO HTML CONTENT
// Text-only tooltips. For rich content, use Popover component

// 4. NO DELAY API
// Shows immediately on hover/focus
// Extend directive for custom delay behavior

// 5. MULTIPLE TOOLTIPS
// Each directive creates its own overlay
// No global tooltip management needed

// 6. SSR SAFE
// CDK Overlay handles SSR automatically
// No window/document access in constructor

// 7. CLOSE BEHAVIOR
// hide() disposes overlay - exit animation plays via data-state="closed"
// Inline @keyframes in component styles (no shared animation files)
```

## Do's and Don'ts

### Do
- Use for icon-only buttons where meaning isn't obvious
- Keep tooltip text short (1-5 words ideal)
- Use `sngTooltipPosition` to avoid cursor overlap (top is default, works well)
- Apply to focusable elements for focus accessibility
- Use semantic trigger elements (button, a, input)

### Don't
- Add tooltips to buttons with visible labels ("Save" button doesn't need "Save" tooltip)
- Use for critical information (hover doesn't work on touch devices)
- Put long text in tooltips (use Popover for detailed content)
- Apply to non-interactive elements without tabindex
- Nest tooltip triggers (confusing UX)
- Rely on tooltips for mobile UX (hover doesn't exist)

## Common Mistakes

1. **Tooltip on disabled button** - Disabled elements don't fire mouse events. Wrap in a span and apply tooltip to the wrapper.

2. **Expecting HTML content** - Tooltips are text-only. Use `SngPopover` for rich content.

3. **Long tooltip text** - Keep it short. If you need more than a few words, the UI might need rethinking.

4. **Using on mobile-critical info** - Hover doesn't exist on touch devices. Find another way to communicate critical information.

5. **Missing import** - Only need `SngTooltip` directive. `SngTooltipContent` is internal.

6. **Expecting delay** - Tooltip shows immediately. Extend the directive for custom delay behavior.

## Accessibility Summary

### Automatic ARIA (no configuration needed)
- `role="tooltip"` on content
- Shows on both hover AND focus
- Hides on blur and mouseleave
- Uses CDK Overlay for proper stacking context

### Focus Support
- Focus-triggered tooltips work for screen readers
- Blur hides the tooltip automatically

### Touch Devices
- No hover on touch, so tooltips less useful
- Focus still works for focus navigation
- Consider always-visible labels for mobile-critical info
