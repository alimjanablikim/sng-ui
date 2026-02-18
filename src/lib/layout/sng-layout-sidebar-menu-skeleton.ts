import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { cn } from './cn';
import { SngSkeleton } from '../skeleton/sng-skeleton';

const SKELETON_WIDTH_SEQUENCE = ['56%', '64%', '72%', '80%', '88%'] as const;
let nextSkeletonWidthIndex = 0;

function nextSkeletonWidth(): string {
  const width = SKELETON_WIDTH_SEQUENCE[nextSkeletonWidthIndex % SKELETON_WIDTH_SEQUENCE.length];
  nextSkeletonWidthIndex += 1;
  return width;
}

/**
 * Loading skeleton placeholder for sidebar menu items.
 * Displays animated placeholder content while actual menu items are loading.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-menu>
 *   @if (loading) {
 *     <sng-layout-sidebar-menu-skeleton [showIcon]="true" />
 *     <sng-layout-sidebar-menu-skeleton [showIcon]="true" />
 *     <sng-layout-sidebar-menu-skeleton />
 *   }
 * </sng-layout-sidebar-menu>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-menu-skeleton',
  standalone: true,
  imports: [SngSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showIcon()) {
      <sng-skeleton class="size-4 rounded-md" />
    }
    <sng-skeleton
      class="h-4 flex-1"
      [style.max-width]="skeletonWidth"
    />
  `,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarMenuSkeleton {
  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * Whether to show a skeleton icon placeholder.
   */
  showIcon = input(false, { transform: booleanAttribute });

  // Deterministic width sequence for stable rendering across runs.
  skeletonWidth = nextSkeletonWidth();

  hostClasses = computed(() =>
    cn(
      'flex h-8 items-center gap-2 rounded-md px-2',
      this.class()
    )
  );
}
