import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Groups OTP slots together visually (e.g., for 3-3 or 4-2 patterns).
 * Use multiple groups with separators for common OTP layouts.
 *
 * @example
 * ```html
 * <sng-otp-input-group>
 *   <sng-otp-input-slot [index]="0" />
 *   <sng-otp-input-slot [index]="1" />
 *   <sng-otp-input-slot [index]="2" />
 * </sng-otp-input-group>
 * ```
 */
@Component({
  selector: 'sng-otp-input-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngOtpInputGroup {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('flex items-center', this.class())
  );
}
