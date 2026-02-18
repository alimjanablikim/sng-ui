import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  input,
  computed,
  inject,
} from '@angular/core';
import { SNG_TABS } from './sng-tabs';
import { cn } from './cn';

const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none';

// Style customization via [class] + data-state attribute:
// Default (muted bg):    (built-in) — active: bg-background text-foreground shadow-sm, inactive: text-muted-foreground
// Underline:             class="border-b-2 -mb-px pb-1 px-0 py-0 rounded-none border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground"
// Pills:                 class="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:hover:bg-muted"

/**
 * A clickable tab trigger that activates the corresponding content panel.
 * Must be placed inside an `sng-tabs-list` component.
 *
 * @example
 * ```html
 * <sng-tabs-list>
 *   <sng-tabs-trigger value="overview">Overview</sng-tabs-trigger>
 *   <sng-tabs-trigger value="analytics">Analytics</sng-tabs-trigger>
 *   <sng-tabs-trigger value="reports">Reports</sng-tabs-trigger>
 * </sng-tabs-list>
 * ```
 */
@Component({
  selector: 'sng-tabs-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'tab',
    '[class]': 'hostClasses()',
    '[attr.data-state]': 'isSelected() ? "active" : "inactive"',
    '[attr.data-value]': 'value()',
    '[attr.id]': 'triggerId()',
    '[attr.aria-controls]': 'contentId()',
    '[attr.tabindex]': '0',
    '[attr.aria-selected]': 'isSelected()',
    '(click)': 'onClick()',
  },
  template: `<ng-content />`,
})
export class SngTabsTrigger {
  private tabs = inject(SNG_TABS);
  /** @internal */
  _elementRef = inject(ElementRef);

  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * Unique identifier for this tab. Must match the value of the corresponding `sng-tabs-content`.
   */
  value = input.required<string>();

  isSelected = computed(() => this.tabs.isSelected(this.value()));
  triggerId = computed(() => this.tabs.triggerId(this.value()));
  contentId = computed(() => this.tabs.contentId(this.value()));

  hostClasses = computed(() => {
    const selected = this.isSelected();
    return cn(
      baseClasses,
      'rounded-md',
      selected
        ? 'bg-background text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground',
      this.class()
    );
  });

  onClick() {
    this.tabs.select(this.value());
  }

  /** @internal Focus this trigger element. */
  _focus() {
    this._elementRef.nativeElement.focus();
  }
}
