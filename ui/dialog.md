
# ShadNG Dialog

Modal dialog component for focused user interactions. Built with Angular CDK Overlay for proper positioning, focus trapping, and scroll locking. Includes fade and zoom animations.

## Installation

```bash
npx @shadng/sng-ui add dialog
```

## Basic Usage

```html
<sng-dialog #dialog>
  <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="dialog.open(content)">Open Dialog</sng-button>
</sng-dialog>

<ng-template #content>
  <sng-dialog-content>
    <sng-dialog-close />
    <sng-dialog-header>
      <sng-dialog-title>Edit Profile</sng-dialog-title>
      <sng-dialog-description>Make changes to your profile here.</sng-dialog-description>
    </sng-dialog-header>
    <div class="py-4">
      <!-- Dialog body content -->
    </div>
    <sng-dialog-footer>
      <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="dialog.close()">Cancel</sng-button>
      <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90" (click)="dialog.close()">Save</sng-button>
    </sng-dialog-footer>
  </sng-dialog-content>
</ng-template>
```

## Custom Width

```html
<ng-template #wideContent>
  <sng-dialog-content class="max-w-2xl">
    <!-- Wider dialog content -->
  </sng-dialog-content>
</ng-template>
```

## Confirmation Dialog

```html
<ng-template #confirmContent>
  <sng-dialog-content class="max-w-md">
    <sng-dialog-close />
    <sng-dialog-header>
      <sng-dialog-title>Are you sure?</sng-dialog-title>
      <sng-dialog-description>This action cannot be undone.</sng-dialog-description>
    </sng-dialog-header>
    <sng-dialog-footer>
      <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="dialog.close()">Cancel</sng-button>
      <sng-button class="bg-destructive text-white hover:bg-destructive/90" (click)="onConfirm()">Delete</sng-button>
    </sng-dialog-footer>
  </sng-dialog-content>
</ng-template>
```

## Programmatic Dialog (Service)

```typescript
// my-dialog.component.ts
@Component({
  template: `
    <sng-dialog-header>
      <sng-dialog-title>{{ data.title }}</sng-dialog-title>
    </sng-dialog-header>
    <sng-dialog-footer>
      <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90" (click)="close('confirmed')">Confirm</sng-button>
    </sng-dialog-footer>
  `
})
export class MyDialogComponent {
  data = inject(SNG_DIALOG_DATA);
  private dialogRef = inject(SngDialogRef);

  close(result: string) {
    this.dialogRef.close(result);
  }
}

// Usage
dialogService.open(MyDialogComponent, {
  data: { title: 'Dynamic Title' },
  width: '400px'
}).afterClosed$.subscribe(result => {
  console.log('Closed with:', result);
});
```

## Focus Behavior

- Focus is trapped within dialog content while open
- Initial focus moves to the first interactive element

---

# SngDialog Technical Reference

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, CDK primitives, edge cases.

## Component Architecture

```typescript
// 9 exports in compound pattern:
// 1. SngDialog           - Root state manager + CDK Overlay lifecycle
// 2. SngDialogContent    - Modal panel with focus trapping (CdkTrapFocus)
// 3. SngDialogHeader     - Header container (flex layout)
// 4. SngDialogTitle      - Title text (directive on h2)
// 5. SngDialogDescription - Description text (directive on p)
// 6. SngDialogFooter     - Footer container (button actions)
// 7. SngDialogClose      - Close button with X icon
// 8. SngDialogService    - Programmatic API for dynamic dialogs
// 9. SngDialogRef        - Reference handle with afterClosed$ observable

// Injection tokens:
// - SNG_DIALOG_CLOSE     - Function to close from child components
// - SNG_DIALOG_INSTANCE  - Parent SngDialog reference
// - SNG_DIALOG_DATA      - Data passed via service API
```

## Component Interfaces

