import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  contentChildren,
  signal,
  effect,
  untracked,
  AfterContentInit,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { cn } from './cn';
import { SngResizablePanel } from './sng-resizable-panel';

export type ResizableDirection = 'horizontal' | 'vertical';

/**
 * A container component that manages a group of resizable panels.
 *
 * @example
 * ```html
 * <sng-resizable-group direction="horizontal" class="min-h-[200px] max-w-md rounded-lg border">
 *   <sng-resizable-panel [defaultSize]="50">
 *     <div class="flex h-full items-center justify-center p-6">One</div>
 *   </sng-resizable-panel>
 *   <sng-resizable-handle [withHandle]="true" />
 *   <sng-resizable-panel [defaultSize]="50">
 *     <div class="flex h-full items-center justify-center p-6">Two</div>
 *   </sng-resizable-panel>
 * </sng-resizable-group>
 * ```
 */
@Component({
  selector: 'sng-resizable-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-panel-group]': '"true"',
    '[attr.data-direction]': 'direction()',
  },
  template: `<ng-content />`,
})
export class SngResizableGroup implements AfterContentInit {
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private _lastPanelCount = 0;

  /** The direction in which the panels are laid out. */
  direction = input<ResizableDirection>('horizontal');

  /** Custom CSS classes. */
  class = input<string>('');

  /** @internal */
  _panels = contentChildren(SngResizablePanel);

  /** @internal */
  _panelSizes = signal<number[]>([]);

  hostClasses = computed(() =>
    cn(
      'flex h-full w-full',
      this.direction() === 'horizontal' ? 'flex-row' : 'flex-col',
      this.class()
    )
  );

  constructor() {
    // Re-initialize when panels are added or removed dynamically (e.g. via @if)
    effect(() => {
      const count = this._panels().length;
      if (this._lastPanelCount > 0 && count !== this._lastPanelCount) {
        this._lastPanelCount = count;
        untracked(() => this.initializePanelSizes());
      }
    });
  }

  ngAfterContentInit() {
    this._lastPanelCount = this._panels().length;
    this.initializePanelSizes();
  }

  /** @internal Returns the container size in pixels along the layout axis. */
  _getContainerSize(): number {
    const el = this.elementRef.nativeElement;
    return this.direction() === 'horizontal' ? el.offsetWidth : el.offsetHeight;
  }

  private initializePanelSizes() {
    const panelArray = this._panels();
    if (panelArray.length === 0) return;

    const sizes: number[] = [];
    let totalDefault = 0;
    let panelsWithoutDefault = 0;

    // First pass: collect default sizes
    panelArray.forEach((panel) => {
      const defaultSize = panel.defaultSize();
      if (defaultSize !== undefined) {
        sizes.push(defaultSize);
        totalDefault += defaultSize;
      } else {
        sizes.push(-1); // Mark for later
        panelsWithoutDefault++;
      }
    });

    // Second pass: distribute remaining space
    if (panelsWithoutDefault > 0) {
      const remainingSpace = 100 - totalDefault;
      const sizePerPanel = remainingSpace / panelsWithoutDefault;
      for (let i = 0; i < sizes.length; i++) {
        if (sizes[i] === -1) {
          sizes[i] = sizePerPanel;
        }
      }
    }

    this._panelSizes.set(sizes);

    panelArray.forEach((panel, index) => {
      panel._setSize(sizes[index]);
    });
  }

  /** @internal Called by handles to resize adjacent panels. */
  _resizePanel(panelIndex: number, delta: number) {
    if (!isPlatformBrowser(this.platformId)) return;

    const sizes = [...this._panelSizes()];
    const panelArray = this._panels();

    // Safety checks
    if (panelIndex < 0 || panelIndex >= panelArray.length - 1) return;
    if (sizes.length !== panelArray.length) return;

    const currentPanel = panelArray[panelIndex];
    const nextPanel = panelArray[panelIndex + 1];
    if (!currentPanel || !nextPanel) return;

    const containerSize = this._getContainerSize();

    // Convert pixel delta to percentage
    const deltaPercent = (delta / containerSize) * 100;

    const currentMin = currentPanel.minSize() ?? 0;
    const currentMax = currentPanel.maxSize() ?? 100;
    const nextMin = nextPanel.minSize() ?? 0;
    const nextMax = nextPanel.maxSize() ?? 100;

    // Calculate new sizes
    let newCurrentSize = sizes[panelIndex] + deltaPercent;
    let newNextSize = sizes[panelIndex + 1] - deltaPercent;

    // Apply constraints
    if (newCurrentSize < currentMin) {
      newCurrentSize = currentMin;
      newNextSize = sizes[panelIndex] + sizes[panelIndex + 1] - currentMin;
    } else if (newCurrentSize > currentMax) {
      newCurrentSize = currentMax;
      newNextSize = sizes[panelIndex] + sizes[panelIndex + 1] - currentMax;
    }

    if (newNextSize < nextMin) {
      newNextSize = nextMin;
      newCurrentSize = sizes[panelIndex] + sizes[panelIndex + 1] - nextMin;
    } else if (newNextSize > nextMax) {
      newNextSize = nextMax;
      newCurrentSize = sizes[panelIndex] + sizes[panelIndex + 1] - nextMax;
    }

    sizes[panelIndex] = newCurrentSize;
    sizes[panelIndex + 1] = newNextSize;

    this._panelSizes.set(sizes);

    // Update panels
    currentPanel._setSize(newCurrentSize);
    nextPanel._setSize(newNextSize);
  }
}
