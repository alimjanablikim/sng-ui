import {
  Component,
  ChangeDetectionStrategy,
  model,
} from '@angular/core';

/**
 * Container for radio menu items. Manages single-selection state.
 *
 * @example
 * ```html
 * <sng-menu>
 *   <sng-menu-radio-group [(value)]="selectedTheme">
 *     <sng-menu-radio-item value="light">Light</sng-menu-radio-item>
 *     <sng-menu-radio-item value="dark">Dark</sng-menu-radio-item>
 *     <sng-menu-radio-item value="system">System</sng-menu-radio-item>
 *   </sng-menu-radio-group>
 * </sng-menu>
 * ```
 */
@Component({
  selector: 'sng-menu-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'group',
  },
  template: `<ng-content />`,
})
export class SngMenuRadioGroup {
  /** The currently selected value. Supports two-way binding. */
  value = model<string>('');

  /** @internal Called by child radio items to select a value. */
  _selectValue(newValue: string) {
    this.value.set(newValue);
  }
}
