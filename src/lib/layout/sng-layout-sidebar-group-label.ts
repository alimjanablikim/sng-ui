import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Label for a sidebar group, displayed above the group content.
 * Automatically hides when sidebar is in icon-only collapsed mode.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-group>
 *   <sng-layout-sidebar-group-label>
 *     <lucide-icon name="folder" />
 *     Projects
 *   </sng-layout-sidebar-group-label>
 *   <sng-layout-sidebar-group-content>...</sng-layout-sidebar-group-content>
 * </sng-layout-sidebar-group>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-group-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-layout-sidebar[data-collapsible='icon'] sng-layout-sidebar-group-label {
      display: none !important;
    }
    sng-layout-sidebar-group-label > svg {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
    }
  `],
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarGroupLabel {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn(
      'text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2',
      'group-data-[collapsible=icon]:hidden',
      this.class()
    )
  );
}
