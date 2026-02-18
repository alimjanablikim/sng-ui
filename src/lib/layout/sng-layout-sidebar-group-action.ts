import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { cn } from './cn';

/**
 * Action button positioned in the top-right corner of a sidebar group.
 * Typically used for adding new items or triggering group-level actions.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-group>
 *   <sng-layout-sidebar-group-label>Projects</sng-layout-sidebar-group-label>
 *   <sng-layout-sidebar-group-action (click)="addProject()">
 *     <lucide-icon name="plus" />
 *   </sng-layout-sidebar-group-action>
 *   <sng-layout-sidebar-group-content>...</sng-layout-sidebar-group-content>
 * </sng-layout-sidebar-group>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-group-action',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-layout-sidebar-group-action > button > svg {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
    }
  `],
  host: {
    'class': 'contents',
  },
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled()"
    >
      <ng-content />
    </button>
  `,
})
export class SngLayoutSidebarGroupAction {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Whether the button is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  buttonClasses = computed(() =>
    cn(
      'cursor-pointer text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-colors focus-visible:ring-2',
      // Increases the hit area of the button on mobile
      'after:absolute after:-inset-2 md:after:hidden',
      'group-data-[collapsible=icon]:hidden',
      this.class()
    )
  );
}
