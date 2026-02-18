import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  input,
  inject,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Trigger element for a submenu. Displays a chevron icon indicating
 * a nested menu is available on hover.
 *
 * @example
 * ```html
 * <sng-menu-sub>
 *   <sng-menu-sub-trigger>Share</sng-menu-sub-trigger>
 *   <sng-menu-sub-content>
 *     <sng-menu-item>Email</sng-menu-item>
 *   </sng-menu-sub-content>
 * </sng-menu-sub>
 * ```
 */
@Component({
  selector: 'sng-menu-sub-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    'role': 'menuitem',
    'aria-haspopup': 'menu',
    'tabindex': '0',
  },
  template: `
    <ng-content />
    <svg
      class="ml-auto h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  `,
})
export class SngMenuSubTrigger {
  /** @internal Element ref for overlay positioning. */
  _elementRef = inject(ElementRef);

  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn(
      'flex cursor-default select-none items-center justify-between gap-4 whitespace-nowrap rounded-sm px-2 py-1.5 text-sm outline-none',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:bg-accent focus-visible:text-accent-foreground',
      this.class()
    )
  );
}
