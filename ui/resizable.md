# ShadNG Resizable

Accessible resizable panel groups built for Angular. Create flexible layouts with draggable dividers, touch support, and size constraints.

## Installation

```bash
npx @shadng/sng-ui add resizable
```

## Basic Usage

```html
<sng-resizable-group direction="horizontal" class="min-h-[200px] rounded-lg border">
  <sng-resizable-panel [defaultSize]="50">
    <div class="flex h-full items-center justify-center p-6">One</div>
  </sng-resizable-panel>
  <sng-resizable-handle [withHandle]="true" />
  <sng-resizable-panel [defaultSize]="50">
    <div class="flex h-full items-center justify-center p-6">Two</div>
  </sng-resizable-panel>
</sng-resizable-group>
```

## Vertical Layout

```html
<sng-resizable-group direction="vertical" class="min-h-[300px] rounded-lg border">
  <sng-resizable-panel [defaultSize]="25">
    <div class="flex h-full items-center justify-center p-6">Header</div>
  </sng-resizable-panel>
  <sng-resizable-handle [withHandle]="true" />
  <sng-resizable-panel [defaultSize]="75">
    <div class="flex h-full items-center justify-center p-6">Content</div>
  </sng-resizable-panel>
</sng-resizable-group>
```

## Dynamic Panels with @if

```html
<sng-resizable-group direction="horizontal" class="h-[400px] rounded-lg border">
  <sng-resizable-panel [defaultSize]="detailOpen() ? 22 : 28" [minSize]="15">
    Sidebar
  </sng-resizable-panel>
  <sng-resizable-handle [withHandle]="true" />
  <sng-resizable-panel [defaultSize]="detailOpen() ? 48 : 72">
    Main content
    <button (click)="toggleDetail()">Toggle Detail</button>
  </sng-resizable-panel>
  @if (detailOpen()) {
    <sng-resizable-handle [withHandle]="true" />
    <sng-resizable-panel [defaultSize]="30" [minSize]="20">
      Detail panel
    </sng-resizable-panel>
  }
</sng-resizable-group>
```

## Three-Panel Layout

```html
<sng-resizable-group direction="horizontal" class="min-h-[200px] rounded-lg border">
  <sng-resizable-panel [defaultSize]="20" [minSize]="10" [maxSize]="30">
    <div class="p-6">Nav</div>
  </sng-resizable-panel>
  <sng-resizable-handle [withHandle]="true" />
  <sng-resizable-panel [defaultSize]="50">
    <div class="p-6">Main Content</div>
  </sng-resizable-panel>
  <sng-resizable-handle [withHandle]="true" />
  <sng-resizable-panel [defaultSize]="30" [minSize]="15">
    <div class="p-6">Detail Panel</div>
  </sng-resizable-panel>
</sng-resizable-group>
```

## Handle Without Grip

```html
<sng-resizable-group direction="horizontal" class="min-h-[200px] rounded-lg border">
  <sng-resizable-panel [defaultSize]="50">
    <div class="p-6">Left Panel</div>
  </sng-resizable-panel>
  <sng-resizable-handle />
  <sng-resizable-panel [defaultSize]="50">
    <div class="p-6">Right Panel</div>
  </sng-resizable-panel>
</sng-resizable-group>
```

## With Constraints

```html
<sng-resizable-group direction="horizontal" class="min-h-[200px] rounded-lg border">
  <sng-resizable-panel [defaultSize]="30" [minSize]="20" [maxSize]="50">
    <div class="p-6">Sidebar (20-50%)</div>
  </sng-resizable-panel>
  <sng-resizable-handle [withHandle]="true" />
  <sng-resizable-panel [defaultSize]="70">
    <div class="p-6">Main Content</div>
  </sng-resizable-panel>
</sng-resizable-group>
```


---

# SngResizable Technical Reference

## Component Architecture

```typescript
// 3 components in compound pattern:
// 1. SngResizableGroup - Container managing panel sizes, layout direction, dynamic panel support
// 2. SngResizablePanel - Individual resizable panel with size constraints
// 3. SngResizableHandle - Draggable divider with touch and ARIA support
```

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, patterns, edge cases.

## Component Interfaces

