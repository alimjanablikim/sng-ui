import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Header section for dialog content.
 * Typically contains the title and description elements.
 *
 * @example
 * ```html
 * <sng-dialog-header>
 *   <sng-dialog-title>Edit Profile</sng-dialog-title>
 *   <sng-dialog-description>Make changes to your profile here.</sng-dialog-description>
 * </sng-dialog-header>
 * ```
 */
@Component({
  selector: 'sng-dialog-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngDialogHeader {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('flex flex-col gap-2 text-center sm:text-left', this.class())
  );
}
