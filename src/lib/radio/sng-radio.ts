import {
  Component,
  model,
  computed,
  ChangeDetectionStrategy,
  input,
  booleanAttribute,
} from '@angular/core';
import { cn } from './cn';

/**
 * A radio group container that manages selection state for radio items.
 * Uses Angular's model() for two-way binding, compatible with Signal Forms.
 *
 * @example
 * ```html
 * <sng-radio [(value)]="selectedPlan">
 *   <sng-radio-item value="free">Free</sng-radio-item>
 *   <sng-radio-item value="pro">Pro</sng-radio-item>
 * </sng-radio>
 * ```
 */
@Component({
  selector: 'sng-radio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': '"radiogroup"',
    '[attr.aria-disabled]': 'disabled()',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngRadio {
  /** Custom CSS classes. */
  class = input<string>('');

  /** The selected value. Supports two-way binding. */
  value = model<string>('');

  /** Name attribute for the radio group. */
  name = input<string>('');

  /** Whether the entire radio group is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  hostClasses = computed(() => cn('grid gap-3', this.class()));

  /** @internal Called by radio items when selected. */
  _selectValue(value: string) {
    if (this.disabled()) return;
    this.value.set(value);
  }
}
