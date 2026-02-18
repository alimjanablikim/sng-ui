
# ShadNG Drawer

Mobile-friendly slide panel built on Angular CDK. Slides from any edge with smooth animations, focus trapping, and backdrop management. Perfect for touch interfaces.

## Installation

```bash
npx @shadng/sng-ui add drawer
```

## Basic Usage

```html
<sng-drawer #drawer>
  <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="drawer.open(content)">Open Drawer</sng-button>
</sng-drawer>
<ng-template #content>
  <sng-drawer-content>
    <sng-drawer-handle></sng-drawer-handle>
    <sng-drawer-header>
      <sng-drawer-title>Title</sng-drawer-title>
      <sng-drawer-description>Description text here.</sng-drawer-description>
    </sng-drawer-header>
    <div class="p-4">Your content here</div>
    <sng-drawer-footer>
      <sng-drawer-close>
        <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Cancel</sng-button>
      </sng-drawer-close>
      <sng-drawer-close>
        <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">Save</sng-button>
      </sng-drawer-close>
    </sng-drawer-footer>
  </sng-drawer-content>
</ng-template>
```

## Side Variants

```html
<!-- Slide from top -->
<sng-drawer #topDrawer side="top">
  <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="topDrawer.open(content)">From Top</sng-button>
</sng-drawer>

<!-- Slide from right (sidebar pattern) -->
<sng-drawer #rightDrawer side="right">
  <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="rightDrawer.open(content)">From Right</sng-button>
</sng-drawer>

<!-- Slide from left (navigation pattern) -->
<sng-drawer #leftDrawer side="left">
  <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="leftDrawer.open(content)">From Left</sng-button>
</sng-drawer>

<!-- Slide from bottom (default) -->
<sng-drawer #bottomDrawer side="bottom">
  <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="bottomDrawer.open(content)">From Bottom</sng-button>
</sng-drawer>
```

## Custom Dimensions

Use the `class` input on `sng-drawer-content` to customize width and height:

```html
<!-- Right drawer with custom height (300px instead of full height) -->
<sng-drawer #drawer side="right">
  <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="drawer.open(content)">Open</sng-button>
</sng-drawer>
<ng-template #content>
  <sng-drawer-content class="h-[300px]">
    <!-- Compact panel for quick actions -->
  </sng-drawer-content>
</ng-template>

<!-- Bottom drawer with custom width (400px, positioned left) -->
<sng-drawer #drawer side="bottom">
  <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="drawer.open(content)">Open</sng-button>
</sng-drawer>
<ng-template #content>
  <!-- right-auto unsets right:0, so only left:0 remains -->
  <sng-drawer-content class="w-[400px] right-auto">
    <!-- Narrow panel positioned to the left -->
  </sng-drawer-content>
</ng-template>
```

## Custom Positions

Position drawers with specific offsets using Tailwind classes:

```html
<!-- Top drawer: 100px from left edge -->
<sng-drawer-content class="w-[300px] right-auto left-[100px]">

<!-- Top drawer: centered horizontally -->
<sng-drawer-content class="w-[300px] right-auto left-1/2 -translate-x-1/2">

<!-- Top drawer: 50px from right edge -->
<sng-drawer-content class="w-[300px] left-auto right-[50px]">

<!-- Left drawer: 200px from top edge -->
<sng-drawer-content class="h-[250px] bottom-auto top-[200px]">

<!-- Left drawer: centered vertically -->
<sng-drawer-content class="h-[250px] bottom-auto top-1/2 -translate-y-1/2">

<!-- Left drawer: 30px from bottom edge -->
<sng-drawer-content class="h-[250px] top-auto bottom-[30px]">
```

**Pattern:** First unset the default edge with `right-auto` or `bottom-auto`, then set your custom position.

## Background Scaling

```html
<!-- Enable background scale effect (default) -->
<sng-drawer-wrapper>
  <sng-drawer [shouldScaleBackground]="true">
    <!-- content -->
  </sng-drawer>
</sng-drawer-wrapper>

<!-- Disable background scaling -->
<sng-drawer [shouldScaleBackground]="false">
  <!-- content -->
</sng-drawer>
```

## Programmatic Control

```typescript
// Component class
@ViewChild('drawer') drawer!: SngDrawer;
@ViewChild('content') content!: TemplateRef<unknown>;

openDrawer() {
  this.drawer.open(this.content);
}

closeDrawer() {
  this.drawer.close();
}
```

## Focus Behavior

- Focus is trapped inside the drawer while open
- Initial focus is captured automatically by CDK

---

# Technical Reference

