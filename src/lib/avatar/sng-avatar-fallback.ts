import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { SngAvatar } from './sng-avatar';
import { cn } from './cn';

/**
 * Fallback content shown when avatar image is loading or failed.
 * Typically displays initials or an icon.
 *
 * @publicApi
 */
@Component({
  selector: 'sng-avatar-fallback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.display]': 'shouldShow() ? "flex" : "none"',
  },
  template: `<ng-content />`,
})
export class SngAvatarFallback {
  /**
   * Custom classes for fallback styling.
   *
   * Background: bg-muted (default), bg-primary, bg-destructive
   * Text: text-muted-foreground (default), text-primary-foreground
   * Font size: text-xs, text-sm (default), text-lg for different avatar sizes
   */
  class = input<string>('');

  private avatar = inject(SngAvatar, { optional: true });

  shouldShow = computed(() => {
    if (!this.avatar) return true;
    return !this.avatar.imageLoaded();
  });

  hostClasses = computed(() =>
    cn(
      'flex size-full items-center justify-center rounded-full bg-muted select-none',
      this.class()
    )
  );
}
