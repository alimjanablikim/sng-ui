import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Container for breadcrumb items.
 *
 * Renders as a flex container that wraps `SngBreadcrumbItem` and `SngBreadcrumbSeparator` components.
 *
 * @example
 * ```html
 * <sng-breadcrumb-list>
 *   <sng-breadcrumb-item>...</sng-breadcrumb-item>
 *   <sng-breadcrumb-separator />
 *   <sng-breadcrumb-item>...</sng-breadcrumb-item>
 * </sng-breadcrumb-list>
 * ```
 */
@Component({
  selector: 'sng-breadcrumb-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngBreadcrumbList {
  /** Custom CSS classes. */
  class = input<string>('');

  /** @internal */
  hostClasses = computed(() =>
    cn('flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5', this.class())
  );
}
