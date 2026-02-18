import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  computed,
} from '@angular/core';
import type { Toast } from './sng-toast.service';
import { cn } from './cn';

/**
 * Individual toast notification component that displays a message with optional
 * action button and close functionality.
 *
 * Styling is controlled via the `class` property on the Toast object.
 * See SngToastService for styling patterns.
 *
 * @example
 * ```html
 * <sng-toast [toast]="toastData" (dismissed)="onDismiss()" />
 * ```
 */
@Component({
  selector: 'sng-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {},
  styles: [`
    .sng-toast[data-state=open] {
      animation: sng-toast-enter var(--sng-toast-duration, 300ms) var(--sng-toast-ease, ease) both;
    }
    .sng-toast[data-state=closed] {
      animation: sng-toast-exit var(--sng-toast-duration, 300ms) var(--sng-toast-ease, ease) both;
    }
    @keyframes sng-toast-enter {
      from { opacity: 0; transform: translateX(1rem); }
    }
    @keyframes sng-toast-exit {
      to { opacity: 0; transform: translateX(1rem); }
    }
  `],
  template: `
    <div class="sng-toast" [attr.data-state]="toast()._state ?? 'open'" [class]="containerClasses()">
      <div class="flex-1 min-w-0 space-y-1 pr-6">
        <div class="text-sm font-semibold">{{ toast().title }}</div>
        @if (toast().description) {
          <div class="text-sm text-muted-foreground">{{ toast().description }}</div>
        }
      </div>
      @if (toast().action) {
        <button
          type="button"
          class="inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 mr-6"
          (click)="onAction()"
        >
          {{ toast().action!.label }}
        </button>
      }
      <button
        type="button"
        [attr.aria-label]="dismissAriaLabel()"
        class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 hover:text-foreground"
        (click)="dismissed.emit()"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `,
})
export class SngToast {
  /** The toast data object containing title, description, class, and other options. */
  toast = input.required<Toast>();

  /** Emits when the toast is dismissed via the close button or action button. */
  dismissed = output<void>();

  /** Aria label for the dismiss button. */
  dismissAriaLabel = input<string>('Dismiss notification');

  containerClasses = computed(() => {
    const toast = this.toast();

    // Base styles (always applied) — animation is driven by data-state attribute
    const base = 'group pointer-events-auto relative flex items-start justify-between gap-4 overflow-hidden rounded-lg border p-4 shadow-lg text-sm bg-background border-border';

    // Custom class (user-provided styling, e.g., "border-green-500 text-green-600 w-[400px]")
    // Default width is w-[360px] if not specified
    const customClass = toast.class || 'w-[360px]';

    return cn(base, customClass);
  });

  onAction(): void {
    this.toast().action?.onClick();
    this.dismissed.emit();
  }
}
