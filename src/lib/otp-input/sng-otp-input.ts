import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
  output,
  signal,
  computed,
  viewChild,
  ElementRef,
  AfterViewInit,
  inject,
  forwardRef,
  PLATFORM_ID,
  booleanAttribute,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { cn } from './cn';
import {
  SNG_OTP_INPUT_CONTEXT,
  OTP_CONTEXT_KEY,
  type OtpSlotState,
  type SngOtpInputContext,
} from './sng-otp-input-tokens';

/** Regex pattern for digits only (0-9). */
export const REGEXP_ONLY_DIGITS = /^\d+$/;
/** Regex pattern for letters only (a-zA-Z). */
export const REGEXP_ONLY_CHARS = /^[a-zA-Z]+$/;
/** Regex pattern for alphanumeric characters. */
export const REGEXP_ONLY_DIGITS_AND_CHARS = /^[a-zA-Z0-9]+$/;

/**
 * OTP (One-Time Password) input component with individual character slots.
 *
 * @example Basic 6-digit OTP
 * ```html
 * <sng-otp-input [(value)]="otpCode" [maxLength]="6">
 *   <sng-otp-input-group>
 *     <sng-otp-input-slot [index]="0" />
 *     <sng-otp-input-slot [index]="1" />
 *     <sng-otp-input-slot [index]="2" />
 *     <sng-otp-input-slot [index]="3" />
 *     <sng-otp-input-slot [index]="4" />
 *     <sng-otp-input-slot [index]="5" />
 *   </sng-otp-input-group>
 * </sng-otp-input>
 * ```
 *
 * @example With separator (3-3 pattern)
 * ```html
 * <sng-otp-input [(value)]="otpCode" [maxLength]="6" (complete)="onVerify($event)">
 *   <sng-otp-input-group>
 *     <sng-otp-input-slot [index]="0" />
 *     <sng-otp-input-slot [index]="1" />
 *     <sng-otp-input-slot [index]="2" />
 *   </sng-otp-input-group>
 *   <sng-otp-input-separator />
 *   <sng-otp-input-group>
 *     <sng-otp-input-slot [index]="3" />
 *     <sng-otp-input-slot [index]="4" />
 *     <sng-otp-input-slot [index]="5" />
 *   </sng-otp-input-group>
 * </sng-otp-input>
 * ```
 */
@Component({
  selector: 'sng-otp-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SNG_OTP_INPUT_CONTEXT,
      useExisting: forwardRef(() => SngOtpInput),
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '(paste)': 'onPaste($event)',
  },
  template: `
    <input
      #inputRef
      type="text"
      [attr.name]="name()"
      [attr.inputmode]="inputMode()"
      [attr.autocomplete]="autoComplete()"
      [attr.maxlength]="maxLength()"
      [value]="value()"
      [disabled]="disabled()"
      class="absolute inset-0 w-full h-full opacity-0 cursor-default"
      (input)="onInput($event)"
      (focus)="onFocus()"
      (blur)="onBlur()"
    />
    <ng-content select="sng-otp-input-group, sng-otp-input-slot, sng-otp-input-separator" />
  `,
})
export class SngOtpInput implements AfterViewInit, SngOtpInputContext {
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  // =============================================================================
  // Inputs
  // =============================================================================

  /** Whether the input is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Number of OTP digits/characters. */
  maxLength = input<number>(6);

  /**
   * Regex pattern to validate OTP input characters.
   */
  pattern = input<RegExp>(REGEXP_ONLY_DIGITS);

  /**
   * Autocomplete attribute for OTP browser autofill.
   */
  autoComplete = input<string>('one-time-code');

  /** Input name attribute for form submission. */
  name = input<string>();

  /** Custom CSS classes. */
  class = input<string>('');

  // =============================================================================
  // State
  // =============================================================================

  /** Current OTP value. Supports two-way binding via [(value)]. */
  value = model<string>('');

