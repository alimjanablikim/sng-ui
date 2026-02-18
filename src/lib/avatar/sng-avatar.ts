import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  contentChild,
} from '@angular/core';
import { SngAvatarImage } from './sng-avatar-image';
import { cn } from './cn';

/**
 * Avatar displays a user image with fallback for missing/loading states.
 *
 * @example
 * ```html
 * <sng-avatar>
 *   <sng-avatar-image src="user.jpg" alt="User" />
 *   <sng-avatar-fallback>JD</sng-avatar-fallback>
 * </sng-avatar>
 *
 * <!-- Custom size via class -->
 * <sng-avatar class="size-16">
 *   <sng-avatar-image src="user.jpg" alt="User" />
 *   <sng-avatar-fallback>AB</sng-avatar-fallback>
 * </sng-avatar>
 * ```
 *
 * @publicApi
 */
@Component({
  selector: 'sng-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngAvatar {
  /**
   * Custom classes for sizing and styling.
   *
   * Sizing: size-6 (24px), size-8 (32px), size-10 (40px default), size-12 (48px), size-16 (64px)
   * Shape: rounded-full (default), rounded-lg for square corners
   * Border: border-2 border-background for avatar groups
   */
  class = input<string>('');

  private imageChild = contentChild(SngAvatarImage);

  imageLoaded = computed(() => this.imageChild()?.loaded() ?? false);

  hostClasses = computed(() =>
    cn(
      'relative flex shrink-0 overflow-hidden rounded-full',
      'size-10 text-base',
      this.class()
    )
  );
}