## Component Architecture

```typescript
// 10 components in compound pattern:
// 1. SngDrawer - Root container, manages overlay and open/close state
// 2. SngDrawerContent - Panel container with focus trap and ARIA
// 3. SngDrawerHeader - Header section for title and description
// 4. SngDrawerFooter - Footer section for action buttons
// 5. SngDrawerTitle - Title text styling
// 6. SngDrawerDescription - Description text styling
// 7. SngDrawerHandle - Visual drag handle indicator
// 8. SngDrawerClose - Directive that closes drawer on click
// 9. SngDrawerWrapper - Enables background scale effect
// 10. SngDrawerTrigger - Marker directive for trigger elements
```

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, CDK primitives, edge cases.

## Component Interfaces

```typescript
// SngDrawer - Root Container
interface SngDrawerApi {
  // INPUTS (all via input())
  side: InputSignal<'top' | 'bottom' | 'left' | 'right'>;  // Default: 'bottom'
  shouldScaleBackground: InputSignal<boolean>;              // Default: true
  modal: InputSignal<boolean>;                              // Default: false

  // STATE
  isOpen: Signal<boolean>;

  // METHODS
  open(template: TemplateRef<unknown>): void;
  close(): void;
}

// SngDrawerContent - Panel Container
interface SngDrawerContentApi {
  class: InputSignal<string>;  // Default: ''
  // Uses CDK focus trap internally
  // role="dialog" aria-modal="true" applied automatically
}

// SngDrawerHeader - Header Section
interface SngDrawerHeaderApi {
  class: InputSignal<string>;  // Default: ''
}

// SngDrawerFooter - Footer Section
interface SngDrawerFooterApi {
  class: InputSignal<string>;  // Default: ''
}

// SngDrawerTitle - Title Text
interface SngDrawerTitleApi {
  class: InputSignal<string>;  // Default: ''
}

// SngDrawerDescription - Description Text
interface SngDrawerDescriptionApi {
  class: InputSignal<string>;  // Default: ''
}

// SngDrawerHandle - Visual Drag Handle
interface SngDrawerHandleApi {
  class: InputSignal<string>;  // Default: ''
}

// SngDrawerClose - Close Button Directive
interface SngDrawerCloseApi {
  // Injects SNG_DRAWER_CLOSE token
  // Calls close function on click
}

// SngDrawerWrapper - Background Scale Target
interface SngDrawerWrapperApi {
  elementRef: ElementRef<HTMLElement>;
}

// SngDrawerTrigger - Marker Directive
interface SngDrawerTriggerApi {
  // No inputs - marker only
}
```

## Angular CDK Integration

```typescript
// Uses CDK Overlay for positioning (no CDK backdrop - handled in template)
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

// SngDrawer creates overlay with:
const config = new OverlayConfig({
  hasBackdrop: false,  // Backdrop handled by sng-drawer-content template
  panelClass: 'sng-drawer-panel',
  positionStrategy: this.overlay.position().global(),
  scrollStrategy: this.overlay.scrollStrategies.block(),
});

// SngDrawerContent uses CDK focus trap via hostDirectives
import { CdkTrapFocus } from '@angular/cdk/a11y';
// Applied via hostDirectives: [CdkTrapFocus]
```

## Import Requirements

```typescript
// ALL COMPONENTS - import what you need
import {
  SngDrawer,
  SngDrawerContent,
  SngDrawerHeader,
  SngDrawerFooter,
  SngDrawerTitle,
  SngDrawerDescription,
  SngDrawerHandle,
  SngDrawerClose,
  SngDrawerWrapper,
  SngDrawerTrigger,
} from 'sng-ui';

// Types (optional, for strict typing)
import type { SngDrawerSide } from 'sng-ui';

@Component({
  standalone: true,
  imports: [
    SngDrawer,
    SngDrawerContent,
    SngDrawerHeader,
    SngDrawerFooter,
    SngDrawerTitle,
    SngDrawerDescription,
    SngDrawerHandle,
    SngDrawerClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {}
```

## Side-Specific Behavior

```typescript
// Side controls:
// 1. Entry/exit animation direction (via inline @keyframes + data-side attribute)
// 2. Initial positioning (inset-x-0 bottom-0 vs inset-y-0 left-0)
// 3. Border and rounding (rounded-t-lg for bottom, rounded-b-lg for top)

// Layout-only classes per side (sideClasses record):
// TOP:    'inset-x-0 top-0 max-h-[80vh] rounded-b-lg border-b'
// BOTTOM: 'inset-x-0 bottom-0 max-h-[80vh] rounded-t-lg border-t'
// LEFT:   'inset-y-0 left-0 h-full w-3/4 border-r'
// RIGHT:  'inset-y-0 right-0 h-full w-3/4 border-l'

// Animations are CSS @keyframes in the component styles block,
// triggered by data-state + data-side attributes:
// .sng-drawer-panel[data-state=open][data-side=bottom] -> sng-drawer-in-bottom
// .sng-drawer-panel[data-state=closed][data-side=bottom] -> sng-drawer-out-bottom
```