```typescript
// SngResizableGroup - Container component
interface SngResizableGroupApi {
  // INPUTS (all via input())
  direction: InputSignal<'horizontal' | 'vertical'>;  // Default: 'horizontal'
  class: InputSignal<string>;                         // Default: ''

  // QUERIES (@internal)
  _panels: Signal<readonly SngResizablePanel[]>;  // contentChildren query

  // STATE (@internal)
  _panelSizes: WritableSignal<number[]>;  // Percentage values

  // METHODS (@internal)
  _resizePanel(panelIndex: number, delta: number): void;  // Called by handles
  _getContainerSize(): number;  // Returns container px along layout axis
}

// SngResizablePanel - Individual panel
interface SngResizablePanelApi {
  // INPUTS
  defaultSize: InputSignal<number | undefined>;  // Percentage (0-100)
  minSize: InputSignal<number | undefined>;      // Minimum percentage
  maxSize: InputSignal<number | undefined>;      // Maximum percentage
  class: InputSignal<string>;                    // Default: ''

  // STATE
  size: WritableSignal<number>;  // Current size percentage

  // METHODS (@internal)
  _setSize(size: number): void;  // Called by group
}

// SngResizableHandle - Draggable divider
interface SngResizableHandleApi {
  // INPUTS
  withHandle: InputSignal<boolean>;  // Default: false (show grip icon)
  class: InputSignal<string>;        // Default: ''

  // STATE
  isDragging: WritableSignal<boolean>;

  // COMPUTED
  direction: Signal<'horizontal' | 'vertical'>;  // From parent group

  // ARIA COMPUTED (@internal)
  _ariaValueNow: Signal<number>;   // Math.round(current panel size %)
  _ariaValueMin: Signal<number>;   // Panel minSize ?? 0
  _ariaValueMax: Signal<number>;   // Panel maxSize ?? 100
}
```

### TypeScript Types

```typescript
/** Layout direction for panel group */
export type ResizableDirection = 'horizontal' | 'vertical';
```

## Import Requirements

```typescript
// ALL 3 COMPONENTS REQUIRED
import {
  SngResizableGroup,
  SngResizablePanel,
  SngResizableHandle,
  type ResizableDirection,  // Optional type export
} from 'sng-ui';

@Component({
  standalone: true,
  imports: [
    SngResizableGroup,
    SngResizablePanel,
    SngResizableHandle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent { }
```

## Component Structure Pattern

```typescript
// SngResizableGroup - Uses flexbox layout
@Component({
  selector: 'sng-resizable-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-panel-group]': '"true"',
    '[attr.data-direction]': 'direction()',
  },
  template: `<ng-content />`,
})
export class SngResizableGroup {
  direction = input<ResizableDirection>('horizontal');
  class = input<string>('');

  _panels = contentChildren(SngResizablePanel);
  _panelSizes = signal<number[]>([]);

  hostClasses = computed(() =>
    cn(
      'flex h-full w-full',
      this.direction() === 'horizontal' ? 'flex-row' : 'flex-col',
      this.class()
    )
  );

  // Dynamic panel support: re-initializes sizes when panels are added/removed via @if
  constructor() {
    effect(() => {
      const count = this._panels().length;
      if (this._lastPanelCount > 0 && count !== this._lastPanelCount) {
        this._lastPanelCount = count;
        untracked(() => this.initializePanelSizes());
      }
    });
  }
}

// SngResizablePanel - Uses flex-basis for sizing
@Component({
  selector: 'sng-resizable-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.flex-basis.%]': 'size()',
    '[style.flex-grow]': '"0"',
    '[style.flex-shrink]': '"0"',
    '[attr.data-panel]': '"true"',
  },
  template: `<ng-content />`,
})
export class SngResizablePanel {
  defaultSize = input<number>();
  minSize = input<number>();
  maxSize = input<number>();
  class = input<string>('');

  size = signal<number>(50);

  hostClasses = computed(() => cn('overflow-hidden', this.class()));

  _setSize(size: number) {
    this.size.set(size);
  }
}

// SngResizableHandle - Draggable separator with ARIA
@Component({
  selector: 'sng-resizable-handle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-panel-resize-handle]': '"true"',
    '[attr.data-direction]': 'direction()',
    '[attr.data-dragging]': 'isDragging()',
    '[attr.tabindex]': '"0"',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'direction() === "horizontal" ? "vertical" : "horizontal"',
    '[attr.aria-valuenow]': '_ariaValueNow()',
    '[attr.aria-valuemin]': '_ariaValueMin()',
    '[attr.aria-valuemax]': '_ariaValueMax()',
    '(mousedown)': 'onMouseDown($event)',
    '(touchstart)': 'onTouchStart($event)',
  },
})
export class SngResizableHandle {
  withHandle = input(false, { transform: booleanAttribute });
  class = input<string>('');
  isDragging = signal(false);

  _ariaValueNow = computed(() => Math.round(this.group?._panelSizes()[this._panelIndex()] ?? 0));
  _ariaValueMin = computed(() => this.group?._panels()[this._panelIndex()]?.minSize() ?? 0);
  _ariaValueMax = computed(() => this.group?._panels()[this._panelIndex()]?.maxSize() ?? 100);
}
```