```typescript
// SngDialog - Root Container
interface SngDialogApi {
  // STATE
  isOpen: WritableSignal<boolean>;

  // METHODS
  open(template: TemplateRef<unknown>): void;
  close(): void;
}

// SngDialogContent - Modal Panel
interface SngDialogContentApi {
  // INPUTS
  class: InputSignal<string>;  // Default: ''

  // COMPUTED
  state: Signal<'open' | 'closed'>;
  overlayClasses: Signal<string>;
  contentClasses: Signal<string>;

  // METHODS
  onOverlayClick(event: MouseEvent): void;
}

// SngDialogHeader - Header Section
interface SngDialogHeaderApi {
  class: InputSignal<string>;
  hostClasses: Signal<string>;
}

// SngDialogTitle - Title Directive
interface SngDialogTitleApi {
  class: InputSignal<string>;
  hostClasses: Signal<string>;
}

// SngDialogDescription - Description Directive
interface SngDialogDescriptionApi {
  class: InputSignal<string>;
  hostClasses: Signal<string>;
}

// SngDialogFooter - Footer Section
interface SngDialogFooterApi {
  class: InputSignal<string>;
  hostClasses: Signal<string>;
}

// SngDialogClose - Close Button
interface SngDialogCloseApi {
  class: InputSignal<string>;
  hostClasses: Signal<string>;
  onClick(): void;
}

// SngDialogService - Programmatic API
interface SngDialogServiceApi {
  open<T, D, R>(component: Type<T>, config?: SngDialogConfig<D>): SngDialogRef<T, R>;
  closeAll(): void;
}

// SngDialogRef - Dialog Reference
interface SngDialogRefApi<T, R> {
  componentInstance: T;
  afterClosed$: Observable<R | undefined>;
  close(result?: R): void;
}
```

### TypeScript Types

```typescript
/** Dialog open/closed state */
type SngDialogState = 'open' | 'closed';

/** Configuration for programmatic dialogs */
interface SngDialogConfig<D = unknown> {
  data?: D;
  width?: string;
  maxWidth?: string;
  height?: string;
  maxHeight?: string;
  disableClose?: boolean;
  panelClass?: string | string[];
  hasBackdrop?: boolean;
  backdropClass?: string;
}

/** Injection tokens */
const SNG_DIALOG_CLOSE: InjectionToken<() => void>;
const SNG_DIALOG_INSTANCE: InjectionToken<SngDialog>;
const SNG_DIALOG_DATA: InjectionToken<unknown>;
```

## Angular CDK Integration

```typescript
// SngDialog uses CDK Overlay for positioning
@Component({
  selector: 'sng-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class SngDialog implements OnDestroy {
  private overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

  open(template: TemplateRef<unknown>) {
    const config = new OverlayConfig({
      hasBackdrop: false,  // Handled by sng-dialog-content
      panelClass: 'sng-dialog-panel',
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    this.overlayRef = this.overlay.create(config);
    // ... portal attachment
  }
}

// SngDialogContent uses CdkTrapFocus
@Component({
  selector: 'sng-dialog-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [CdkTrapFocus],
  host: {
    role: 'dialog',
    'aria-modal': 'true',
  },
})
export class SngDialogContent implements AfterViewInit {
  private focusTrap = inject(CdkTrapFocus);

  ngAfterViewInit() {
    this.focusTrap.focusTrap.focusInitialElementWhenReady();
  }
}

// CDK Provides:
// - Overlay positioning (centered)
// - Scroll blocking while open
// - Focus trapping within dialog content
// - Focus event handling
// - Portal for rendering outside component tree
```

## Import Requirements

