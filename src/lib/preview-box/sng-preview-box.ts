import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  ElementRef,
  viewChildren,
  AfterViewInit,
  effect,
  inject,
  Injector,
  contentChild,
  TemplateRef,
  computed,
  input,
  afterNextRender,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { SngHtmlBlock } from './sng-html-block';
import { SngCodeBlock } from '../code-block/sng-code-block';
import { SngPreviewCodeBlock } from './sng-code-block';
import { SngStyleBlock } from './sng-style-block';
import { cn } from './cn';

type TabType = 'preview' | 'html' | 'code' | 'style';

/**
 * ShadNG Preview Box - Component showcase with code examples.
 *
 * A tabbed container for displaying live component previews alongside their
 * HTML, TypeScript, and CSS code. Supports fullscreen mode and background toggling.
 *
 * Height control via Tailwind classes:
 * - Default: h-[350px]
 * - Custom: `<sng-preview-box class="h-[700px]">`
 *
 * @example
 * ```html
 * <sng-preview-box class="h-[500px]">
 *   <sng-preview-block>
 *     <sng-button>Click me</sng-button>
 *   </sng-preview-block>
 *   <sng-html-block [code]="htmlCode" />
 *   <sng-code-block [code]="tsCode" />
 *   <sng-style-block [code]="cssCode" />
 * </sng-preview-box>
 * ```
 */
@Component({
  selector: 'sng-preview-box',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()'
  },
  styles: [`
    .sng-preview-box-code-area > sng-html-block,
    .sng-preview-box-code-area > sng-code-block,
    .sng-preview-box-code-area > sng-preview-code-block,
    .sng-preview-box-code-area > sng-style-block {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `],
  template: `
    <!-- Fullscreen backdrop (decorative) -->
    @if (isFullscreen()) {
      <div
        aria-hidden="true"
        class="fixed inset-0 z-[10000] bg-black/80"
        (click)="toggleFullscreen()"
      ></div>
    }

    <!-- Main container -->
    <div [class]="containerClasses()">
      <!-- Tab bar -->
      <div class="flex items-center justify-between h-11 px-1 border-b border-border bg-muted">
        <!-- Tabs group -->
        <div class="inline-flex items-center relative">
          <!-- Sliding indicator - no transition until initialized to prevent FOUC -->
          <div
            [class]="indicatorClasses()"
            [style.left.px]="indicatorLeft()"
            [style.width.px]="indicatorWidth()"
          ></div>

          <!-- Preview Tab -->
          <button
            #tabBtn
            [class]="tabClasses(activeTab() === 'preview')"
            (click)="setActiveTab('preview')"
          >
            <svg class="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Preview
          </button>

          <!-- HTML Tab -->
          @if (hasHtml()) {
            <button
              #tabBtn
              [class]="tabClasses(activeTab() === 'html')"
              (click)="setActiveTab('html')"
            >
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="m10 13-2 2 2 2"/>
                <path d="m14 17 2-2-2-2"/>
              </svg>
              HTML
            </button>
          }

          <!-- Code Tab -->
          @if (hasCode()) {
            <button
              #tabBtn
              [class]="tabClasses(activeTab() === 'code')"
              (click)="setActiveTab('code')"
            >
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
              Code
            </button>
          }

          <!-- Style Tab -->
          @if (hasStyle()) {
            <button
              #tabBtn
              [class]="tabClasses(activeTab() === 'style')"
              (click)="setActiveTab('style')"
            >
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/>
                <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>
              </svg>
              Style
            </button>
          }
        </div>

        <!-- Actions group -->
        <div class="inline-flex items-center gap-1">
          <!-- Background Toggle -->
          <button
            class="flex items-center justify-center px-2 py-1 border-0 rounded-md bg-transparent cursor-pointer"
            [title]="useThemeBg() ? 'Switch to muted background' : 'Switch to theme background'"
            (click)="toggleBackground()"
          >
            <span [class]="toggleTrackClasses()">
              <span [class]="toggleThumbClasses()"></span>
            </span>
          </button>

          <!-- Fullscreen Button -->
          <button
            class="flex items-center justify-center w-8 h-8 border-0 rounded-md bg-transparent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Fullscreen"
            (click)="toggleFullscreen()"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
              <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
              <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
              <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Preview Tab Content -->
      <div [class]="contentAreaClasses()">
        @if (previewTemplate()) {
          <ng-container *ngTemplateOutlet="previewTemplate()" />
        } @else {
          <ng-content select="sng-preview-block" />
        }
      </div>

      <!-- HTML Tab Content -->
      <div [class]="codeAreaClasses(activeTab() === 'html')">
        <ng-content select="sng-html-block" />
      </div>

      <!-- Code Tab Content -->
      <div [class]="codeAreaClasses(activeTab() === 'code')">
        <ng-content select="sng-code-block, sng-preview-code-block" />
      </div>

      <!-- Style Tab Content -->
      <div [class]="codeAreaClasses(activeTab() === 'style')">
        <ng-content select="sng-style-block" />
      </div>
    </div>
  `
})
export class SngPreviewBoxComponent implements AfterViewInit {
  private injector = inject(Injector);

  tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabBtn');

  /** Custom CSS classes. */
  class = input<string>('');