## Dynamic Panel Support

```typescript
// Panels can be conditionally rendered via @if.
// The group watches _panels().length via effect() and re-initializes sizes automatically.

// Pattern: toggle a detail panel
detailOpen = signal(false);

// Template:
@if (detailOpen()) {
  <sng-resizable-handle [withHandle]="true" />
  <sng-resizable-panel [defaultSize]="30" [minSize]="20">
    Detail content
  </sng-resizable-panel>
}

// Use reactive defaultSize to adjust existing panels when the detail opens/closes:
<sng-resizable-panel [defaultSize]="detailOpen() ? 48 : 72">
```

## Size Distribution Algorithm

```typescript
// Panel size initialization in SngResizableGroup
private initializePanelSizes() {
  const panelArray = this._panels();
  if (panelArray.length === 0) return;

  const sizes: number[] = [];
  let totalDefault = 0;
  let panelsWithoutDefault = 0;

  // First pass: collect default sizes
  panelArray.forEach((panel) => {
    const defaultSize = panel.defaultSize();
    if (defaultSize !== undefined) {
      sizes.push(defaultSize);
      totalDefault += defaultSize;
    } else {
      sizes.push(-1);  // Mark for later
      panelsWithoutDefault++;
    }
  });

  // Second pass: distribute remaining space
  if (panelsWithoutDefault > 0) {
    const remainingSpace = 100 - totalDefault;
    const sizePerPanel = remainingSpace / panelsWithoutDefault;
    for (let i = 0; i < sizes.length; i++) {
      if (sizes[i] === -1) {
        sizes[i] = sizePerPanel;
      }
    }
  }

  this._panelSizes.set(sizes);
  panelArray.forEach((panel, index) => {
    panel._setSize(sizes[index]);
  });
}
```

## Resize Constraint Logic

```typescript
// In SngResizableGroup._resizePanel()
_resizePanel(panelIndex: number, delta: number) {
  const sizes = [...this._panelSizes()];
  const panelArray = this._panels();

  // Convert pixel delta to percentage
  const containerSize = this._getContainerSize();
  const deltaPercent = (delta / containerSize) * 100;

  // Get constraints from both panels
  const currentPanel = panelArray[panelIndex];
  const nextPanel = panelArray[panelIndex + 1];

  const currentMin = currentPanel.minSize() ?? 0;
  const currentMax = currentPanel.maxSize() ?? 100;
  const nextMin = nextPanel.minSize() ?? 0;
  const nextMax = nextPanel.maxSize() ?? 100;

  // Calculate and apply constraints
  let newCurrentSize = sizes[panelIndex] + deltaPercent;
  let newNextSize = sizes[panelIndex + 1] - deltaPercent;

  // Clamp to min/max boundaries
  if (newCurrentSize < currentMin) {
    newCurrentSize = currentMin;
    newNextSize = sizes[panelIndex] + sizes[panelIndex + 1] - currentMin;
  }
  // ... similar for max constraints
}
```

## ARIA Compliance

```html
<!-- Generated ARIA structure -->
<sng-resizable-group data-direction="horizontal" data-panel-group="true">
  <sng-resizable-panel data-panel="true" style="flex-basis: 50%;">
    Panel content
  </sng-resizable-panel>
  <sng-resizable-handle
    role="separator"
    aria-orientation="vertical"
    aria-valuenow="50"
    aria-valuemin="0"
    aria-valuemax="100"
    tabindex="0"
    data-panel-resize-handle="true"
    data-direction="horizontal"
    data-dragging="false">
    <!-- Optional grip icon -->
  </sng-resizable-handle>
  <sng-resizable-panel data-panel="true" style="flex-basis: 50%;">
    Panel content
  </sng-resizable-panel>
</sng-resizable-group>
```

## Edge Cases & Constraints

```typescript
// 1. TOTAL SIZE MUST EQUAL 100
// If defaultSizes don't sum to 100, remaining space is distributed
[defaultSize]="30"  // Panel 1
// Panel 2 auto-calculated: 70%

// 2. MIN/MAX CONSTRAINTS INTERACT
// Adjacent panel constraints affect each other
Panel A: minSize=20, maxSize=80
Panel B: minSize=30, maxSize=70
// Effective range for A: 20-70 (capped by B's minimum)

// 3. HANDLE POSITION DETERMINED BY PANEL ORDER
// Handle at index N resizes panels N and N+1
<panel>...</panel>   // index 0
<handle />           // resizes panels 0 and 1
<panel>...</panel>   // index 1
<handle />           // resizes panels 1 and 2
<panel>...</panel>   // index 2

// 4. DYNAMIC PANELS VIA @if
// Group watches _panels().length via effect()
// Re-initializes sizes when panels are added/removed
// Use reactive [defaultSize] on existing panels to adjust

// 5. SSR SAFETY
// Drag operations check isPlatformBrowser before DOM access
if (!isPlatformBrowser(this.platformId)) return;

// 6. TOUCH SUPPORT
// Same logic as mouse, uses TouchEvent coordinates
onTouchStart(event: TouchEvent) {
  if (event.touches.length !== 1) return;
  const touch = event.touches[0];
  this.startDrag(touch.clientX, touch.clientY);
}

// 7. CONTENT OVERFLOW
// Panels have overflow:hidden by default
// Use ScrollArea inside for scrollable content
```

