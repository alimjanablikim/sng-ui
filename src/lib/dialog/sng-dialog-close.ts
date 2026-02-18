import {
  Component,
  input,
  computed,
  inject,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { SNG_DIALOG_CLOSE } from './sng-dialog';
import { cn } from './cn';

/**
 * Close button for dialog content.
 * Can be used as a standalone element or applied to existing buttons.
 * Provides a default X icon when used without content.
 *
 * @example
 * ```html
 * <!-- Standalone close button with default X icon -->
 * <sng-dialog-close></sng-dialog-close>
 *
 * <!-- With custom projected content -->
 * <sng-dialog-close>
 *   <span>Close</span>
 * </sng-dialog-close>
 * ```
 */
@Component({
  selector: 'sng-dialog-close',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'onClick()',
  },
  template: `
    <ng-content>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
      </svg>
      <span class="sr-only">{{ closeLabel() }}</span>
    </ng-content>
  `,
})
export class SngDialogClose {
  private closeDialog = inject(SNG_DIALOG_CLOSE, { optional: true });

  /** Custom CSS classes. */
  class = input<string>('');

  /** Accessible text for the default close icon. */
  closeLabel = input<string>('Close');

  hostClasses = computed(() =>
    cn(
      'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-[opacity,color] cursor-pointer hover:opacity-100 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none',
      this.class()
    )
  );

  onClick() {
    this.closeDialog?.();
  }
}
