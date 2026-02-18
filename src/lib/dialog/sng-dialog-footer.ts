import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Footer section for dialog content.
 * Typically contains action buttons like Save, Cancel, or Close.
 *
 * @example
 * ```html
 * <sng-dialog-footer>
 *   <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="dialog.close()">Cancel</sng-button>
 *   <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90" (click)="dialog.close()">Save changes</sng-button>
 * </sng-dialog-footer>
 * ```
 */
@Component({
  selector: 'sng-dialog-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngDialogFooter {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', this.class())
  );
}
