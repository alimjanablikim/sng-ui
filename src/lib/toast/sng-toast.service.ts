import { Injectable, signal, Signal, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Subscription, timer } from 'rxjs';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export type ToastPosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
export type ToastDismissType = 'countdown' | 'fixed';

/**
 * Screen reader announcement priority for toast notifications.
 * - 'polite': Waits for silence (default, use for success/info)
 * - 'assertive': Interrupts immediately (use for errors)
 */
export type ToastPriority = 'polite' | 'assertive';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  action?: ToastAction;
  /**
   * Custom Tailwind classes for styling. No variant input - use classes directly.
   *
   * Common styling patterns:
   * - Success: `class="border-green-500 text-green-600"`
   * - Error: `class="border-red-500 text-red-600"`
   * - Warning: `class="border-yellow-500 text-yellow-600"`
   * - Info: `class="border-blue-500 text-blue-600"`
   * - Custom width: `class="w-[400px]"` (default: w-[360px])
   */
  class?: string;
  /** Screen reader announcement priority. */
  priority?: ToastPriority;
  duration?: number;
  position?: ToastPosition;
  dismissType?: ToastDismissType;
  /** @internal Animation state for enter/exit transitions. */
  _state?: 'open' | 'closed';
}

export interface ToastOptions {
  title: string;
  description?: string;
  action?: ToastAction;
  /**
   * Custom Tailwind classes for styling. No variant input - use classes directly.
   *
   * Common styling patterns:
   * - Success: `class="border-green-500 text-green-600"`
   * - Error: `class="border-red-500 text-red-600"`
   * - Warning: `class="border-yellow-500 text-yellow-600"`
   * - Info: `class="border-blue-500 text-blue-600"`
   * - Custom width: `class="w-[400px]"` (default: w-[360px])
   */
  class?: string;
  /** Screen reader announcement priority. */
  priority?: ToastPriority;
  duration?: number;
  position?: ToastPosition;
  dismissType?: ToastDismissType;
}

const TOASTS = signal<Toast[]>([]);
let nextToastId = 0;

function getToastsSignal() {
  return TOASTS;
}

const MAX_TOASTS = 5;

/**
 * Service for displaying toast notifications. Provides methods for showing
 * different types of toasts (success, error, warning) with customizable
 * position, duration, and actions. Automatically announces messages to
 * screen readers for accessibility.
 *
 * @example
 * ```typescript
 * export class MyComponent {
 *   private toastService = inject(SngToastService);
 *
 *   showSuccess(): void {
 *     this.toastService.success('Changes saved', 'Your settings have been updated.');
 *   }
 *
 *   showWithAction(): void {
 *     this.toastService.show({
 *       title: 'File deleted',
 *       description: 'The file has been moved to trash.',
 *       action: { label: 'Undo', onClick: () => this.undoDelete() },
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class SngToastService {
  private liveAnnouncer = inject(LiveAnnouncer);
  private autoDismissSubscriptions = new Map<string, Subscription>();
  private removalSubscriptions = new Map<string, Subscription>();

  /** Readonly signal containing all currently visible toasts. */
  readonly toasts: Signal<readonly Toast[]> = getToastsSignal().asReadonly();

  private generateId(): string {
    nextToastId += 1;
    return `toast-${nextToastId}`;
  }

  /**
   * Shows a toast notification with the provided options.
   * @param options - Configuration for the toast including title, description, class, etc.
   * @returns The unique ID of the created toast (can be used with dismiss()).
   */
  show(options: ToastOptions): string {
    const id = this.generateId();
    const dismissType = options.dismissType ?? 'countdown';
    const toast: Toast = {
      id,
      title: options.title,
      description: options.description,
      action: options.action,
      class: options.class,
      priority: options.priority ?? 'polite',
      duration: options.duration ?? 3000,
      position: options.position ?? 'bottom-right',
      dismissType,
    };

    getToastsSignal().update(toasts => {
      const newToasts = [...toasts, toast];
      // Remove oldest toasts if exceeding max limit
      if (newToasts.length > MAX_TOASTS) {
        const removedToasts = newToasts.slice(0, newToasts.length - MAX_TOASTS);
        removedToasts.forEach(removed => this.clearToastTimers(removed.id));
        return newToasts.slice(-MAX_TOASTS);
      }
      return newToasts;
    });

    // Announce to screen readers
    const message = options.description
      ? `${options.title}. ${options.description}`
      : options.title;
    this.liveAnnouncer.announce(message, toast.priority!);

    // Only auto-dismiss for countdown type
    if (dismissType === 'countdown' && toast.duration && toast.duration > 0) {
      const subscription = timer(toast.duration).subscribe(() => {
        this.autoDismissSubscriptions.delete(id);
        this.dismiss(id);
      });
      this.autoDismissSubscriptions.set(id, subscription);
    }

    return id;
  }

  /**
   * Shows a success toast notification with green styling.
   * Uses polite screen reader announcement.
   * @param title - The toast title.
   * @param description - Optional description text.
   * @returns The unique ID of the created toast.
   */
  success(title: string, description?: string): string {
    return this.show({
      title,
      description,
      class: 'border-green-500 text-green-600',
      priority: 'polite',
    });
  }

  /**
   * Shows an error toast notification with red styling.
   * Uses assertive screen reader announcement (interrupts immediately).
   * @param title - The toast title.
   * @param description - Optional description text.
   * @returns The unique ID of the created toast.
   */
  error(title: string, description?: string): string {
    return this.show({
      title,
      description,
      class: 'border-red-500 text-red-600',
      priority: 'assertive',
    });
  }

  /**
   * Shows a warning toast notification with yellow styling.
   * Uses polite screen reader announcement.
   * @param title - The toast title.
   * @param description - Optional description text.
   * @returns The unique ID of the created toast.
   */
  warning(title: string, description?: string): string {
    return this.show({
      title,
      description,
      class: 'border-yellow-500 text-yellow-600',
      priority: 'polite',
    });
  }

  /**
   * Dismisses a specific toast by its ID with an exit animation.
   * Sets the toast state to 'closed' to trigger the CSS exit animation,
   * then removes the toast from the array after the animation completes.
   * @param id - The unique ID of the toast to dismiss.
   */
  dismiss(id: string): void {
    this.autoDismissSubscriptions.get(id)?.unsubscribe();
    this.autoDismissSubscriptions.delete(id);

    const currentToasts = getToastsSignal();
    const targetToast = currentToasts().find(t => t.id === id);
    if (!targetToast) return;

    if (this.removalSubscriptions.has(id)) {
      return;
    }

    // Set state to 'closed' to trigger exit animation
    currentToasts.update(toasts =>
      toasts.map(t => t.id === id ? { ...t, _state: 'closed' as const } : t)
    );

    // Remove after exit animation completes (300ms matches sng-toast-exit duration)
    const subscription = timer(300).subscribe(() => {
      this.removalSubscriptions.delete(id);
      currentToasts.update(toasts => toasts.filter(t => t.id !== id));
    });
    this.removalSubscriptions.set(id, subscription);
  }

  /** Immediately dismisses all visible toasts without animation. */
  dismissAll(): void {
    this.autoDismissSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.autoDismissSubscriptions.clear();
    this.removalSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.removalSubscriptions.clear();
    getToastsSignal().set([]);
  }

  private clearToastTimers(id: string): void {
    this.autoDismissSubscriptions.get(id)?.unsubscribe();
    this.autoDismissSubscriptions.delete(id);
    this.removalSubscriptions.get(id)?.unsubscribe();
    this.removalSubscriptions.delete(id);
  }
}