```typescript
// ALL COMPONENTS FOR TEMPLATE-BASED USAGE
import {
  SngDialog,
  SngDialogContent,
  SngDialogHeader,
  SngDialogTitle,
  SngDialogDescription,
  SngDialogFooter,
  SngDialogClose,
} from 'sng-ui';

// FOR PROGRAMMATIC (SERVICE) USAGE
import {
  SngDialogService,
  SngDialogRef,
  SNG_DIALOG_DATA,
  SNG_DIALOG_CLOSE,
  type SngDialogConfig,
} from 'sng-ui';

@Component({
  standalone: true,
  imports: [
    SngDialog,
    SngDialogContent,
    SngDialogHeader,
    SngDialogTitle,
    SngDialogDescription,
    SngDialogFooter,
    SngDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  dialogService = inject(SngDialogService);
}
```

## Animation System

```typescript
// Animations defined inline in component styles block (self-contained, no shared CSS files)
styles: [`
  .sng-dialog-overlay[data-state=open] { animation: sng-dialog-fade-in 200ms ease both; }
  .sng-dialog-overlay[data-state=closed] { animation: sng-dialog-fade-out 200ms ease both; }
  .sng-dialog-panel[data-state=open] { animation: sng-dialog-enter 200ms ease both; }
  .sng-dialog-panel[data-state=closed] { animation: sng-dialog-exit 200ms ease both; }
  @keyframes sng-dialog-fade-in { from { opacity: 0; } }
  @keyframes sng-dialog-fade-out { to { opacity: 0; } }
  @keyframes sng-dialog-enter { from { opacity: 0; transform: scale(0.95); } }
  @keyframes sng-dialog-exit { to { opacity: 0; transform: scale(0.95); } }
`],

// Overlay uses sng-dialog-overlay class for animation targeting
overlayClasses = computed(() =>
  cn('fixed inset-0 z-50 bg-black/50 sng-dialog-overlay')
);

// Content uses sng-dialog-panel class for animation targeting
contentClasses = computed(() =>
  cn(
    'pointer-events-auto relative w-full max-w-[calc(100%-2rem)] sm:max-w-lg',
    'grid gap-4 border bg-background p-6 shadow-lg rounded-lg outline-none',
    'sng-dialog-panel',
    this.class()
  )
);

// Close waits for CSS exit animations before disposing overlay
close() {
  if (!this.overlayRef || this._closing) return;
  this._closing = true;
  this.isOpen.set(false);
  // data-state="closed" triggers exit keyframes via CSS
  // getAnimations() waits for them to finish before dispose()
}
```

## ARIA Compliance (Automatic)

```html
<!-- Generated ARIA structure -->
<sng-dialog-content role="dialog" aria-modal="true">
  <!-- Overlay backdrop -->
  <div class="fixed inset-0 z-50 bg-black/50" data-state="open"></div>

  <!-- Centered container -->
  <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
    <!-- Content panel -->
    <div role="document" data-state="open" class="...">
      <sng-dialog-header>
        <sng-dialog-title>Title</sng-dialog-title>
        <sng-dialog-description>Description</sng-dialog-description>
      </sng-dialog-header>
      <sng-dialog-footer>
        <button>Action</button>
      </sng-dialog-footer>
      <sng-dialog-close>
        <svg><!-- X icon --></svg>
        <span class="sr-only">Close</span>
      </sng-dialog-close>
    </div>
  </div>
</sng-dialog-content>
```

## Template vs Service API

```typescript
// TEMPLATE-BASED (simpler, for static content)
// - Define dialog content in template
// - Use ng-template with sng-dialog-content
// - Call dialog.open(template) and dialog.close()

<sng-dialog #dialog>
  <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="dialog.open(content)">Open</sng-button>
</sng-dialog>
<ng-template #content>
  <sng-dialog-content>...</sng-dialog-content>
</ng-template>

// SERVICE-BASED (for dynamic content, data passing)
// - Create separate dialog component
// - Inject SNG_DIALOG_DATA for input
// - Inject SngDialogRef for closing with result

dialogService.open(MyDialogComponent, {
  data: { userId: 123 },
  width: '500px',
  disableClose: true,
}).afterClosed$.subscribe(result => {
  // Handle result
});
```

## Injection Token Pattern

