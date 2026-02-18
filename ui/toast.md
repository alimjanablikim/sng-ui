
# ShadNG Toast

Toast notifications for user feedback. Service-based API with convenience methods (success, error, warning), positions, and auto-dismiss. Screen reader support via Angular CDK LiveAnnouncer.

## Installation

```bash
npx @shadng/sng-ui add toast
```

## Basic Usage

```typescript
// 1. Add SngToaster once in your app root
// app.component.ts
import { SngToaster } from 'sng-ui';

@Component({
  imports: [SngToaster],
  template: `
    <router-outlet />
    <sng-toaster />
  `
})
export class AppComponent {}

// 2. Inject service anywhere to show toasts
import { SngToastService } from 'sng-ui';

export class MyComponent {
  private toastService = inject(SngToastService);

  save() {
    this.toastService.success('Saved!');
  }
}
```

## Variants

```typescript
// Default - neutral styling
this.toastService.show({ title: 'Event created' });

// Success - green border
this.toastService.success('Changes saved', 'Your profile has been updated.');

// Error - red border, assertive announcement
this.toastService.error('Error occurred', 'Failed to save. Please try again.');

// Warning - yellow border
this.toastService.warning('Warning', 'Session expires in 5 minutes.');
```

## With Description

```typescript
this.toastService.show({
  title: 'Scheduled: Catch up',
  description: 'Friday, February 10, 2024 at 5:57 PM',
});
```

## With Action Button

```typescript
this.toastService.show({
  title: 'Message sent',
  description: 'Your message has been delivered.',
  action: {
    label: 'Undo',
    onClick: () => this.undoSend(),
  },
});
```

## Positioning

```typescript
// Six positions available
this.toastService.show({
  title: 'Notification',
  position: 'top-left',      // or 'top-center', 'top-right'
});                          // or 'bottom-left', 'bottom-center', 'bottom-right' (default)
```

## Custom Duration

```typescript
// Quick confirmation (2 seconds)
this.toastService.show({ title: 'Copied!', duration: 2000 });

// Fixed (no auto-dismiss)
this.toastService.show({
  title: 'Action required',
  dismissType: 'fixed',  // User must click close
});
```

## Dismissing Toasts

```typescript
// Dismiss specific toast
const id = this.toastService.show({ title: 'Processing...' });
// Later...
this.toastService.dismiss(id);

// Dismiss all
this.toastService.dismissAll();
```

---

# SngToast Technical Reference

## Component Architecture

```typescript
// 3 exports (2 components + 1 service):
// 1. SngToaster - Container component, renders all active toasts grouped by position
// 2. SngToast - Individual toast notification with title, description, and action
// 3. SngToastService - Injectable service for showing, dismissing, and managing toasts
```

High-signal technical documentation for AI coding assistants. Service-based toast system with global state management.

## Core Architecture

```typescript
// THREE EXPORTS - All required for full functionality
import {
  SngToaster,       // Container component (add once to app root)
  SngToast,         // Individual toast component (used internally)
  SngToastService,  // Injectable service for showing toasts
} from 'sng-ui';

// Types for strict typing
import type {
  Toast,
  ToastOptions,
  ToastAction,
  ToastPosition,
  ToastDismissType,
} from 'sng-ui';
```

## Type Definitions

```typescript
/** Position options for toast placement */
type ToastPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

/** Dismiss behavior type */
type ToastDismissType = 'countdown' | 'fixed';

/** Action button configuration */
interface ToastAction {
  label: string;
  onClick: () => void;
}

/** Screen reader announcement priority */
type ToastPriority = 'polite' | 'assertive';

/** Full toast data structure */
interface Toast {
  id: string;
  title: string;
  description?: string;
  action?: ToastAction;
  class?: string;
  priority?: ToastPriority;
  duration?: number;
  position?: ToastPosition;
  dismissType?: ToastDismissType;
}

/** Options for show() method */
interface ToastOptions {
  title: string;
  description?: string;
  action?: ToastAction;
  class?: string;
  priority?: ToastPriority;
  duration?: number;
  position?: ToastPosition;
  dismissType?: ToastDismissType;
}
```

## SngToastService API

```typescript
@Injectable({ providedIn: 'root' })
export class SngToastService {
  // Readonly signal of all visible toasts
  readonly toasts: Signal<readonly Toast[]>;

  // Show toast with full options (returns toast ID)
  show(options: ToastOptions): string;

  // Convenience methods (return toast ID)
  success(title: string, description?: string): string;
  error(title: string, description?: string): string;
  warning(title: string, description?: string): string;

  // Dismissal
  dismiss(id: string): void;
  dismissAll(): void;
}

// Default values:
// - priority: 'polite'
// - duration: 3000ms
// - position: 'bottom-right'
// - dismissType: 'countdown'
```

## Component Structure

```typescript
// SngToaster - Container for all toasts
@Component({
  selector: 'sng-toaster',
  standalone: true,
  imports: [SngToast],
  template: `
    @for (position of positions; track position) {
      @if (getToastsForPosition(position).length > 0) {
        <div [class]="getContainerClasses(position)">
          @for (toast of getToastsForPosition(position); track toast.id) {
            <sng-toast [toast]="toast" (dismissed)="toastService.dismiss(toast.id)" />
          }
        </div>
      }
    }
  `
})
export class SngToaster {
  protected toastService = inject(SngToastService);
  // Groups toasts by position, renders in separate fixed containers
}

// SngToast - Individual toast notification
@Component({
  selector: 'sng-toast',
  standalone: true,
})
export class SngToast {
  toast = input.required<Toast>();
  dismissed = output<void>();
  // Renders title, description, action button, close button
}
```

