import {
  Component,
  computed,
  input,
  model,
  booleanAttribute,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  viewChild,
  ElementRef,
  afterNextRender,
  effect,
} from '@angular/core';
import { cn } from './cn';

/** Standard input types. */
export type SngInputType =
  | 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  | 'date' | 'time' | 'datetime-local';

/**
 * Standard input component for text, email, password, number, and other basic input types.
 *
 * @example
 * ```html
 * <sng-input placeholder="Enter your email" type="email" />
 * <sng-input type="password" [(value)]="password" />
 * ```
 */
@Component({
  selector: 'sng-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
    '[attr.id]': 'null',
    '[attr.name]': 'null',
  },
  template: `
    <input
      #inputRef
      [type]="type()"
      [attr.id]="id()"
      [attr.name]="name()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [required]="required()"
      [attr.min]="min()"
      [attr.max]="max()"
      [attr.minlength]="minlength()"
      [attr.maxlength]="maxlength()"
      [attr.pattern]="pattern()"
      [attr.step]="step()"
      [attr.autocomplete]="autocomplete()"
      [value]="value()"
      [class]="inputClasses()"
      (input)="onInput($event)"
    />
  `,
})
export class SngInput {
  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');
  private hasAppliedAutofocus = false;

  /** Input type. */
  type = input<SngInputType>('text');

  /** Input id attribute. */
  id = input<string>();

  /** Input name attribute. */
  name = input<string>();

  /** Placeholder text. */
  placeholder = input<string>('');

  /** Whether the input is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Whether the input is readonly. */
  readonly = input(false, { transform: booleanAttribute });

  /** Whether the input is required. */
  required = input(false, { transform: booleanAttribute });

  /** Custom CSS classes. */
  class = input<string>('');

  /** Current value. Supports two-way binding via [(value)]. */
  value = model<string | number>('');

  /** Minimum value (for number/date inputs). */
  min = input<string | number>();

  /** Maximum value (for number/date inputs). */
  max = input<string | number>();

  /** Minimum length. */
  minlength = input<number>();

  /** Maximum length. */
  maxlength = input<number>();

  /** Pattern for validation. */
  pattern = input<string>();

  /** Step value (for number inputs). */
  step = input<string | number>();

  /** Autocomplete attribute. */
  autocomplete = input<string>();

  /** Whether to autofocus. */
  autofocus = input(false, { transform: booleanAttribute });

  constructor() {
    effect(() => {
      if (!this.autofocus() || this.hasAppliedAutofocus) {
        return;
      }
      afterNextRender(() => {
        this.inputRef()?.nativeElement.focus();
        this.hasAppliedAutofocus = true;
      });
    });
  }

  /** @internal */
  inputClasses = computed(() =>
    cn(
      'flex w-full min-w-0 rounded-md border border-input bg-transparent',
      'h-9 text-sm px-3 py-1',
      'shadow-xs transition-[color,box-shadow] outline-none',
      'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      'dark:bg-input/30',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      this.class()
    )
  );

  /** @internal */
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
  }

  /** Focus the input element. */
  focus(): void {
    this.inputRef()?.nativeElement.focus();
  }

  /** Blur the input element. */
  blur(): void {
    this.inputRef()?.nativeElement.blur();
  }
}
