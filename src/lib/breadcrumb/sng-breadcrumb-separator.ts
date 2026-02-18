import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Visual separator between breadcrumb items.
 *
 * Renders a chevron-right icon by default. Hidden from assistive technology
 * via `role="presentation"` and `aria-hidden="true"`.
 *
 * @example
 * ```html
 * <sng-breadcrumb-item>...</sng-breadcrumb-item>
 * <sng-breadcrumb-separator />
 * <sng-breadcrumb-item>...</sng-breadcrumb-item>
 *
 * <!-- Custom separator -->
 * <sng-breadcrumb-separator>
 *   <custom-icon class="size-4" />
 * </sng-breadcrumb-separator>
 * ```
 */
@Component({
  selector: 'sng-breadcrumb-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'presentation',
    'aria-hidden': 'true',
    '[class]': 'hostClasses()',
  },
  styles: [`
    sng-breadcrumb-separator > svg {
      width: 0.875rem;
      height: 0.875rem;
    }
  `],
  template: `
    <ng-content>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </ng-content>
  `,
})
export class SngBreadcrumbSeparator {
  /** Custom CSS classes. */
  class = input<string>('');

  /** @internal */
  hostClasses = computed(() =>
    cn(this.class())
  );
}
