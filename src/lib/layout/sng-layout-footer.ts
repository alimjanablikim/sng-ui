import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * A flexible footer component for page layouts.
 * Can be used standalone or within a full layout structure.
 *
 * @example
 * ```html
 * <sng-layout-footer>
 *   <span>&copy; 2024 Company</span>
 *   <nav>...</nav>
 * </sng-layout-footer>
 * ```
 */
@Component({
  selector: 'sng-layout-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutFooter {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('flex w-full items-center h-8 px-4 border-t border-border bg-background shrink-0', this.class())
  );
}
