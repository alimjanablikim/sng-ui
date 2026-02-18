import {
  Component,
  model,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  AfterViewInit,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { cn } from './cn';

const FOCUS_RING = 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

/**
 * A toggle switch component for binary on/off states.
 * Uses Angular's model() for two-way binding, compatible with Signal Forms.
 *
 * @example
 * ```html
 * <sng-switch [(checked)]="darkMode" />
 * ```
 */
@Component({
  selector: 'sng-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'toggle()',
    '[attr.role]': '"switch"',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledby() || null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
  },
  template: `
    <span
      [class]="thumbClasses()"
    ></span>
  `,
})
export class SngSwitch implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly direction = signal<'ltr' | 'rtl'>(this.getDirection());

  /** Custom CSS classes. */
  class = input<string>('');

  /** Whether the switch is checked/on. Supports two-way binding. */
  checked = model(false);

  /** Whether the switch is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Accessible label text when no visible label is associated. */
  ariaLabel = input<string>('');

  /** Element id reference for accessible label text. */
  ariaLabelledby = input<string>('');

  hostClasses = computed(() =>
    cn(
      'peer inline-flex shrink-0 cursor-pointer items-center rounded-full',
      'h-5 w-9',
      'border-2 border-transparent shadow-xs transition-colors outline-none',
      FOCUS_RING,
      'aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80',
      this.class()
    )
  );

  thumbClasses = computed(() =>
    cn(
      'pointer-events-none block rounded-full bg-background shadow-sm ring-0',
      'h-full aspect-square',
      'transition-transform duration-150',
      this.thumbTranslateClass()
    )
  );

  ngAfterViewInit() {
    this.syncDirection();
    this.observeDirectionChanges();
  }

  toggle() {
    if (this.disabled()) return;
    this.checked.set(!this.checked());
  }

  private thumbTranslateClass(): string {
    if (this.direction() === 'rtl') {
      return this.checked() ? '-translate-x-full' : 'translate-x-0';
    }
    return this.checked() ? 'translate-x-full' : 'translate-x-0';
  }

  private observeDirectionChanges(): void {
    const observer = new MutationObserver(() => this.syncDirection());
    let currentElement: HTMLElement | null = this.elementRef.nativeElement;

    while (currentElement) {
      observer.observe(currentElement, {
        attributes: true,
        attributeFilter: ['dir'],
      });
      currentElement = currentElement.parentElement;
    }

    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private syncDirection(): void {
    const nextDirection = this.getDirection();
    if (nextDirection !== this.direction()) {
      this.direction.set(nextDirection);
    }
  }

  private getDirection(): 'ltr' | 'rtl' {
    const closestDirectionElement = this.elementRef.nativeElement.closest('[dir]');
    const directionAttribute = closestDirectionElement?.getAttribute('dir') ?? this.document.documentElement.getAttribute('dir');
    return directionAttribute === 'rtl' ? 'rtl' : 'ltr';
  }
}
