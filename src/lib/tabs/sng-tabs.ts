import {
  Component,
  ChangeDetectionStrategy,
  signal,
  input,
  output,
  InjectionToken,
  computed,
} from '@angular/core';
import { cn } from './cn';

export const SNG_TABS = new InjectionToken<SngTabs>('SNG_TABS');

/**
 * Container component for a tabbed interface.
 * Manages tab selection state and coordinates between triggers and content panels.
 *
 * @example
 * ```html
 * <sng-tabs defaultValue="account">
 *   <sng-tabs-list>
 *     <sng-tabs-trigger value="account">Account</sng-tabs-trigger>
 *     <sng-tabs-trigger value="password">Password</sng-tabs-trigger>
 *   </sng-tabs-list>
 *   <sng-tabs-content value="account">Account settings here.</sng-tabs-content>
 *   <sng-tabs-content value="password">Password settings here.</sng-tabs-content>
 * </sng-tabs>
 * ```
 */
@Component({
  selector: 'sng-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SNG_TABS, useExisting: SngTabs }],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngTabs {
  private static _instanceCounter = 0;
  private readonly _instanceId = `sng-tabs-${++SngTabs._instanceCounter}`;

  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * The value of the tab that should be selected by default.
   */
  defaultValue = input<string>('');

  /**
   * Emitted when the selected tab changes.
   */
  valueChange = output<string>();

  private _selectedValue = signal<string | null>(null);

  hostClasses = computed(() => cn('flex flex-col gap-1', this.class()));

  selectedValue = computed(() => this._selectedValue() ?? this.defaultValue());

  select(value: string) {
    this._selectedValue.set(value);
    this.valueChange.emit(value);
  }

  isSelected(value: string): boolean {
    return this.selectedValue() === value;
  }

  triggerId(value: string): string {
    return `${this._instanceId}-trigger-${this.slug(value)}`;
  }

  contentId(value: string): string {
    return `${this._instanceId}-content-${this.slug(value)}`;
  }

  private slug(value: string): string {
    return value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  }
}
