import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Horizontal separator line for visually dividing sidebar sections.
 * Use between groups or menu items for visual organization.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-content>
 *   <sng-layout-sidebar-group>...</sng-layout-sidebar-group>
 *   <sng-layout-sidebar-separator />
 *   <sng-layout-sidebar-group>...</sng-layout-sidebar-group>
 * </sng-layout-sidebar-content>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarSeparator {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('mx-2 w-auto bg-sidebar-border h-px', this.class())
  );
}
