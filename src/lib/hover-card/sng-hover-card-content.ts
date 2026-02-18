import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  TemplateRef,
  ViewContainerRef,
  inject,
  viewChild,
  input,
  computed,
} from '@angular/core';
import type { SngHoverCard } from './sng-hover-card';
import { cn } from './cn';

/**
 * Component that renders the hover card content panel.
 * Must be used inside a SngHoverCard container.
 *
 * @example
 * ```html
 * <sng-hover-card>
 *   <sng-hover-card-trigger href="#">@user</sng-hover-card-trigger>
 *   <sng-hover-card-content class="w-80">
 *     <div class="flex gap-4">
 *       <img src="avatar.jpg" alt="Avatar" />
 *       <div>
 *         <h4>User Name</h4>
 *         <p>User bio here</p>
 *       </div>
 *     </div>
 *   </sng-hover-card-content>
 * </sng-hover-card>
 * ```
 */
@Component({
  selector: 'sng-hover-card-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .sng-hover-card-content[data-state=open][data-side=bottom] { animation: sng-hover-card-enter-bottom 150ms ease both; }
    .sng-hover-card-content[data-state=open][data-side=top] { animation: sng-hover-card-enter-top 150ms ease both; }
    .sng-hover-card-content[data-state=open][data-side=left] { animation: sng-hover-card-enter-left 150ms ease both; }
    .sng-hover-card-content[data-state=open][data-side=right] { animation: sng-hover-card-enter-right 150ms ease both; }
    .sng-hover-card-content[data-state=closed] { animation: sng-hover-card-exit 150ms ease both; }
    @keyframes sng-hover-card-enter-bottom { from { opacity: 0; transform: scale(0.95) translateY(-0.5rem); } }
    @keyframes sng-hover-card-enter-top { from { opacity: 0; transform: scale(0.95) translateY(0.5rem); } }
    @keyframes sng-hover-card-enter-left { from { opacity: 0; transform: scale(0.95) translateX(0.5rem); } }
    @keyframes sng-hover-card-enter-right { from { opacity: 0; transform: scale(0.95) translateX(-0.5rem); } }
    @keyframes sng-hover-card-exit { to { opacity: 0; transform: scale(0.95); } }
  `],
  host: {},
  template: `
    <ng-template #content>
      <div
        class="sng-hover-card-content"
        [class]="hostClasses()"
        data-state="open"
        [attr.data-side]="dataSide()"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class SngHoverCardContent {
  /**
   * Custom CSS classes for the hover card content panel.
   */
  class = input<string>('');

  // Assigned by parent
  hoverCard: SngHoverCard | null = null;

  private contentTemplate = viewChild.required<TemplateRef<unknown>>('content');
  viewContainerRef = inject(ViewContainerRef);

  dataSide = computed(() => this.hoverCard?.side() ?? 'bottom');

  hostClasses = computed(() =>
    cn(
      'z-50 w-64 rounded-md border border-border bg-popover text-popover-foreground p-4 shadow-md outline-none',
      this.class()
    )
  );

  get templateRef(): TemplateRef<unknown> {
    return this.contentTemplate();
  }

  onMouseEnter() {
    this.hoverCard?.onContentEnter();
  }

  onMouseLeave() {
    this.hoverCard?.onContentLeave();
  }
}
