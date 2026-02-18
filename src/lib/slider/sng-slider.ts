import {
  Component,
  input,
  model,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  numberAttribute,
  booleanAttribute,
} from '@angular/core';
import { cn } from './cn';

/**
 * A slider component for selecting numeric values within a range.
 * Uses Angular's model() for two-way binding, compatible with Signal Forms.
 * Supports horizontal and vertical orientations.
 *
 * @example
 * ```html
 * <sng-slider [(value)]="volume" [min]="0" [max]="100" />
 * <sng-slider orientation="vertical" [step]="10" />
 * ```
 */
@Component({
  selector: 'sng-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <input
      type="range"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [value]="value()"
      [disabled]="disabled()"
      [attr.aria-orientation]="orientation()"
      [style.writing-mode]="orientation() === 'vertical' ? 'vertical-lr' : null"
      [style.direction]="orientation() === 'vertical' ? 'rtl' : null"
      (input)="onInput($event)"
      [class]="inputClasses()"
    />
  `,
  styles: [`
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      background: var(--secondary);
      border-radius: 9999px;
      cursor: pointer;
    }
    input[type="range"]:disabled {
      pointer-events: none;
      opacity: 0.5;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      height: var(--thumb-size, 1rem);
      width: var(--thumb-size, 1rem);
      border-radius: 9999px;
      background: var(--primary);
      border: 2px solid var(--primary);
      cursor: pointer;
      transition: transform 0.15s;
    }
    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
    }
    input[type="range"]:focus-visible {
      outline: none;
    }
    input[type="range"]:focus-visible::-webkit-slider-thumb {
      box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);
    }
    input[type="range"]::-moz-range-thumb {
      height: var(--thumb-size, 1rem);
      width: var(--thumb-size, 1rem);
      border-radius: 9999px;
      background: var(--primary);
      border: 2px solid var(--primary);
      cursor: pointer;
      transition: transform 0.15s;
    }
    input[type="range"]::-moz-range-thumb:hover {
      transform: scale(1.1);
    }
    input[type="range"]:focus-visible::-moz-range-thumb {
      box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);
    }
  `],
})
export class SngSlider {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Orientation of the slider track. */
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  /** Minimum value. */
  min = input(0, { transform: numberAttribute });

  /** Maximum value. */
  max = input(100, { transform: numberAttribute });

  /** Step increment. */
  step = input(1, { transform: numberAttribute });

  /** Current value. Supports two-way binding. */
  value = model(0);

  /** Whether the slider is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  hostClasses = computed(() =>
    cn(
      'relative flex w-full touch-none select-none items-center justify-center',
      this.orientation() === 'vertical' && 'vertical'
    )
  );

  inputClasses = computed(() =>
    cn(
      'block',
      this.orientation() === 'vertical' ? 'h-full w-1.5' : 'h-1.5 w-full',
      this.class()
    )
  );

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(Number(target.value));
  }
}