  /** @internal */
  private _focusedIndex = signal(-1);
  /** @internal */
  private _isFocused = signal(false);

  // =============================================================================
  // Outputs
  // =============================================================================

  /** Emitted when all OTP slots are filled. */
  complete = output<string>();

  // =============================================================================
  // Computed
  // =============================================================================

  hostClasses = computed(() =>
    cn(
      'relative flex items-center gap-2',
      'has-[:disabled]:opacity-50',
      this.class()
    )
  );

  inputMode = computed(() => {
    const p = this.pattern();
    if (p === REGEXP_ONLY_DIGITS) return 'numeric';
    return 'text';
  });

  /** OTP slot states for child components. */
  slots = computed<OtpSlotState[]>(() => {
    const val = this.value();
    const focused = this._focusedIndex();
    const max = this.maxLength();
    const isFocused = this._isFocused();

    return Array.from({ length: max }, (_, i) => ({
      char: val[i] || '',
      isActive: isFocused && i === focused,
      hasFakeCaret: isFocused && i === focused && !val[i],
    }));
  });

  // =============================================================================
  // Lifecycle
  // =============================================================================

  ngAfterViewInit(): void {
    this._focusedIndex.set(0);
    // Store context on element for content-projected slots to find
    (this.elementRef.nativeElement as Record<string, unknown>)[OTP_CONTEXT_KEY] = this;
  }

  // =============================================================================
  // Public Methods
  // =============================================================================

  /** Focus a specific slot by index. */
  focus(index?: number): void {
    const max = this.maxLength();
    const clampedIndex = Math.max(0, Math.min(index ?? 0, max - 1));
    this._focusedIndex.set(clampedIndex);

    const input = this.inputRef()?.nativeElement;
    if (input && isPlatformBrowser(this.platformId)) {
      input.focus();
    }
  }

  /** Blur the input. */
  blur(): void {
    this.inputRef()?.nativeElement.blur();
  }

  /** Set OTP value programmatically. */
  setValue(newValue: string): void {
    const pat = this.pattern();
    const filtered = newValue.split('').filter(char => pat.test(char)).join('');
    const max = this.maxLength();
    const truncated = filtered.slice(0, max);

    this.value.set(truncated);

    if (truncated.length === max) {
      this.complete.emit(truncated);
    }
  }

  /** Clear OTP value. */
  clear(): void {
    this.value.set('');
    this._focusedIndex.set(0);
  }

  // =============================================================================
  // Event Handlers
  // =============================================================================

  /** @internal */
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    const pat = this.pattern();

    // Filter by pattern
    const filtered = newValue.split('').filter(char => pat.test(char)).join('');
    const max = this.maxLength();
    const truncated = filtered.slice(0, max);

    this.value.set(truncated);

    // Move focus to next empty slot or last slot
    const nextIndex = Math.min(truncated.length, max - 1);
    this._focusedIndex.set(nextIndex);

    if (truncated.length === max) {
      this.complete.emit(truncated);
    }

    // Sync hidden input value
    input.value = truncated;
  }

  /** @internal */
  onFocus(): void {
    this._isFocused.set(true);
    const val = this.value();
    // Focus on first empty slot or last character
    this._focusedIndex.set(Math.min(val.length, this.maxLength() - 1));
  }

  /** @internal */
  onBlur(): void {
    this._isFocused.set(false);
    this._focusedIndex.set(-1);
  }

  /** @internal */
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    if (this.disabled()) return;

    const paste = event.clipboardData?.getData('text') || '';
    const pat = this.pattern();
    const filtered = paste.split('').filter(char => pat.test(char)).join('');
    const max = this.maxLength();
    const truncated = filtered.slice(0, max);

    this.value.set(truncated);
    this._focusedIndex.set(Math.min(truncated.length, max - 1));

    if (truncated.length === max) {
      this.complete.emit(truncated);
    }

    // Sync hidden input
    const input = this.inputRef()?.nativeElement;
    if (input) {
      input.value = truncated;
    }
  }
}
