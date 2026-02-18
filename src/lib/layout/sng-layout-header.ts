import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * A flexible header component for page layouts.
 * Can be used standalone or within a full layout structure.
 *
 * @example
 * ```html
 * <sng-layout-header>
 *   <img src="logo.svg" alt="Logo" />
 *   <nav>...</nav>
 *   <button>Login</button>
 * </sng-layout-header>
 * ```
 */
@Component({
  selector: 'sng-layout-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutHeader {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('flex w-full items-center h-14 px-4 border-b border-border bg-background shrink-0', this.class())
  );
}
