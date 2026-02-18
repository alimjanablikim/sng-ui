import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Component for breadcrumb navigation links.
 *
 * Renders an anchor element within `SngBreadcrumbItem` to create clickable breadcrumb links.
 * Includes hover state styling.
 *
 * @example
 * ```html
 * <sng-breadcrumb-link href="/">Home</sng-breadcrumb-link>
 * <sng-breadcrumb-link href="/products">Products</sng-breadcrumb-link>
 * ```
 */
@Component({
  selector: 'sng-breadcrumb-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  template: `<a [href]="href()" [class]="linkClasses()"><ng-content /></a>`,
})
export class SngBreadcrumbLink {
  /** URL for the breadcrumb link. */
  href = input<string>('#');

  /** Custom CSS classes. */
  class = input<string>('');

  /** @internal */
  linkClasses = computed(() =>
    cn('transition-colors hover:text-foreground', this.class())
  );
}