## Global State Pattern

```typescript
// Uses window object for true global state across library/app boundary
declare global {
  interface Window {
    __sngToasts?: WritableSignal<Toast[]>;
  }
}

function getGlobalToasts(): WritableSignal<Toast[]> {
  if (!window.__sngToasts) {
    window.__sngToasts = signal<Toast[]>([]);
  }
  return window.__sngToasts;
}

// This ensures single source of truth even if service is instantiated
// multiple times (lazy modules, library consumers)
```

## Position Container Classes

```typescript
const POSITION_CLASSES: Record<ToastPosition, string> = {
  'top-left': 'top-0 left-0 items-start',
  'top-right': 'top-0 right-0 items-end',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
  'bottom-left': 'bottom-0 left-0 items-start',
  'bottom-right': 'bottom-0 right-0 items-end',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-center',
};

// Container base classes:
// 'fixed z-50 flex flex-col gap-2 p-4 max-h-screen w-full max-w-[420px] pointer-events-none'
```

## Styling

```typescript
// No variantClasses record - styling is driven by toast.class (user-provided)
// Convenience methods set class directly:
//   success() -> class: 'border-green-500 text-green-600'
//   error()   -> class: 'border-red-500 text-red-600'
//   warning() -> class: 'border-yellow-500 text-yellow-600'

containerClasses = computed(() => {
  const base = 'group pointer-events-auto relative flex items-start justify-between gap-4 overflow-hidden rounded-lg border p-4 shadow-lg text-sm bg-background border-border sng-toast-enter';
  const customClass = toast.class || 'w-[360px]';
  return cn(base, customClass);
});
```

## Animation System

```typescript
// Self-contained CSS @keyframes in component styles block (no shared animation files)
styles: [`
  .sng-toast-enter { animation: sng-toast-enter 300ms ease both; }
  @keyframes sng-toast-enter { from { opacity: 0; transform: translateX(1rem); } }
`],

// Dismiss is immediate - toast removed from array instantly
// No exit animation, no _entering/_exiting state flags, no setTimeout delays
```

## Accessibility Features

```typescript
// Uses Angular CDK LiveAnnouncer
private liveAnnouncer = inject(LiveAnnouncer);

// Announcement on show:
const message = options.description
  ? `${options.title}. ${options.description}`
  : options.title;

// Politeness based on priority:
const priority = options.priority ?? 'polite';
this.liveAnnouncer.announce(message, priority);
```

## Max Toasts Limit

```typescript
const MAX_TOASTS = 5;

// When exceeding limit, oldest toasts are removed:
if (newToasts.length > MAX_TOASTS) {
  return newToasts.slice(-MAX_TOASTS);
}
```

## Usage Patterns

```typescript
// PATTERN 1: Quick feedback
save() {
  // ... save logic
  this.toastService.success('Saved!');
}

// PATTERN 2: With undo action
delete(item: Item) {
  this.items.remove(item);
  this.toastService.show({
    title: 'Item deleted',
    action: {
      label: 'Undo',
      onClick: () => this.items.restore(item),
    },
  });
}

// PATTERN 3: Progress indication
async upload(file: File) {
  const toastId = this.toastService.show({
    title: 'Uploading...',
    dismissType: 'fixed',
  });

  try {
    await this.uploadService.upload(file);
    this.toastService.dismiss(toastId);
    this.toastService.success('Upload complete');
  } catch {
    this.toastService.dismiss(toastId);
    this.toastService.error('Upload failed');
  }
}

// PATTERN 4: Multiple positions for different contexts
// Errors at top (more visible)
this.toastService.show({
  title: 'Connection lost',
  class: 'border-red-500 text-red-600',
  priority: 'assertive',
  position: 'top-center',
});

// Success at bottom (less intrusive)
this.toastService.success('Saved'); // Uses default 'bottom-right'
```

## Do's and Don'ts

### Do
- Add `<sng-toaster>` once in app root, not in every component
- Use `success()`, `error()`, `warning()` shortcuts for common cases
- Keep titles short (2-4 words): "Saved", "Error", "Deleted"
- Use `dismissType: 'fixed'` for toasts requiring user acknowledgment
- Match duration to message importance (quick confirms = short, errors = longer)
- Use consistent positions throughout your app

### Don't
- Add multiple `<sng-toaster>` components - only one needed
- Toast everything - reserve for user-initiated actions
- Use error styling (`priority: 'assertive'`) for informational messages
- Write long titles - use description for details
- Show more than 5 simultaneous toasts (auto-handled, but avoid the need)
- Forget to handle the returned toast ID if you need to dismiss programmatically

## Common Mistakes

1. **Multiple toaster instances** - Only add `<sng-toaster>` once in app root, not in every component or page.

2. **Forgetting toaster component** - Without `<sng-toaster>`, toasts are added to state but never rendered.

3. **Wrong import path** - Import from `'sng-ui'`, not from individual files.

4. **Using npm install** - Use `npx @shadng/sng-ui add toast` (copy-paste model).

5. **Fixed dismiss without handling** - If using `dismissType: 'fixed'`, ensure users can dismiss or you dismiss programmatically.

6. **Toasting non-user actions** - Avoid toasting background sync, polling results, or other automated processes.

## Accessibility Summary

### Screen Reader Support
- Uses `LiveAnnouncer` from `@angular/cdk/a11y`
- Toasts with `priority: 'assertive'` interrupt immediately (used by `error()`)
- Default `priority: 'polite'` waits for pause in speech
- Full message announced: title + description

### Interaction
- Close button focusable with focus
- Action button (if present) is focusable
- No focus trap - toasts are informational, not modal
- Toasts don't block page interaction (pointer-events-none on container)
