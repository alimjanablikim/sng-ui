import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, computed } from '@angular/core';
import { cn } from './cn';

/** Badge displays a compact inline status label. */
@Component({
  selector: 'sng-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-badge > svg {
      width: 0.75rem;
      height: 0.75rem;
      pointer-events: none;
      flex-shrink: 0;
    }
  `],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngBadge {
  /** Custom Tailwind classes merged last so user styles win. */
  class = input<string>('');

  /** @internal */
  hostClasses = computed(() =>
    cn(
      'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium',
      'w-fit whitespace-nowrap shrink-0 gap-1 select-none',
      'border-transparent bg-primary text-primary-foreground',
      this.class()
    )
  );
}
