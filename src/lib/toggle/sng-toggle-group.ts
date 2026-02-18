import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  linkedSignal,
  InjectionToken,
} from '@angular/core';
import { cn } from './cn';

export const SNG_TOGGLE_GROUP = new InjectionToken<SngToggleGroup>('SNG_TOGGLE_GROUP');

/**
 * A group container for toggle items that manages single or multiple selection.
 * Used with SngToggleGroupItem for toolbar-style selection patterns.
 *
 * @example
 * ```html
 * <sng-toggle-group type="single" [defaultValue]="'center'">
 *   <sng-toggle-group-item value="left">Left</sng-toggle-group-item>
 *   <sng-toggle-group-item value="center">Center</sng-toggle-group-item>
 *   <sng-toggle-group-item value="right">Right</sng-toggle-group-item>
 * </sng-toggle-group>
 * ```
 */
@Component({
  selector: 'sng-toggle-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SNG_TOGGLE_GROUP, useExisting: SngToggleGroup }],
  host: {
    'role': 'group',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngToggleGroup {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Selection mode: 'single' allows one item, 'multiple' allows many. */
  type = input<'single' | 'multiple'>('single');

  /** Initial selected value(s). String for single, array for multiple. */
  defaultValue = input<string | string[]>('');

  private _selectedValues = linkedSignal(() => {
    const defaultVal = this.defaultValue();
    if (Array.isArray(defaultVal)) {
      return new Set(defaultVal);
    } else if (defaultVal) {
      return new Set([defaultVal]);
    }
    return new Set<string>();
  });

  hostClasses = computed(() =>
    cn('group/toggle-group flex w-fit items-center rounded-md', this.class())
  );

  selectedValues = computed(() => this._selectedValues());

  isSelected(value: string): boolean {
    return this.selectedValues().has(value);
  }

  toggle(value: string) {
    const current = new Set(this._selectedValues());
    if (this.type() === 'single') {
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.clear();
        current.add(value);
      }
    } else {
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
    }
    this._selectedValues.set(current);
  }
}
