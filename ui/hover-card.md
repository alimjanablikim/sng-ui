
# ShadNG Hover Card

Rich content preview on hover using Angular CDK Overlay. Configurable open/close delays, four-direction positioning, content stays hoverable.

## Installation

```bash
npx @shadng/sng-ui add hover-card
```

## Basic Usage

```html
<sng-hover-card>
  <sng-hover-card-trigger href="#">@username</sng-hover-card-trigger>
  <sng-hover-card-content>
    <div class="flex gap-4">
      <img src="avatar.jpg" alt="Avatar" class="w-12 h-12 rounded-full" />
      <div>
        <h4 class="font-semibold">Display Name</h4>
        <p class="text-sm text-muted-foreground">User bio here</p>
      </div>
    </div>
  </sng-hover-card-content>
</sng-hover-card>
```

## Position Options

```html
<!-- Top position -->
<sng-hover-card side="top">
  <sng-hover-card-trigger>Hover me</sng-hover-card-trigger>
  <sng-hover-card-content>
    <p>Content appears above the trigger.</p>
  </sng-hover-card-content>
</sng-hover-card>

<!-- Bottom (default) -->
<sng-hover-card side="bottom">...</sng-hover-card>

<!-- Left -->
<sng-hover-card side="left">...</sng-hover-card>

<!-- Right -->
<sng-hover-card side="right">...</sng-hover-card>
```

## Custom Delays

```html
<!-- Faster open, slower close for interactive content -->
<sng-hover-card [openDelay]="100" [closeDelay]="500">
  <sng-hover-card-trigger href="#">Trigger</sng-hover-card-trigger>
  <sng-hover-card-content>
    <button>Clickable button inside</button>
  </sng-hover-card-content>
</sng-hover-card>
```

## User Profile Preview

```html
<sng-hover-card>
  <sng-hover-card-trigger class="text-primary hover:underline">@design-lead</sng-hover-card-trigger>
  <sng-hover-card-content class="w-80">
    <div class="flex justify-between space-x-4">
      <sng-avatar class="h-12 w-12">
        <sng-avatar-image src="https://avatars.githubusercontent.com/u/9919?v=4" alt="Design Lead" />
        <sng-avatar-fallback>DL</sng-avatar-fallback>
      </sng-avatar>
      <div class="space-y-1">
        <h4 class="text-sm font-semibold">@design-lead</h4>
        <p class="text-sm text-muted-foreground">
          Creator of shadcn/ui. Building beautiful UIs.
        </p>
        <div class="flex items-center pt-2">
          <span class="text-xs text-muted-foreground">120K followers</span>
        </div>
      </div>
    </div>
  </sng-hover-card-content>
</sng-hover-card>
```

---

# SngHoverCard Technical Reference

## Component Architecture

```typescript
// 3 components in compound pattern:
// 1. SngHoverCard - Root container managing state and CDK Overlay
// 2. SngHoverCardTrigger - Directive marking hover trigger element
// 3. SngHoverCardContent - Content panel rendered via CDK Portal
```

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, CDK primitives, edge cases.

## Component Interfaces

```typescript
// SngHoverCard - Root Container
interface SngHoverCardApi {
  // INPUTS (all via input())
  class: InputSignal<string>;           // Default: ''
  side: InputSignal<HoverCardSide>;     // Default: 'bottom'
  openDelay: InputSignal<number>;       // Default: 200
  closeDelay: InputSignal<number>;      // Default: 300

  // INTERNAL STATE
  isOpen: WritableSignal<boolean>;

  // CONTENT QUERIES
  trigger: Signal<SngHoverCardTrigger | undefined>;
  content: Signal<SngHoverCardContent | undefined>;

  // METHODS
  onTriggerEnter(triggerElement: ElementRef): void;
  onTriggerLeave(): void;
  onContentEnter(): void;
  onContentLeave(): void;
  hide(): void;
}

// SngHoverCardTrigger - Hover Trigger Directive
interface SngHoverCardTriggerApi {
  // METHODS
  registerHoverCard(hoverCard: SngHoverCard): void;
  onMouseEnter(): void;
  onMouseLeave(): void;
}

// SngHoverCardContent - Content Panel Component
interface SngHoverCardContentApi {
  // INPUTS
  class: InputSignal<string>;           // Default: ''

  // COMPUTED
  dataSide: Signal<HoverCardSide>;
  hostClasses: Signal<string>;

  // TEMPLATE ACCESS
  templateRef: TemplateRef<unknown>;
  viewContainerRef: ViewContainerRef;

  // METHODS
  onMouseEnter(): void;
  onMouseLeave(): void;
}
```

### TypeScript Types

```typescript
/** Position of hover card relative to trigger */
type HoverCardSide = 'top' | 'bottom' | 'left' | 'right';

/** Data-state attribute values */
type HoverCardState = 'open' | 'closed';

// Exported from index.ts
export type { HoverCardSide } from './sng-hover-card';
```

## Angular CDK Integration

