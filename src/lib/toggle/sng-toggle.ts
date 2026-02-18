import {
  Component,
  input,
  model,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';
import { cn } from './cn';

const INTERACTIVE_BASE = 'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

/**
 * A two-state button that can be toggled on or off.
 * Uses Angular's model() for two-way binding, compatible with Signal Forms.
 *
 * @example
 * ```html
 * <sng-toggle [(pressed)]="isBold">
 *   <svg>...</svg> Bold
 * </sng-toggle>
 * ```
 */
@Component({
  selector: 'sng-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-toggle svg {
      pointer-events: none;
      flex-shrink: 0;
    }

    sng-toggle svg:not([class*='size-']) {
      width: 1rem;
      height: 1rem;
    }
  `],
  host: {
    'role': 'button',
    '[attr.aria-pressed]': 'pressed()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[class]': 'hostClasses()',
    '[attr.data-state]': 'pressed() ? "on" : "off"',
    '(click)': 'toggle()',
  },
  template: `<ng-content />`,
})
export class SngToggle {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Whether the toggle is pressed/active. Supports two-way binding. */
  pressed = model(false);

  /** Whether the toggle is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  hostClasses = computed(() => {
    return cn(
      'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap',
      'h-9 px-2 min-w-9 text-sm border border-input bg-background shadow-sm',
      INTERACTIVE_BASE,
      'data-[state=off]:hover:bg-accent data-[state=off]:hover:text-accent-foreground',
      'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary',
      'data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground',
      this.class()
    );
  });

  toggle() {
    if (this.disabled()) return;
    this.pressed.set(!this.pressed());
  }
}
