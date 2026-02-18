import { Component, input, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { cn } from './cn';

/** Heading level for card title. */
export type SngCardTitleLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Card title component for semantic heading elements.
 *
 * Renders a heading element within a card header.
 * Provides consistent typography styling.
 *
 * @example
 * ```html
 * <sng-card-title>Dashboard Overview</sng-card-title>
 * <sng-card-title level="h2">Section Title</sng-card-title>
 * ```
 */
@Component({
  selector: 'sng-card-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  template: `
    @switch (level()) {
      @case ('h1') { <h1 [class]="titleClasses()"><ng-content /></h1> }
      @case ('h2') { <h2 [class]="titleClasses()"><ng-content /></h2> }
      @case ('h4') { <h4 [class]="titleClasses()"><ng-content /></h4> }
      @case ('h5') { <h5 [class]="titleClasses()"><ng-content /></h5> }
      @case ('h6') { <h6 [class]="titleClasses()"><ng-content /></h6> }
      @default { <h3 [class]="titleClasses()"><ng-content /></h3> }
    }
  `,
})
export class SngCardTitle {
  /** Heading level. */
  level = input<SngCardTitleLevel>('h3');

  /** Custom CSS classes. */
  class = input<string>('');

  titleClasses = computed(() =>
    cn('!m-0 font-semibold leading-none tracking-tight', this.class())
  );
}
