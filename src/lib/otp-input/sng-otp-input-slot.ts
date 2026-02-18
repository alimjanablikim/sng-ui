import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  inject,
  signal,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { cn } from './cn';
import { SNG_OTP_INPUT_CONTEXT, OTP_CONTEXT_KEY, type SngOtpInputContext } from './sng-otp-input-tokens';

/**
 * Individual character slot within an OTP input.
 * Must be used inside a sng-otp-input.
 *
 * @example
 * ```html
 * <sng-otp-input-slot [index]="0" />
 * <sng-otp-input-slot [index]="1" class="border-primary" />
 * ```
 */
@Component({
  selector: 'sng-otp-input-slot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-active]': 'isActive()',
    '(click)': 'onClick()',
  },
  template: `
    {{ char() }}
    @if (hasFakeCaret()) {
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="h-4 w-px bg-foreground"></div>
      </div>
    }
  `,
})
export class SngOtpInputSlot implements AfterViewInit {
  private elementRef = inject(ElementRef);

  // Try DI first (works in normal usage), fall back to manual context (for content projection)
  private injectedContext = inject(SNG_OTP_INPUT_CONTEXT, { optional: true });
  private _manualContext = signal<SngOtpInputContext | null>(null);

  private context = computed(() => this.injectedContext || this._manualContext());

  ngAfterViewInit(): void {
    // If DI didn't provide context, find parent through DOM
    if (!this.injectedContext) {
      this.findAndSetParentContext();
    }
  }

  /**
   * @internal
   * Walk up the DOM to find the parent sng-otp-input and get its context.
   * This is needed for content projection scenarios (like Storybook) where DI doesn't work.
   */
  private findAndSetParentContext(): void {
    let el: HTMLElement | null = this.elementRef.nativeElement.parentElement;
    while (el) {
      if (el.tagName.toLowerCase() === 'sng-otp-input') {
        // Get the context stored on the element by SngOtpInput
        const context = (el as unknown as Record<string, SngOtpInputContext | undefined>)[OTP_CONTEXT_KEY];
        if (context) {
          this._manualContext.set(context);
        }
        break;
      }
      el = el.parentElement;
    }
  }

  /**
   * Zero-based index of this slot within the OTP input.
   */
  index = input.required<number>();

  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * @internal
   * Called by parent SngOtpInput to provide context when DI doesn't work (content projection).
   */
  _setContext(context: SngOtpInputContext): void {
    this._manualContext.set(context);
  }

  private slotState = computed(() => {
    const ctx = this.context();
    if (!ctx) return { char: '', isActive: false, hasFakeCaret: false };
    const slots = ctx.slots();
    const idx = this.index();
    return slots[idx] || { char: '', isActive: false, hasFakeCaret: false };
  });

  char = computed(() => this.slotState().char);
  isActive = computed(() => this.slotState().isActive);
  hasFakeCaret = computed(() => this.slotState().hasFakeCaret);

  hostClasses = computed(() =>
    cn(
      'border-input relative flex h-9 w-9 items-center justify-center',
      'border-y border-r text-sm shadow-xs transition-colors outline-none',
      'first:rounded-l-md first:border-l last:rounded-r-md',
      'dark:bg-input/30',
      // Match standard input focus ring: ring-1 ring-ring
      'data-[active=true]:border-ring data-[active=true]:ring-1 data-[active=true]:ring-ring data-[active=true]:z-10',
      'aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive',
      'data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40',
      this.class()
    )
  );

  onClick() {
    const ctx = this.context();
    if (ctx) {
      ctx.focus(this.index());
    }
  }
}