## Injection Tokens

```typescript
// Close function token - inject in child components
import { SNG_DRAWER_CLOSE } from 'sng-ui';

@Component({...})
export class ChildComponent {
  private closeFn = inject(SNG_DRAWER_CLOSE, { optional: true });

  handleAction() {
    // Do something, then close
    this.closeFn?.();
  }
}

// Drawer instance token - access parent drawer
import { SNG_DRAWER_INSTANCE } from 'sng-ui';

@Component({...})
export class ChildComponent {
  private drawer = inject(SNG_DRAWER_INSTANCE, { optional: true });

  get side() {
    return this.drawer?.side() ?? 'bottom';
  }
}
```

## Background Scale Effect

```typescript
// Wrapper element receives scale transform when drawer opens
// Requires sng-drawer-wrapper directive on parent element

// When drawer opens (shouldScaleBackground=true):
wrapper.style.transform = 'scale(0.95) translateY(10px)';
wrapper.style.borderRadius = '10px';
document.body.style.backgroundColor = 'black';

// When drawer closes - all styles removed immediately:
// wrapper styles reset (transform, borderRadius, transition)
// body background-color removed
```

## Animation System

```typescript
// Self-contained CSS @keyframes in component styles block (no shared animation files)
// Overlay fade + per-side content slide, all 300ms ease

styles: [`
  // Overlay fade
  .sng-drawer-overlay[data-state=open] { animation: sng-drawer-fade-in 300ms ease both; }
  .sng-drawer-overlay[data-state=closed] { animation: sng-drawer-fade-out 300ms ease both; }
  // Content slide per side (triggered by data-state + data-side attributes)
  .sng-drawer-panel[data-state=open][data-side=bottom] { animation: sng-drawer-in-bottom 300ms ease both; }
  .sng-drawer-panel[data-state=closed][data-side=bottom] { animation: sng-drawer-out-bottom 300ms ease both; }
  // ... repeat for top, left, right
  @keyframes sng-drawer-fade-in { from { opacity: 0; } }
  @keyframes sng-drawer-in-bottom { from { transform: translateY(100%); } }
  @keyframes sng-drawer-out-bottom { to { transform: translateY(100%); } }
`],

// Close waits for CSS exit animations before disposing overlay
// via getAnimations({ subtree: true }) + Promise.all(a.finished)
```

## ARIA Compliance (Automatic)

```html
<!-- Generated ARIA structure -->
<sng-drawer-content
  role="dialog"
  aria-modal="true"
  cdkTrapFocus
  cdkTrapFocusAutoCapture>
  <!-- Content automatically focus-trapped -->
</sng-drawer-content>

<!-- Backdrop handles click-outside dismissal -->
<!-- No custom key-map handlers -->
```

## Edge Cases & Constraints

```typescript
// 1. OVERLAY ALREADY OPEN
// open() returns early if overlayRef exists
if (this.overlayRef) return;

// 2. TEMPLATE REQUIRED
// Must pass TemplateRef to open()
drawer.open(this.contentTemplate);  // Works
drawer.open(null);                  // Error

// 3. SIDE SET AT OPEN TIME
// Side is captured when open() is called
// Changing side while open has no effect
this.currentSide = this.side();

// 4. ANIMATED CLOSE
// close() waits for CSS exit animations (slide-out, fade-out)
// before disposing overlay via getAnimations() + Promise.all(a.finished)
// Background scaling is reset on close

// 5. FOCUS TRAP
// CDK A11yModule traps focus inside drawer
// Focus stays constrained within drawer content

// 6. SCROLL BLOCKING
// Overlay uses block scroll strategy
scrollStrategy: this.overlay.scrollStrategies.block()

// 7. WRAPPER DETECTION
// Uses ContentChild or querySelector fallback
const wrapper = this.wrapperDirective?.elementRef.nativeElement ||
  this.document.querySelector('sng-drawer-wrapper');
```

## Drawer vs Sheet vs Dialog

