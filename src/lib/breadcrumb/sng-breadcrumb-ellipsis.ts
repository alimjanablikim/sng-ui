import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Ellipsis indicator for collapsed breadcrumb items.
 *
 * Use when breadcrumb has too many items to display. Includes screen-reader-only
 * text "More" for accessibility.
 *
 * @example
 * ```html
 * <sng-breadcrumb-item>
 *   <sng-breadcrumb-link href="/">Home</sng-breadcrumb-link>
 * </sng-breadcrumb-item>
 * <sng-breadcrumb-separator />
 * <sng-breadcrumb-item>
 *   <sng-breadcrumb-ellipsis />
 * </sng-breadcrumb-item>
 * <sng-breadcrumb-separator />
 * <sng-breadcrumb-item>
 *   <sng-breadcrumb-page>Current</sng-breadcrumb-page>
 * </sng-breadcrumb-item>
 * ```
 */
@Component({
  selector: 'sng-breadcrumb-ellipsis',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'presentation',
    'aria-hidden': 'true',
    '[class]': 'hostClasses()',
  },
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="1"/>
      <circle cx="19" cy="12" r="1"/>
      <circle cx="5" cy="12" r="1"/>
    </svg>
    <span class="sr-only">{{ moreLabel() }}</span>
  `,
})
export class SngBreadcrumbEllipsis {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Accessible text for collapsed breadcrumb items. */
  moreLabel = input<string>('More');

  /** @internal */
  hostClasses = computed(() =>
    cn('flex h-9 w-9 items-center justify-center', this.class())
  );
}
