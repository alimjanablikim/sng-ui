import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Breadcrumb navigation root container.
 *
 * Wraps breadcrumb items in a semantic `<nav>` element with proper ARIA labeling.
 * Use with `SngBreadcrumbList`, `SngBreadcrumbItem`, and related components.
 *
 * @example
 * ```html
 * <sng-breadcrumb>
 *   <sng-breadcrumb-list>
 *     <sng-breadcrumb-item>
 *       <sng-breadcrumb-link href="/">Home</sng-breadcrumb-link>
 *     </sng-breadcrumb-item>
 *     <sng-breadcrumb-separator />
 *     <sng-breadcrumb-item>
 *       <sng-breadcrumb-page>Current Page</sng-breadcrumb-page>
 *     </sng-breadcrumb-item>
 *   </sng-breadcrumb-list>
 * </sng-breadcrumb>
 * ```
 */
@Component({
  selector: 'sng-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngBreadcrumb {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Accessible label for the breadcrumb navigation region. */
  ariaLabel = input<string>('breadcrumb');

  /** @internal */
  hostClasses = computed(() => cn(this.class()));
}
