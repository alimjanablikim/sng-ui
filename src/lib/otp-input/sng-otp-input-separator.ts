import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Visual separator between OTP slot groups.
 * Displays a dash/line icon between groups.
 *
 * @example
 * ```html
 * <sng-otp-input-group>...</sng-otp-input-group>
 * <sng-otp-input-separator />
 * <sng-otp-input-group>...</sng-otp-input-group>
 * ```
 */
@Component({
  selector: 'sng-otp-input-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    'role': 'separator',
  },
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"/>
    </svg>
  `,
})
export class SngOtpInputSeparator {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('flex items-center justify-center', this.class())
  );
}
