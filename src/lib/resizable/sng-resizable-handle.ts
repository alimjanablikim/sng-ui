import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  inject,
  ElementRef,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
  signal,
  booleanAttribute,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { cn } from './cn';
import { SngResizableGroup } from './sng-resizable-group';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1';

/**
 * A draggable handle for resizing adjacent panels within a resizable group.
 * Supports mouse and touch interactions.
 *
 * @example
 * ```html
 * <sng-resizable-group direction="horizontal" class="min-h-[200px] rounded-lg border">
 *   <sng-resizable-panel [defaultSize]="50">Left panel</sng-resizable-panel>
 *   <sng-resizable-handle [withHandle]="true" />
 *   <sng-resizable-panel [defaultSize]="50">Right panel</sng-resizable-panel>
 * </sng-resizable-group>
 * ```
 */
@Component({
  selector: 'sng-resizable-handle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-panel-resize-handle]': '"true"',
    '[attr.data-direction]': 'direction()',
    '[attr.data-dragging]': 'isDragging()',
    '[attr.tabindex]': '"0"',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'direction() === "horizontal" ? "vertical" : "horizontal"',
    '[attr.aria-valuenow]': '_ariaValueNow()',
    '[attr.aria-valuemin]': '_ariaValueMin()',
    '[attr.aria-valuemax]': '_ariaValueMax()',
    '(mousedown)': 'onMouseDown($event)',
    '(touchstart)': 'onTouchStart($event)',
  },
  template: `
    @if (withHandle()) {
      <div [class]="gripClasses()">
        @if (direction() === 'horizontal') {
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>
          </svg>
        } @else {
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="9" r="1"/><circle cx="5" cy="9" r="1"/><circle cx="19" cy="9" r="1"/>
            <circle cx="12" cy="15" r="1"/><circle cx="5" cy="15" r="1"/><circle cx="19" cy="15" r="1"/>
          </svg>
        }
      </div>
    }
  `,
})
export class SngResizableHandle implements OnInit, OnDestroy {
  private group = inject(SngResizableGroup, { optional: true });
  private elementRef = inject(ElementRef);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  /** Whether to display a visible grip icon on the handle. */
  withHandle = input(false, { transform: booleanAttribute });

  /** Custom CSS classes. */
  class = input<string>('');

  isDragging = signal(false);

  private _panelIndex = signal(0);
  private startPosition = 0;

  direction = computed(() => this.group?.direction() ?? 'horizontal');

  /** @internal */
  _ariaValueNow = computed(() => {
    if (!this.group) return 0;
    const sizes = this.group._panelSizes();
    const index = this._panelIndex();
    return Math.round(sizes[index] ?? 0);
  });

  /** @internal */
  _ariaValueMin = computed(() => {
    if (!this.group) return 0;
    const panels = this.group._panels();
    const index = this._panelIndex();
    return panels[index]?.minSize() ?? 0;
  });

  /** @internal */
  _ariaValueMax = computed(() => {
    if (!this.group) return 100;
    const panels = this.group._panels();
    const index = this._panelIndex();
    return panels[index]?.maxSize() ?? 100;
  });

  hostClasses = computed(() =>
    cn(
      'relative flex items-center justify-center bg-border',
      FOCUS_RING,
      this.direction() === 'horizontal'
        ? 'h-full w-px cursor-col-resize after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2'
        : 'h-px w-full cursor-row-resize after:absolute after:inset-x-0 after:top-1/2 after:h-1 after:-translate-y-1/2',
      'data-[dragging=true]:bg-primary',
      this.class()
    )
  );

  gripClasses = computed(() =>
    cn(
      'z-10 flex items-center justify-center rounded-sm border bg-border',
      this.direction() === 'horizontal' ? 'h-4 w-3' : 'h-3 w-4'
    )
  );

  ngOnInit() {
    this._calculatePanelIndex();
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  private _calculatePanelIndex() {
    if (!this.group || !isPlatformBrowser(this.platformId)) return;

    const element = this.elementRef.nativeElement;
    const parent = element.parentElement;
    if (!parent) return;

    // Count panels before this handle
    const children = Array.from(parent.children) as Element[];
    let panelCount = 0;
    for (const child of children) {
      if (child === element) break;
      if (child.hasAttribute('data-panel')) {
        panelCount++;
      }
    }
    // panelIndex is the index of the panel to the LEFT/TOP of this handle
    this._panelIndex.set(Math.max(0, panelCount - 1));
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.startDrag(event.clientX, event.clientY);

    if (isPlatformBrowser(this.platformId)) {
      this.document.addEventListener('mousemove', this.onMouseMove);
      this.document.addEventListener('mouseup', this.onMouseUp);
    }
  }

  onTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    this.startDrag(touch.clientX, touch.clientY);

    if (isPlatformBrowser(this.platformId)) {
      this.document.addEventListener('touchmove', this.onTouchMove, { passive: false });
      this.document.addEventListener('touchend', this.onTouchEnd);
    }
  }

  private startDrag(clientX: number, clientY: number) {
    this.isDragging.set(true);
    this._calculatePanelIndex();
    this.startPosition =
      this.direction() === 'horizontal' ? clientX : clientY;
  }

  private onMouseMove = (event: MouseEvent) => {
    this.handleMove(event.clientX, event.clientY);
  };

  private onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    this.handleMove(touch.clientX, touch.clientY);
  };

  private handleMove(clientX: number, clientY: number) {
    const currentPosition =
      this.direction() === 'horizontal' ? clientX : clientY;
    const delta = currentPosition - this.startPosition;
    this.startPosition = currentPosition;

    if (this.group && delta !== 0) {
      this.group._resizePanel(this._panelIndex(), delta);
    }
  }

  private onMouseUp = () => {
    this.endDrag();
    this.document.removeEventListener('mousemove', this.onMouseMove);
    this.document.removeEventListener('mouseup', this.onMouseUp);
  };

  private onTouchEnd = () => {
    this.endDrag();
    this.document.removeEventListener('touchmove', this.onTouchMove);
    this.document.removeEventListener('touchend', this.onTouchEnd);
  };

  private endDrag() {
    this.isDragging.set(false);
  }

  private removeListeners() {
    if (isPlatformBrowser(this.platformId)) {
      this.document.removeEventListener('mousemove', this.onMouseMove);
      this.document.removeEventListener('mouseup', this.onMouseUp);
      this.document.removeEventListener('touchmove', this.onTouchMove);
      this.document.removeEventListener('touchend', this.onTouchEnd);
    }
  }

}