```typescript
// SngHoverCard uses CDK Overlay for positioning
import { Overlay, OverlayRef, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'sng-hover-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`
})
export class SngHoverCard implements AfterContentInit, OnDestroy {
  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private overlayRef: OverlayRef | null = null;

  // Position strategy uses flexibleConnectedTo for smart positioning
  private show(triggerElement: ElementRef) {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(triggerElement)
      .withPositions([this.getPosition(this.side())]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    const portal = new TemplatePortal(
      contentComponent.templateRef,
      contentComponent.viewContainerRef
    );
    this.overlayRef.attach(portal);
  }
}

// CDK Provides:
// - Smart viewport-aware positioning
// - Scroll strategy (close on scroll)
// - Portal rendering outside component tree
// - Automatic cleanup on destroy
```

## Import Requirements

```typescript
// ALL 3 COMPONENTS REQUIRED
import {
  SngHoverCard,
  SngHoverCardTrigger,
  SngHoverCardContent
} from 'sng-ui';

// Types (optional, for strict typing)
import type { HoverCardSide } from 'sng-ui';

@Component({
  standalone: true,
  imports: [
    SngHoverCard,
    SngHoverCardTrigger,
    SngHoverCardContent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent { }
```

## Delay Mechanism

```typescript
// OPEN DELAY - prevents accidental triggers
// User must hover for openDelay ms before card shows
private openTimeout: ReturnType<typeof setTimeout> | null = null;

onTriggerEnter(triggerElement: ElementRef) {
  this.clearCloseTimeout();  // Cancel pending close
  if (this.isOpen()) return;

  this.openTimeout = setTimeout(() => {
    this.show(triggerElement);
  }, this.openDelay());  // Default: 200ms
}

// CLOSE DELAY - allows moving cursor to content
// Card stays open for closeDelay ms after leaving trigger
private closeTimeout: ReturnType<typeof setTimeout> | null = null;

onTriggerLeave() {
  this.clearOpenTimeout();  // Cancel pending open
  this.scheduleClose();
}

private scheduleClose() {
  this.closeTimeout = setTimeout(() => {
    this.hide();
  }, this.closeDelay());  // Default: 300ms
}

// CONTENT HOVERABLE - cancel close when entering content
onContentEnter() {
  this.clearCloseTimeout();  // Keep card open
}

onContentLeave() {
  this.scheduleClose();  // Start close timer again
}
```

## Animation System

```typescript
// Self-contained CSS @keyframes in component styles block (no shared animation files)
// Per-side directional enter animations + generic exit animation

styles: [`
  .sng-hover-card-content[data-state=open][data-side=bottom] { animation: sng-hover-card-enter-bottom 150ms ease both; }
  .sng-hover-card-content[data-state=open][data-side=top] { animation: sng-hover-card-enter-top 150ms ease both; }
  .sng-hover-card-content[data-state=open][data-side=left] { animation: sng-hover-card-enter-left 150ms ease both; }
  .sng-hover-card-content[data-state=open][data-side=right] { animation: sng-hover-card-enter-right 150ms ease both; }
  .sng-hover-card-content[data-state=closed] { animation: sng-hover-card-exit 150ms ease both; }
  @keyframes sng-hover-card-enter-bottom { from { opacity: 0; transform: scale(0.95) translateY(-0.5rem); } }
  @keyframes sng-hover-card-enter-top { from { opacity: 0; transform: scale(0.95) translateY(0.5rem); } }
  // ... left, right, exit keyframes
`],

// hostClasses applies base styling, sng-hover-card-content class for animation targeting
hostClasses = computed(() =>
  cn(
    'z-50 w-64 rounded-md border border-border bg-popover text-popover-foreground p-4 shadow-md outline-none',
    'sng-hover-card-content',
    this.class()
  )
);

// Data attributes for animation targeting
dataSide = computed(() => this.hoverCard?.side() ?? 'bottom');
```

## Position Configuration

```typescript
// Position mapping for CDK Overlay
private getPosition(side: HoverCardSide) {
  const positions = {
    top: {
      originX: 'center' as const,
      originY: 'top' as const,
      overlayX: 'center' as const,
      overlayY: 'bottom' as const,
      offsetY: -4,  // 4px gap
    },
    bottom: {
      originX: 'center' as const,
      originY: 'bottom' as const,
      overlayX: 'center' as const,
      overlayY: 'top' as const,
      offsetY: 4,
    },
    left: {
      originX: 'start' as const,
      originY: 'center' as const,
      overlayX: 'end' as const,
      overlayY: 'center' as const,
      offsetX: -4,
    },
    right: {
      originX: 'end' as const,
      originY: 'center' as const,
      overlayX: 'start' as const,
      overlayY: 'center' as const,
      offsetX: 4,
    },
  };
  return positions[side];
}
```

## Trigger Implementation

```typescript
// SngHoverCardTrigger is a directive, not a component
@Directive({
  selector: 'sng-hover-card-trigger',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class SngHoverCardTrigger {
  private elementRef = inject(ElementRef);
  private hoverCard: SngHoverCard | null = null;

  registerHoverCard(hoverCard: SngHoverCard) {
    this.hoverCard = hoverCard;
  }

  onMouseEnter() {
    this.hoverCard?.onTriggerEnter(this.elementRef);
  }

  onMouseLeave() {
    this.hoverCard?.onTriggerLeave();
  }
}
```

## Close Behavior

```typescript
// Close disposes overlay - exit animation plays via data-state="closed" + CSS @keyframes
hide() {
  if (!this.lifecycle.hasOverlay()) return;
  this.lifecycle.close();  // Triggers exit animation, then disposes
}

// Animations are inline @keyframes in the component styles block (self-contained)
```

## Edge Cases & Constraints

```typescript
// 1. TRIGGER MUST BE REGISTERED
// Content queries find trigger in ngAfterContentInit
ngAfterContentInit() {
  const triggerDirective = this.trigger();
  if (triggerDirective) {
    triggerDirective.registerHoverCard(this);
  }
}

// 2. POINTER-DRIVEN OPENING
// Hover card opens from mouseenter on trigger

// 3. CONTENT TEMPLATE PORTAL
// Content uses ng-template for CDK Portal
template: `
  <ng-template #content>
    <div class="sng-hover-card-content" [class]="hostClasses()">
      <ng-content />
    </div>
  </ng-template>
`

// 4. SCROLL CLOSES
// CDK scroll strategy closes on scroll
scrollStrategy: this.overlay.scrollStrategies.close()

// 5. CLEANUP ON DESTROY
ngOnDestroy() {
  this.clearOpenTimeout();
  this.clearCloseTimeout();
  this.dispose();
}

// 6. NO NESTED HOVER CARDS
// Strongly discouraged - UX nightmare
// Each hover card is independent

// 7. MOBILE FALLBACK
// Hover doesn't exist on touch devices
// Focus-based opening provides some accessibility
```

## Delay Tuning Guidelines

```typescript
// DEFAULT DELAYS
openDelay = 200;   // Prevents accidental triggers
closeDelay = 300;  // Time to move cursor to content

// QUICK PREVIEW (non-interactive content)
<sng-hover-card [openDelay]="100" [closeDelay]="100">

// INTERACTIVE CONTENT (buttons, links inside)
<sng-hover-card [openDelay]="200" [closeDelay]="500">

// SLOW PREVIEW (prevent annoyance)
<sng-hover-card [openDelay]="400" [closeDelay]="200">

// The close delay must be long enough for users to:
// 1. Move cursor from trigger to content
// 2. Not lose the card during slight movements
```

## Do's and Don'ts

### Do
- Use hover cards for preview content (profiles, stats, summaries)
- Increase `closeDelay` if content has interactive elements
- Provide alternative access for touch device users
- Keep content scannable - avatar, name, short bio
- Use `side` prop to avoid viewport edge clipping
- Test the delays in real usage scenarios
- Combine with Avatar component for user previews

### Don't
- Nest hover cards inside hover cards
- Put critical information only in hover cards
- Use hover cards for tooltips (use Tooltip instead)
- Set delays to 0 (too jumpy)
- Forget touch fallbacks for hover-only content
- Load heavy data synchronously in content
- Use hover cards on mobile-first applications

## Common Mistakes

1. **Missing SngHoverCardTrigger element** - The trigger element must be wrapped with `<sng-hover-card-trigger>`.

2. **Expecting click to open** - Hover cards open on hover, not click. Use Popover for click-to-open behavior.

3. **Close delay too short** - Users can't reach the content before it closes. Increase `closeDelay` to at least 300ms.

4. **Content not staying open** - Make sure the content div has proper mouse event handlers. Content should call `onContentEnter()` and `onContentLeave()`.

5. **Using npm install** - Use `npx @shadng/sng-ui add hover-card` (copy-paste model, not npm dependency).

6. **Forgetting Avatar imports** - Profile previews often use Avatar. Import `SngAvatar`, `SngAvatarImage`, `SngAvatarFallback`.

7. **Not testing hover behavior** - Verify open and close delays with real pointer movement.

8. **Heavy API calls on hover** - Preload data when possible. Show skeleton while loading.

## Hover Card vs Tooltip vs Popover

```typescript
// TOOLTIP - Simple text hints
// Opens instantly, plain text only
<span [sngTooltip]="'Delete this item'">
  <button>X</button>
</span>

// HOVER CARD - Rich content preview
// Opens with delay, rich templates, stays open while hovering content
<sng-hover-card>
  <sng-hover-card-trigger>@user</sng-hover-card-trigger>
  <sng-hover-card-content>
    <div>Avatar, bio, stats...</div>
  </sng-hover-card-content>
</sng-hover-card>

// POPOVER - Interactive content on click
// Opens on click, requires explicit close
<sng-popover>
  <sng-popover-trigger><button>Settings</button></sng-popover-trigger>
  <sng-popover-content>
    <form>...</form>
  </sng-popover-content>
</sng-popover>
```

## Accessibility Summary

### Automatic Behavior
- - Content rendered in overlay (proper stacking)
- `data-state` and `data-side` attributes for styling

### Developer Responsibilities
- - Provide alternative access for mobile users
- Don't hide critical information in hover-only content
- 
