import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  inject,
} from '@angular/core';
import { SNG_TABS } from './sng-tabs';
import { cn } from './cn';

/**
 * Content panel that is shown when the corresponding tab trigger is active.
 * Must be placed inside an `sng-tabs` component.
 *
 * @example
 * ```html
 * <sng-tabs defaultValue="account">
 *   <sng-tabs-list>
 *     <sng-tabs-trigger value="account">Account</sng-tabs-trigger>
 *     <sng-tabs-trigger value="settings">Settings</sng-tabs-trigger>
 *   </sng-tabs-list>
 *   <sng-tabs-content value="account">
 *     <p>Manage your account details here.</p>
 *   </sng-tabs-content>
 *   <sng-tabs-content value="settings">
 *     <p>Configure your preferences.</p>
 *   </sng-tabs-content>
 * </sng-tabs>
 * ```
 */
@Component({
  selector: 'sng-tabs-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'tabpanel',
    '[class]': 'hostClasses()',
    '[attr.id]': 'contentId()',
    '[attr.aria-labelledby]': 'triggerId()',
    '[attr.data-state]': 'isSelected() ? "active" : "inactive"',
    '[hidden]': '!isSelected()',
  },
  template: `<ng-content />`,
})
export class SngTabsContent {
  private tabs = inject(SNG_TABS);

  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * Unique identifier for this content panel. Must match the value of the corresponding `sng-tabs-trigger`.
   */
  value = input.required<string>();

  isSelected = computed(() => this.tabs.isSelected(this.value()));
  contentId = computed(() => this.tabs.contentId(this.value()));
  triggerId = computed(() => this.tabs.triggerId(this.value()));

  hostClasses = computed(() =>
    cn(
      'flex-1 outline-none',
      this.class()
    )
  );
}