## Common Patterns

```typescript
// SIDEBAR + TOGGLEABLE DETAIL PANEL
<sng-resizable-group direction="horizontal">
  <sng-resizable-panel [defaultSize]="detailOpen() ? 22 : 28" [minSize]="15">
    Sidebar
  </sng-resizable-panel>
  <sng-resizable-handle [withHandle]="true" />
  <sng-resizable-panel [defaultSize]="detailOpen() ? 48 : 72">
    Main content
    <button (click)="toggleDetail()">Toggle Detail</button>
  </sng-resizable-panel>
  @if (detailOpen()) {
    <sng-resizable-handle [withHandle]="true" />
    <sng-resizable-panel [defaultSize]="30" [minSize]="20">
      Detail panel
    </sng-resizable-panel>
  }
</sng-resizable-group>

// IDE LAYOUT (nested groups)
<sng-resizable-group direction="horizontal">
  <sng-resizable-panel [defaultSize]="20">File tree</sng-resizable-panel>
  <sng-resizable-handle />
  <sng-resizable-panel [defaultSize]="80">
    <sng-resizable-group direction="vertical">
      <sng-resizable-panel [defaultSize]="70">Editor</sng-resizable-panel>
      <sng-resizable-handle />
      <sng-resizable-panel [defaultSize]="30">Terminal</sng-resizable-panel>
    </sng-resizable-group>
  </sng-resizable-panel>
</sng-resizable-group>

// EMAIL CLIENT LAYOUT
<sng-resizable-group direction="horizontal">
  <sng-resizable-panel [defaultSize]="20" [minSize]="15">Folders</sng-resizable-panel>
  <sng-resizable-handle />
  <sng-resizable-panel [defaultSize]="30" [minSize]="20">Message list</sng-resizable-panel>
  <sng-resizable-handle />
  <sng-resizable-panel [defaultSize]="50">Reading pane</sng-resizable-panel>
</sng-resizable-group>
```

## Do's and Don'ts

### Do
- Set sensible `minSize` constraints to prevent unusable panel sizes
- Use `[withHandle]="true"` when resize is a primary feature users should discover
- Persist panel sizes to localStorage for user preference retention
- Use nested groups for complex layouts (horizontal inside vertical, etc.)
- Use `@if` to conditionally show/hide panels - the group re-distributes sizes automatically
- Test drag behavior and focus visibility

### Don't
- Let panels collapse to 0% unless you handle that state gracefully
- Use resizable panels on very small mobile screens - consider alternatives
- Forget to set container height - panels need a sized parent
- Use more than 4-5 panels in a single group - gets confusing
- Rely solely on mouse interaction - support touch devices too

## Common Mistakes

1. **Missing container height** - `sng-resizable-group` needs a parent with defined height. Without it, vertical layouts collapse.

2. **DefaultSizes exceeding 100%** - If panel defaults sum to more than 100, layout breaks. Ensure they add up correctly.

3. **Forgetting all 3 imports** - Need `SngResizableGroup`, `SngResizablePanel`, AND `SngResizableHandle`.

4. **Using npm install** - Use `npx @shadng/sng-ui add resizable` (copy-paste model, not npm dependency).

5. **No minSize on collapsible panels** - Without minSize, panels can become too small to be useful.

6. **Content overflow issues** - Panels have overflow:hidden. Use ScrollArea for scrollable content inside panels.

7. **Nested groups without proper sizing** - Inner groups need explicit height/width from parent panel.

## Accessibility Summary

### Automatic ARIA
- `role="separator"` on handle
- `aria-orientation` opposite to direction (horizontal group = vertical separator)
- `aria-valuenow` - current panel size percentage (reactive, updates during drag)
- `aria-valuemin` - panel's minSize or 0
- `aria-valuemax` - panel's maxSize or 100
- `tabindex="0"` for focus focusability
- `data-dragging` for visual feedback styling


### Focus Management
- Handle receives focus in standard browser navigation
- Visual focus indicator via focus-visible styles
- Dragging state communicated via data attribute
