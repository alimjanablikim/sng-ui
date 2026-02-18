
# ShadNG Popover

Floating content panels built on Angular CDK Overlay. Click-triggered with backdrop dismiss, four-direction positioning, and smooth animations.

## Installation

```bash
npx @shadng/sng-ui add popover
```

## Basic Usage

```html
<sng-popover>
  <sng-popover-trigger>
    <sng-button>Open popover</sng-button>
  </sng-popover-trigger>
  <sng-popover-content>
    <p>Popover content here.</p>
  </sng-popover-content>
</sng-popover>
```

## With Form Content

```html
<sng-popover>
  <sng-popover-trigger>
    <sng-button>Edit dimensions</sng-button>
  </sng-popover-trigger>
  <sng-popover-content>
    <div class="grid gap-4">
      <div class="space-y-2">
        <h4 class="font-medium">Dimensions</h4>
        <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
      </div>
      <div class="grid grid-cols-3 items-center gap-4">
        <label for="popover-width" class="text-sm font-medium">Width</label>
        <sng-input [id]="'popover-width'" [name]="'width'" value="100%" class="col-span-2 h-8" />
      </div>
      <div class="grid grid-cols-3 items-center gap-4">
        <label for="popover-max-width" class="text-sm font-medium">Max. width</label>
        <sng-input [id]="'popover-max-width'" [name]="'max-width'" value="300px" class="col-span-2 h-8" />
      </div>
      <div class="grid grid-cols-3 items-center gap-4">
        <label for="popover-height" class="text-sm font-medium">Height</label>
        <sng-input [id]="'popover-height'" [name]="'height'" value="25px" class="col-span-2 h-8" />
      </div>
      <div class="grid grid-cols-3 items-center gap-4">
        <label for="popover-max-height" class="text-sm font-medium">Max. height</label>
        <sng-input [id]="'popover-max-height'" [name]="'max-height'" value="none" class="col-span-2 h-8" />
      </div>
    </div>
  </sng-popover-content>
</sng-popover>
```

## Position Variants

```html
<sng-popover side="top">
  <sng-popover-trigger><sng-button>Top</sng-button></sng-popover-trigger>
  <sng-popover-content>Opens above trigger</sng-popover-content>
</sng-popover>

<sng-popover side="bottom">
  <sng-popover-trigger><sng-button>Bottom</sng-button></sng-popover-trigger>
  <sng-popover-content>Opens below trigger</sng-popover-content>
</sng-popover>

<sng-popover side="left">
  <sng-popover-trigger><sng-button>Left</sng-button></sng-popover-trigger>
  <sng-popover-content>Opens to the left</sng-popover-content>
</sng-popover>

<sng-popover side="right">
  <sng-popover-trigger><sng-button>Right</sng-button></sng-popover-trigger>
  <sng-popover-content>Opens to the right</sng-popover-content>
</sng-popover>
```

## Focus Behavior

| Interaction | Description |
|------------|-------------|
| Click | Opens/closes popover via trigger |

---

# Technical Reference

## Component Architecture

```typescript
// 3 components:
// 1) SngPopover         - root coordinator + CDK overlay lifecycle
// 2) SngPopoverTrigger  - trigger wrapper that delegates click to parent popover
// 3) SngPopoverContent  - content template rendered through TemplatePortal

// Internal helper in sng-popover.ts:
// class OverlayLifecycle {
//   isOpen: WritableSignal<boolean>;
//   attach(overlayRef: OverlayRef): void;
//   close(): void;    // sets data-state=closed and waits for animation.finished
//   dispose(): void;  // detaches/disposes overlay and subscriptions
// }
```

## Public API Snapshot

```typescript
type PopoverSide = 'top' | 'bottom' | 'left' | 'right';

interface SngPopoverApi {
  class: InputSignal<string>;
  side: InputSignal<PopoverSide>;
  trigger: Signal<SngPopoverTrigger | undefined>;
  content: Signal<SngPopoverContent | undefined>;
  isOpen: WritableSignal<boolean>;
  toggle(triggerElement: ElementRef): void;
  hide(): void;
}

interface SngPopoverTriggerApi {
  registerPopover(popover: SngPopover): void;
  onClick(event: Event): void;
}

interface SngPopoverContentApi {
  class: InputSignal<string>;
  templateRef: TemplateRef<unknown>;
  viewContainerRef: ViewContainerRef;
}
```

## CDK Overlay Contract

```typescript
const primary = this.side();
const fallbackMap = { bottom: 'top', top: 'bottom', left: 'right', right: 'left' } as const;

const positionStrategy = this.overlayPositionBuilder
  .flexibleConnectedTo(positionElement)
  .withPositions([
    getOverlayPosition(primary),
    getOverlayPosition(fallbackMap[primary]),
  ])
  .withPush(true)
  .withViewportMargin(8);

const overlayRef = this.overlay.create({
  positionStrategy,
  scrollStrategy: this.overlay.scrollStrategies.close(),
  hasBackdrop: true,
  backdropClass: 'cdk-overlay-transparent-backdrop',
});
```

## Animation and Disposal

```typescript
// close() path in OverlayLifecycle
panel.querySelectorAll('[data-state]').forEach(el =>
  el.setAttribute('data-state', 'closed')
);

const animations = panel.getAnimations({ subtree: true });
if (animations.length > 0) {
  Promise.allSettled(animations.map(animation => animation.finished))
    .finally(() => this.dispose());
} else {
  this.dispose();
}
```

Runtime does not use `setTimeout` / `setInterval` for sequencing.

## Template and Portal

```typescript
@Component({
  selector: 'sng-popover-content',
  template: `
    <ng-template #content>
      <div class="sng-popover-content" data-state="open" [class]="contentClasses()">
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class SngPopoverContent {
  get templateRef(): TemplateRef<unknown> { ... }
}

const portal = new TemplatePortal(contentComponent.templateRef, contentComponent.viewContainerRef);
overlayRef.attach(portal);
```

## Constraints and Edge Cases

1. `sng-popover-trigger` and `sng-popover-content` must be projected in the same `sng-popover`.
2. Trigger wrappers with `display: contents` are supported through recursive position-element resolution.
3. Overlay content renders in CDK overlay container, outside source DOM hierarchy.
4. Side is preferred placement with opposite-side fallback configured automatically.
5. Backdrop click and overlay detach both close and dispose safely.

## Accessibility Summary

- Trigger exposes `aria-haspopup="dialog"` and `aria-expanded`.
- Backdrop dismiss is enabled by default.
- No custom keyboard navigation map is implemented.
