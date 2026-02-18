import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Current page indicator in breadcrumb navigation.
 *
 * Displays the current page name with `aria-current="page"` for accessibility.
 * Use instead of `SngBreadcrumbLink` for the final (non-clickable) item.
 *
 * @example
 * ```html
 * <sng-breadcrumb-item>
 *   <sng-breadcrumb-page>Product Details</sng-breadcrumb-page>
 * </sng-breadcrumb-item>
 * ```
 */
@Component({
  selector: 'sng-breadcrumb-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'link',
    'aria-disabled': 'true',
    'aria-current': 'page',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngBreadcrumbPage {
  /** Custom CSS classes. */
  class = input<string>('');

  /** @internal */
  hostClasses = computed(() =>
    cn('font-normal text-foreground', this.class())
  );
}
