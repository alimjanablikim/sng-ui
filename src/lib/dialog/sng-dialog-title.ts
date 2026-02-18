import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/** Heading level for dialog title. */
export type SngDialogTitleLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Title component for dialog content.
 * Renders a heading element to provide consistent dialog title styling.
 *
 * @example
 * ```html
 * <sng-dialog-title>Edit Profile</sng-dialog-title>
 * <sng-dialog-title level="h3">Settings</sng-dialog-title>
 * ```
 */
@Component({
  selector: 'sng-dialog-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  template: `
    @switch (level()) {
      @case ('h1') { <h1 [class]="titleClasses()"><ng-content /></h1> }
      @case ('h3') { <h3 [class]="titleClasses()"><ng-content /></h3> }
      @case ('h4') { <h4 [class]="titleClasses()"><ng-content /></h4> }
      @case ('h5') { <h5 [class]="titleClasses()"><ng-content /></h5> }
      @case ('h6') { <h6 [class]="titleClasses()"><ng-content /></h6> }
      @default { <h2 [class]="titleClasses()"><ng-content /></h2> }
    }
  `,
})
export class SngDialogTitle {
  /** Heading level. */
  level = input<SngDialogTitleLevel>('h2');

  /** Custom CSS classes. */
  class = input<string>('');

  titleClasses = computed(() =>
    cn('text-lg leading-none font-semibold', this.class())
  );
}
