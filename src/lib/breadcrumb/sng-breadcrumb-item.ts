import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Individual breadcrumb item wrapper.
 *
 * Contains either a `SngBreadcrumbLink` (for navigable items) or
 * `SngBreadcrumbPage` (for the current page).
 *
 * @example
 * ```html
 * <!-- Navigable item -->
 * <sng-breadcrumb-item>
 *   <sng-breadcrumb-link href="/products">Products</sng-breadcrumb-link>
 * </sng-breadcrumb-item>
 *
 * <!-- Current page -->
 * <sng-breadcrumb-item>
 *   <sng-breadcrumb-page>Product Details</sng-breadcrumb-page>
 * </sng-breadcrumb-item>
 * ```
 */
@Component({
  selector: 'sng-breadcrumb-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngBreadcrumbItem {
  /** Custom CSS classes. */
  class = input<string>('');

  /** @internal */
  hostClasses = computed(() =>
    cn('inline-flex items-center gap-1.5', this.class())
  );
}
