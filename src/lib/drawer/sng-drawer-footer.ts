import { Directive, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Footer section for the drawer, typically containing action buttons.
 * Positioned at the bottom with auto margin.
 *
 * @example
 * ```html
 * <sng-drawer-footer>
 *   <sng-drawer-close>
 *     <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Cancel</sng-button>
 *   </sng-drawer-close>
 *   <sng-drawer-close>
 *     <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">Submit</sng-button>
 *   </sng-drawer-close>
 * </sng-drawer-footer>
 * ```
 */
@Directive({
  selector: 'sng-drawer-footer',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngDrawerFooter {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('mt-auto flex flex-col-reverse gap-2 p-4 sm:flex-row sm:justify-center', this.class())
  );
}
