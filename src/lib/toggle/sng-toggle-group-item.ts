import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  inject,
  booleanAttribute,
} from '@angular/core';
import { SNG_TOGGLE_GROUP } from './sng-toggle-group';
import { cn } from './cn';

/**
 * An individual toggle button within a toggle group.
 * Must be used inside a `sng-toggle-group` container.
 *
 * @example
 * ```html
 * <sng-toggle-group type="single">
 *   <sng-toggle-group-item value="bold">B</sng-toggle-group-item>
 *   <sng-toggle-group-item value="italic">I</sng-toggle-group-item>
 * </sng-toggle-group>
 * ```
 */
@Component({
  selector: 'sng-toggle-group-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-toggle-group-item svg {
      pointer-events: none;
      flex-shrink: 0;
    }

    sng-toggle-group-item svg:not([class*='size-']) {
      width: 1rem;
      height: 1rem;
    }
  `],
  host: {
    'role': 'button',
    '[attr.aria-pressed]': 'isSelected()',
    '[attr.disabled]': 'disabled() || null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[class]': 'hostClasses()',
    '[attr.data-state]': 'isSelected() ? "on" : "off"',
    '(click)': 'onActivate()',
  },
  template: `<ng-content />`,
})
export class SngToggleGroupItem {
  private group = inject(SNG_TOGGLE_GROUP);

  /** Custom CSS classes. */
  class = input<string>('');

  /** The value associated with this toggle item. */
  value = input.required<string>();

  /** Whether this toggle item is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  isSelected = computed(() => this.group.isSelected(this.value()));

  hostClasses = computed(() => {
    const isDisabled = this.disabled();

    return cn(
      'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap cursor-pointer',
      'h-9 min-w-9 px-3 text-sm border border-input bg-background shadow-sm',
      'transition-colors outline-none select-none',
      'data-[state=off]:hover:bg-accent data-[state=off]:hover:text-accent-foreground',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'focus:z-10 focus-visible:z-10',
      'rounded-none first:rounded-l-md last:rounded-r-md first:ml-0 -ml-px',
      isDisabled && 'pointer-events-none opacity-50',
      'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary',
      'data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground',
      this.class()
    );
  });

  onActivate() {
    if (!this.disabled()) {
      this.group.toggle(this.value());
    }
  }
}