```typescript
// DRAWER - Mobile-first bottom sheet
// - Default: slides from bottom
// - Has drag handle visual
// - Background scale effect
// - Touch-optimized

// SHEET - General-purpose side panel
// - For desktop sidebars
// - No drag handle
// - No background scale
// - Click outside to close

// DIALOG - Centered modal
// - Appears in center of screen
// - For confirmations, alerts
// - No sliding animation
// - Blocks interaction
```

## Custom Dimensions & Positioning

```typescript
// Use 'class' input on sng-drawer-content to customize size and position

// CUSTOM DIMENSIONS
// Right/Left drawer - custom height:
class="h-[300px]"           // Fixed 300px height instead of full

// Top/Bottom drawer - custom width:
class="w-[400px] right-auto" // Fixed 400px width, positioned left

// POSITIONING PATTERN
// 1. Set custom dimension (w-[Xpx] or h-[Xpx])
// 2. Unset default edge (right-auto, bottom-auto, left-auto, top-auto)
// 3. Set custom position (left-[Xpx], top-[Xpx], etc.)

// EXAMPLES - Top drawer positions:
class="w-[300px] right-auto left-[100px]"              // 100px from left
class="w-[300px] right-auto left-1/2 -translate-x-1/2" // Centered
class="w-[300px] left-auto right-[50px]"               // 50px from right

// EXAMPLES - Left drawer positions:
class="h-[250px] bottom-auto top-[200px]"              // 200px from top
class="h-[250px] bottom-auto top-1/2 -translate-y-1/2" // Centered
class="h-[250px] top-auto bottom-[30px]"               // 30px from bottom

// WHY right-auto/bottom-auto?
// Default drawers use inset-x-0 (left:0 + right:0) for full width
// right-auto unsets right:0, allowing custom width + left positioning
// Same logic for vertical: bottom-auto unsets bottom:0
```

## Do's and Don'ts

### Do
- Use `sng-drawer-handle` for bottom drawers - users expect the visual cue
- Add `max-h-[80vh]` to content for scrollable drawers
- Use `sng-drawer-wrapper` when you want background scale effect
- Wrap long content in `overflow-y-auto` container
- Use `SNG_DRAWER_CLOSE` token in child components to close programmatically
- Put primary action first in footer, make it visually prominent
- Use left side for mobile navigation menus
- Use right side for shopping carts and detail panels
- Use `class` input for custom dimensions: `h-[300px]` or `w-[400px]`
- For custom positions: unset default edge first (`right-auto`), then set position (`left-[100px]`)

### Don't
- Nest drawers inside drawers - confusing UX
- Use drawer for complex multi-step flows - use full pages instead
- Forget to import all needed sub-components
- Mix drawer sides on the same page without clear purpose
- Put critical actions only inside the drawer - provide alternatives
- Use drawer for desktop-only interfaces - use Dialog instead
- Skip the handle on bottom drawers - users expect it
- Set both `left-[X]` and `right-[X]` without unsetting one - they conflict

## Common Mistakes

1. **Missing template reference** - `drawer.open()` requires a TemplateRef. Use `<ng-template #content>` and pass `content` to open().

2. **Forgetting sng-drawer-wrapper** - Background scale effect only works with the wrapper directive on a parent element.

3. **Content overflow issues** - Add `max-h-[80vh]` to `sng-drawer-content` and `overflow-y-auto` to scrollable areas.

4. **Wrong component imports** - Need to import each sub-component you use: SngDrawer, SngDrawerContent, SngDrawerHeader, etc.

5. **Trying to change side while open** - Side is captured when `open()` is called. Close and reopen for new side.

6. **Child component can't close drawer** - Inject `SNG_DRAWER_CLOSE` token or wrap the action with `<sng-drawer-close>...</sng-drawer-close>`.

7. **No handle on bottom drawer** - Always add `<sng-drawer-handle></sng-drawer-handle>` for bottom side.

8. **Footer not sticking to bottom** - Footer uses `mt-auto` - ensure parent has `flex flex-col` (already applied by SngDrawerContent).

9. **Custom position not working** - For top/bottom drawers, must unset `right-auto` before `left-[X]`. For left/right drawers, must unset `bottom-auto` before `top-[X]`. Default `inset-x-0` sets both left and right to 0.

## Accessibility Summary

### Automatic ARIA (no configuration needed)
- `role="dialog"` on content
- `aria-modal="true"` prevents interaction outside
- Focus trapped inside drawer via CDK
- Auto-capture focuses first interactive element

### Focus Navigation
- Focus remains constrained to drawer content while open

### Dismissal Methods
- Click backdrop
- sng-drawer-close wrapper element
- Programmatic close()