  // Host classes: default h-[350px], user can override with class="h-[700px]"
  hostClasses = computed(() => cn(
    'block h-[350px]',
    this.class()
  ));

  // Container classes
  containerClasses = computed(() => cn(
    'flex flex-col h-full border border-border rounded-lg overflow-hidden',
    this.isFullscreen() && 'fixed inset-6 z-[10001] rounded-xl shadow-2xl bg-background'
  ));

  // Tab button classes
  tabClasses(isActive: boolean) {
    return cn(
      'inline-flex items-center gap-2 px-3.5 py-2 border-0 rounded-md bg-transparent text-sm text-muted-foreground cursor-pointer transition-colors relative z-[1]',
      'hover:text-foreground',
      isActive && 'text-foreground font-medium'
    );
  }

  // Toggle track classes - no transition to prevent FOUC
  toggleTrackClasses = computed(() => cn(
    'block w-9 h-5 rounded-full relative border',
    this.useThemeBg()
      ? 'bg-muted border-border hover:border-muted-foreground'
      : 'bg-primary border-primary'
  ));

  // Toggle thumb classes - no transition to prevent FOUC
  toggleThumbClasses = computed(() => cn(
    'block w-3.5 h-3.5 rounded-full absolute top-[2px] left-[2px]',
    this.useThemeBg()
      ? 'bg-muted-foreground'
      : 'bg-primary-foreground translate-x-4'
  ));

  // Content area classes (preview tab)
  contentAreaClasses = computed(() => cn(
    'bg-background relative',
    this.activeTab() === 'preview'
      ? 'flex flex-col items-stretch justify-start flex-1 min-h-0 overflow-y-auto'
      : 'hidden',
    !this.useThemeBg() && 'bg-muted'
  ));

  // Code area classes (html/code/style tabs)
  codeAreaClasses(isActive: boolean) {
    return cn(
      'sng-preview-box-code-area p-0 bg-muted overflow-hidden',
      isActive ? 'flex flex-col flex-1' : 'hidden',
    );
  }

  // Content child for template-based preview
  previewTemplate = contentChild<TemplateRef<unknown>>('preview');

  // Content children to detect tab content
  htmlBlock = contentChild(SngHtmlBlock);
  codeBlock = contentChild(SngCodeBlock);
  previewCodeBlock = contentChild(SngPreviewCodeBlock);
  styleBlock = contentChild(SngStyleBlock);

  // Computed signals to check if tabs have content
  hasHtml = computed(() => {
    const block = this.htmlBlock();
    return block && block.code()?.trim().length > 0;
  });

  hasCode = computed(() => {
    const previewCodeBlock = this.previewCodeBlock();
    if (previewCodeBlock) {
      return previewCodeBlock.code()?.trim().length > 0;
    }
    const block = this.codeBlock();
    return block && block.code()?.trim().length > 0;
  });

  hasStyle = computed(() => {
    const block = this.styleBlock();
    return block && block.code()?.trim().length > 0;
  });

  activeTab = signal<TabType>('preview');
  isFullscreen = signal(false);
  useThemeBg = signal(true); // true = theme bg (default), false = muted grey
  indicatorLeft = signal(0);
  indicatorWidth = signal(0);
  isIndicatorInitialized = signal(false);

  // Indicator classes - only add transition after initial positioning to prevent FOUC
  indicatorClasses = computed(() => cn(
    'absolute h-full top-0 bg-background border border-border rounded-md shadow-sm pointer-events-none',
    this.isIndicatorInitialized() && 'transition-all duration-200 ease-out'
  ));

  constructor() {
    // Update indicator when tab buttons are available
    effect(() => {
      const buttons = this.tabButtons();
      const tab = this.activeTab();
      if (buttons.length > 0) {
        this.updateIndicator(tab, buttons);
      }
    });
  }

  ngAfterViewInit() {
    // Initial indicator position
    afterNextRender(() => {
      const buttons = this.tabButtons();
      if (buttons.length > 0) {
        this.updateIndicator('preview', buttons);
        // Enable transitions after initial positioning (next frame)
        requestAnimationFrame(() => this.isIndicatorInitialized.set(true));
      }
    }, { injector: this.injector });
  }

  private updateIndicator(tab: TabType, buttons: readonly ElementRef<HTMLButtonElement>[]) {
    // Calculate dynamic tab index based on visible tabs
    let tabIndex = 0;
    if (tab === 'preview') {
      tabIndex = 0;
    } else if (tab === 'html') {
      tabIndex = 1;
    } else if (tab === 'code') {
      tabIndex = 1 + (this.hasHtml() ? 1 : 0);
    } else if (tab === 'style') {
      tabIndex = 1 + (this.hasHtml() ? 1 : 0) + (this.hasCode() ? 1 : 0);
    }
    const button = buttons[tabIndex]?.nativeElement;
    if (button) {
      const parent = button.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        this.indicatorLeft.set(buttonRect.left - parentRect.left);
        this.indicatorWidth.set(buttonRect.width);
      }
    }
  }

  setActiveTab(tab: TabType) {
    this.activeTab.set(tab);
  }

  toggleBackground() {
    this.useThemeBg.update(v => !v);
  }

  toggleFullscreen() {
    this.isFullscreen.update(v => !v);
  }
}
