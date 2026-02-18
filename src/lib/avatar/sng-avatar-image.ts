import {
  input,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Component,
} from '@angular/core';
import { cn } from './cn';

/**
 * Avatar image with automatic load/error state management.
 * Hidden until image loads successfully.
 *
 * @publicApi
 */
@Component({
  selector: 'sng-avatar-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '[style.display]': 'loaded() ? null : "none"',
  },
  template: `
    <img
      [src]="src()"
      [alt]="alt()"
      class="aspect-square size-full"
      (load)="onLoad()"
      (error)="onError()"
    />
  `,
})
export class SngAvatarImage {
  /** Image source URL. Required. */
  src = input.required<string>();

  /** Alt text for accessibility. */
  alt = input<string>('');

  /**
   * Custom classes for image styling.
   *
   * Object fit: object-cover (default via aspect-square), object-contain
   */
  class = input<string>('');

  loaded = signal(false);
  error = signal(false);

  private readonly resetStateOnSrcChange = effect(() => {
    this.src();
    this.loaded.set(false);
    this.error.set(false);
  });

  hostClasses = computed(() =>
    cn('aspect-square size-full', this.class())
  );

  onLoad() {
    this.loaded.set(true);
    this.error.set(false);
  }

  onError() {
    this.loaded.set(false);
    this.error.set(true);
  }
}
