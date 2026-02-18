import {
  Component,
  computed,
  input,
  inject,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
} from '@angular/core';
import { SngRadio } from './sng-radio';
import { cn } from './cn';

const TRANSITION_SHADOW = 'transition-[color,box-shadow] outline-none';
const FOCUS_RING = 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

/**
 * An individual radio button within a radio group.
 * Must be used inside a `sng-radio` container.
 *
 * @example
 * ```html
 * <sng-radio [(value)]="selected">
 *   <sng-radio-item value="option1">Option 1</sng-radio-item>
 *   <sng-radio-item value="option2">Option 2</sng-radio-item>
 * </sng-radio>
 * ```
 */
@Component({
  selector: 'sng-radio-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'select()',
    '[attr.role]': '"radio"',
    '[attr.aria-checked]': 'isChecked()',
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.tabindex]': '_tabindex()',
    '[attr.data-state]': 'isChecked() ? "checked" : "unchecked"',
  },
  template: `
    @if (isChecked()) {
      <svg
        [class]="dotClasses()"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12"/>
      </svg>
    }
  `,
})
export class SngRadioItem {
  private group = inject(forwardRef(() => SngRadio), { optional: true });

  /** Custom CSS classes. */
  class = input<string>('');

  /** The value associated with this radio item. */
  value = input.required<string>();

  /** Whether this radio item is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  isDisabled = computed(() => this.disabled() || (this.group?.disabled() ?? false));

  isChecked = computed(() => {
    if (!this.group) return false;
    return this.group.value() === this.value();
  });

  /** @internal */
  _tabindex = computed(() => {
    return this.isDisabled() ? -1 : 0;
  });

  hostClasses = computed(() =>
    cn(
      'aspect-square shrink-0 rounded-full border shadow-xs',
      'size-4',
      'cursor-pointer flex items-center justify-center text-primary',
      TRANSITION_SHADOW,
      FOCUS_RING,
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      'aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
      'border-input dark:bg-input/30',
      this.class()
    )
  );

  /** @internal */
  dotClasses = computed(() => cn('fill-primary', 'size-1/2'));

  select() {
    if (this.isDisabled()) return;
    this.group?._selectValue(this.value());
  }
}
