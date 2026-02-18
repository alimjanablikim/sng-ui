import {
  Component,
  computed,
  input,
  model,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  booleanAttribute,
  ElementRef,
  inject,
} from '@angular/core';
import { cn } from './cn';

const FOCUS_RING = 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

/**
 * A checkbox control that supports checked, unchecked, and indeterminate states.
 * Uses Angular's model() for two-way binding, compatible with Signal Forms.
 *
 * @example
 * ```html
 * <sng-checkbox [(checked)]="isChecked">Accept terms</sng-checkbox>
 * <sng-checkbox [indeterminate]="true" />
 * ```
 */
@Component({
  selector: 'sng-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'toggle()',
    '(document:click)': 'onDocumentClick($event)',
    '[attr.role]': '"checkbox"',
    '[attr.aria-checked]': 'ariaChecked()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.data-state]': 'dataState()',
  },
  styles: [`
    .sng-animate-check-scale-in {
      animation: sng-check-scale-in 100ms ease-out;
    }
    @keyframes sng-check-scale-in {
      from { transform: scale(0.5); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `],
  template: `
    @if (indeterminate()) {
      <svg
        [class]="iconClasses()"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    } @else if (checked()) {
      <svg
        [class]="iconClasses()"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    }
  `,
})
export class SngCheckbox {
  private hostElementRef = inject(ElementRef<HTMLElement>);

  /** Custom CSS classes. */
  class = input<string>('');

  /** Whether the checkbox is checked. Supports two-way binding. */
  checked = model(false);

  /** Whether the checkbox is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Whether the checkbox is in indeterminate state. Supports two-way binding. */
  indeterminate = model(false);

  ariaChecked = computed(() => {
    if (this.indeterminate()) return 'mixed';
    return this.checked();
  });

  dataState = computed(() => {
    if (this.indeterminate()) return 'indeterminate';
    return this.checked() ? 'checked' : 'unchecked';
  });

  hostClasses = computed(() =>
    cn(
      // Base structural classes
      'peer inline-flex shrink-0 items-center justify-center',
      'size-5',
      'rounded-[4px] border shadow-xs transition-shadow cursor-pointer outline-none',
      FOCUS_RING,
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      'aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
      // Default colors
      'border-input dark:bg-input/30',
      'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
      'data-[state=checked]:text-primary-foreground',
      this.class()
    )
  );

  /** @internal */
  iconClasses = computed(() => cn('size-3.5', 'sng-animate-check-scale-in'));

  toggle() {
    if (this.disabled()) return;
    if (this.indeterminate()) {
      this.indeterminate.set(false);
      this.checked.set(true);
    } else {
      this.checked.set(!this.checked());
    }
  }

  onDocumentClick(event: MouseEvent) {
    if (this.disabled()) return;

    const host = this.hostElementRef.nativeElement;
    const hostId = host.id;
    if (!hostId) return;

    const target = event.target;
    const label = target instanceof HTMLLabelElement
      ? target
      : target instanceof Element
        ? target.closest('label')
        : null;
    if (!(label instanceof HTMLLabelElement) || label.htmlFor !== hostId) return;

    if (event.cancelable) {
      event.preventDefault();
    }
    this.toggle();
    host.focus();
  }
}