```typescript
// Dialog component receives data via injection token
@Component({
  template: `
    <sng-dialog-header>
      <sng-dialog-title>Edit {{ data.name }}</sng-dialog-title>
    </sng-dialog-header>
    <sng-dialog-footer>
      <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90" (click)="save()">Save</sng-button>
    </sng-dialog-footer>
  `
})
export class EditUserDialogComponent {
  // Inject data passed from open() config
  data = inject<{ name: string; id: number }>(SNG_DIALOG_DATA);

  // Inject close function for template-based
  private closeDialog = inject(SNG_DIALOG_CLOSE, { optional: true });

  // OR inject ref for service-based
  private dialogRef = inject(SngDialogRef, { optional: true });

  save() {
    // Service-based: close with result
    this.dialogRef?.close({ saved: true });
    // Template-based: just close
    this.closeDialog?.();
  }
}
```

## Edge Cases & Constraints

```typescript
// 1. OVERLAY ALREADY OPEN
// Calling open() when already open does nothing
open(template) {
  if (this.overlayRef) return;  // Guard
}

// 2. ANIMATED CLOSE
// close() waits for CSS exit animations (sng-dialog-exit, sng-dialog-fade-out)
// before disposing overlay via getAnimations() + Promise.all(a.finished)

// 3. FOCUS RESTORATION
// CDK FocusTrap restores focus to trigger element on close

// 4. SCROLL LOCK
// Body scroll is blocked via overlay.scrollStrategies.block()

// 5. DISMISSAL BEHAVIOR
// Click backdrop or call close() programmatically

// 6. BACKDROP CLICK
// Handled by sng-dialog-content's overlay div click handler
// Service-based can disable via config.disableClose

// 7. MULTIPLE DIALOGS
// Service tracks openDialogs array
// closeAll() closes all in reverse order
```

## Do's and Don'ts

### Do
- Use template-based API for simple, static dialogs
- Use service-based API when passing data or getting results
- Include `sng-dialog-close` for accessible dismiss button
- Use `max-w-md` for simple confirmations, `max-w-lg` for forms
- Focus first interactive element (CDK does this automatically)
- Use descriptive titles: "Delete Project?" not "Are you sure?"
- Add `aria-describedby` linking to description if present

### Don't
- Nest dialogs inside dialogs - use multi-step wizard pattern instead
- Block backdrop close for non-critical dialogs
- Put complex forms in dialogs - use dedicated pages instead
- Forget the close button for explicit dismissal
- Use dialogs for simple confirmations that could be inline
- Open dialogs on page load without user action

## Common Mistakes

1. **Forgetting ng-template wrapper** - Dialog content must be in `<ng-template>` for template-based usage. Without it, content renders immediately.

2. **Missing sng-dialog-close** - Users expect an X button. The component provides a default icon, or apply directive to your button.

3. **Not importing all sub-components** - Need: SngDialog, SngDialogContent, SngDialogHeader, SngDialogTitle, SngDialogDescription, SngDialogFooter, SngDialogClose.

4. **Using service API when template works** - Service API adds complexity. Use it only when you need data passing or results.

5. **Forgetting to unsubscribe from afterClosed$** - The observable completes after emit, but good practice to use takeUntilDestroyed() or async pipe.

6. **Always use close() method** - Calling dispose() directly bypasses event emission and focus restoration. Use close() for consistent behavior.

## Accessibility Summary

### Automatic ARIA (no configuration needed)
- `role="dialog"` on content container
- `aria-modal="true"` for modal behavior
- `role="document"` on inner content panel
- `sr-only` text for close button icon
- Focus trapped within dialog via CdkTrapFocus
- Focus restored to trigger element on close

### Focus Navigation
- Focus remains trapped within dialog content
- Initial focus lands on the first tabbable element

### Focus Management
- Auto-focus first tabbable element on open
- Return focus to trigger element on close
- Focus trapping prevents focus escaping dialog
