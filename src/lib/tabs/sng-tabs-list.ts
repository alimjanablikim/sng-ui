import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  inject,
} from '@angular/core';
import { SNG_TABS } from './sng-tabs';
import { cn } from './cn';

// Style customization via [class]:
// Default (muted bg):    class="bg-muted rounded-lg p-1"  (built-in)
// Underline:             class="border-b border-border bg-transparent p-0 rounded-none"
// Pills:                 class="bg-transparent gap-1 p-0"

/**
 * Container for tab triggers that provides proper tablist semantics.
 * Must be placed inside an `sng-tabs` component.
 *
 * @example
 * ```html
 * <sng-tabs defaultValue="tab1">
 *   <sng-tabs-list>
 *     <sng-tabs-trigger value="tab1">Tab 1</sng-tabs-trigger>
 *     <sng-tabs-trigger value="tab2">Tab 2</sng-tabs-trigger>
 *   </sng-tabs-list>
 * </sng-tabs>
 * ```
 */
@Component({
  selector: 'sng-tabs-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'tablist',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngTabsList {
  /** @internal */
  readonly tabs = inject(SNG_TABS);

  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn(
      'inline-flex items-center justify-center bg-muted rounded-lg p-1',
      this.class()
    )
  );
}
