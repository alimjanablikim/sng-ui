import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  signal,
  computed,
  OnDestroy,
  ElementRef,
  inject,
  Injector,
  InjectionToken,
  AfterViewInit,
  afterNextRender,
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';
import { Subscription, interval } from 'rxjs';
import { cn } from './cn';

/** Carousel options - simplified type compatible with Embla */
export interface CarouselOptions {
  align?: 'start' | 'center' | 'end' | number;
  axis?: 'x' | 'y';
  container?: string | HTMLElement | null;
  slides?: string | HTMLElement[] | NodeListOf<HTMLElement> | null;
  containScroll?: 'trimSnaps' | 'keepSnaps' | false;
  direction?: 'ltr' | 'rtl';
  slidesToScroll?: number | 'auto';
  dragFree?: boolean;
  dragThreshold?: number;
  inViewThreshold?: number | number[];
  loop?: boolean;
  skipSnaps?: boolean;
  duration?: number;
  startIndex?: number;
  watchDrag?: boolean | ((emblaApi: EmblaCarouselType, event: MouseEvent | TouchEvent) => boolean | void);
  watchResize?: boolean | ((emblaApi: EmblaCarouselType, entries: ResizeObserverEntry[]) => boolean | void);
  watchSlides?: boolean | ((emblaApi: EmblaCarouselType, mutations: MutationRecord[]) => boolean | void);
  active?: boolean;
  breakpoints?: Record<string, Omit<CarouselOptions, 'breakpoints'>>;
}

/** Re-export Embla carousel type for API access */
export type { EmblaCarouselType };

/** Carousel orientation type */
export type CarouselOrientation = 'horizontal' | 'vertical';

/** Loop mode type: false = no loop, 'forward' = auto-loop 1→2→3→1, 'bounce' = auto-loop 1→2→3→2→1 */
export type CarouselLoopMode = false | 'forward' | 'bounce';

/** Carousel context for child components */
export interface CarouselContext {
  carouselRef: () => HTMLElement | null;
  api: () => EmblaCarouselType | null;
  orientation: () => CarouselOrientation;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  currentSlide: () => number;
  slideCount: () => number;
  previousSlideLabel: () => string;
  nextSlideLabel: () => string;
  slideAriaLabel: (index: number, total: number) => string;
  /** @internal Returns a 1-based slide index scoped to this carousel instance */
  registerSlide: () => number;
}

/** Injection token for carousel context */
export const SNG_CAROUSEL_CONTEXT = new InjectionToken<CarouselContext>('SngCarouselContext');

/**
 * A carousel component built on Embla Carousel for smooth, touch-friendly slide navigation.
 * Supports horizontal/vertical orientation and auto-looping.
 *
 * @example
 * ```html
 * <sng-carousel orientation="horizontal" [loop]="'forward'" [loopDelay]="4000">
 *   <sng-carousel-content>
 *     <sng-carousel-item>Slide 1</sng-carousel-item>
 *     <sng-carousel-item>Slide 2</sng-carousel-item>
 *     <sng-carousel-item>Slide 3</sng-carousel-item>
 *   </sng-carousel-content>
 *   <sng-carousel-previous></sng-carousel-previous>
 *   <sng-carousel-next></sng-carousel-next>
 * </sng-carousel>
 * ```
 */
@Component({
  selector: 'sng-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SNG_CAROUSEL_CONTEXT,
      useFactory: () => {
        const carousel = inject(SngCarousel);
        let slideCounter = 0;
        return {
          carouselRef: () => carousel.containerRef()?.nativeElement ?? null,
          api: () => carousel.emblaApi(),
          orientation: () => carousel.orientation(),
          scrollPrev: () => carousel.scrollPrev(),
          scrollNext: () => carousel.scrollNext(),
          canScrollPrev: () => carousel.canScrollPrev(),
          canScrollNext: () => carousel.canScrollNext(),
          currentSlide: () => carousel.currentSlide(),
          slideCount: () => carousel.slideCount(),
          previousSlideLabel: () => carousel.previousSlideLabel(),
          nextSlideLabel: () => carousel.nextSlideLabel(),
          slideAriaLabel: (index: number, total: number) => carousel.getSlideAriaLabel(index, total),
          registerSlide: () => ++slideCounter,
        };
      },
    },
  ],
  template: `
    <div
      #container
      [class]="hostClasses()"
      role="region"
      aria-roledescription="carousel"
      [attr.aria-label]="ariaLabel()"
      tabindex="0"
    >
      <ng-content />
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class SngCarousel implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private injector = inject(Injector);
  private liveAnnouncer = inject(LiveAnnouncer);

  /**
   * Carousel scroll orientation.
   */
  orientation = input<CarouselOrientation>('horizontal');

  /**
   * Embla carousel plugins for extended functionality (e.g., autoplay, fade).
   */
  plugins = input<unknown[]>([]);

  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * Accessible label for the carousel region. If not provided, an automatic label
   * with current slide information will be generated.
   */
  label = input<string>('');

  /** Label for previous-slide controls. */
  previousSlideLabel = input<string>('Previous slide');

  /** Label for next-slide controls. */
  nextSlideLabel = input<string>('Next slide');

  /** Label prefix for auto-generated slide aria labels. */
  slideLabel = input<string>('Slide');

  /** Label separator for auto-generated slide aria labels. */
  ofLabel = input<string>('of');

  /** Formatter for auto-generated slide aria labels. */
  slideAriaLabelFormatter = input<((index: number, total: number) => string) | null>(null);

  /**
   * Loop mode for automatic slide advancement.
   * - `false`: No auto-looping
   * - `'forward'`: Auto-loop continuously (1 -> 2 -> 3 -> 1)
   * - `'bounce'`: Auto-loop with direction reversal at ends (1 -> 2 -> 3 -> 2 -> 1)
   */
  loop = input<CarouselLoopMode>(false);

  /**
   * Delay between auto-loop transitions in milliseconds.
   * Only applies when `loop` is set to `'forward'` or `'bounce'`.
   */
  loopDelay = input<number>(3000);

  /** Emits when the carousel API is ready */
  apiReady = output<EmblaCarouselType>();

  /** Get container element from host */
  containerRef = () => this.elementRef;

  /** Embla carousel instance */
  emblaApi = signal<EmblaCarouselType | null>(null);

  /** Whether can scroll to previous */
  canScrollPrev = signal(false);

  /** Whether can scroll to next */
  canScrollNext = signal(false);

  /** Current slide index (1-based for display) */
  currentSlide = signal(1);

  /** Total number of slides */
  slideCount = signal(0);

  private embla: EmblaCarouselType | null = null;
  private autoplaySubscription: Subscription | null = null;
  private autoplayDirection: 'forward' | 'backward' = 'forward';

  hostClasses = computed(() => cn('relative outline-none focus:ring-1 focus:ring-border focus:ring-offset-2 rounded-md', this.class()));

  /** Aria label for the carousel */
  ariaLabel = computed(() => {
    const customLabel = this.label();
    if (customLabel) return customLabel;
    return `Carousel, ${this.getSlideAriaLabel(this.currentSlide(), this.slideCount())}`;
  });

  getSlideAriaLabel(index: number, total: number): string {
    return this.slideAriaLabelFormatter()?.(index, total)
      ?? `${this.slideLabel()} ${index} ${this.ofLabel()} ${total}`;
  }

  ngAfterViewInit() {
    // Wait for content to be projected
    afterNextRender(() => this.initCarousel(), { injector: this.injector });
  }

  private initCarousel() {
    const host = this.elementRef.nativeElement as HTMLElement;
    if (!host) return;

    const viewport = host.querySelector('[data-carousel-viewport]') as HTMLElement;
    if (!viewport) return;

    const loopMode = this.loop();
    const options: Record<string, unknown> = {
      axis: this.orientation() === 'horizontal' ? 'x' : 'y',
      loop: loopMode === 'forward', // Enable infinite loop for forward mode
    };

    this.embla = EmblaCarousel(viewport, options as Parameters<typeof EmblaCarousel>[1], this.plugins() as Parameters<typeof EmblaCarousel>[2]);
    this.emblaApi.set(this.embla);

    this.updateScrollState();
    this.embla.on('select', () => this.updateScrollState());
    this.embla.on('reInit', () => this.updateScrollState());

    // Start auto-loop if enabled
    if (loopMode === 'forward' || loopMode === 'bounce') {
      this.startAutoLoop();
    }

    this.apiReady.emit(this.embla);
  }

  private startAutoLoop() {
    this.stopAutoLoop();
    this.autoplaySubscription = interval(this.loopDelay()).subscribe(() => {
      if (!this.embla) return;

      const loopMode = this.loop();
      if (loopMode === 'bounce') {
        // Bounce mode: reverse direction at ends
        if (this.autoplayDirection === 'forward') {
          if (this.embla.canScrollNext()) {
            this.embla.scrollNext();
          } else {
            this.autoplayDirection = 'backward';
            this.embla.scrollPrev();
          }
        } else {
          if (this.embla.canScrollPrev()) {
            this.embla.scrollPrev();
          } else {
            this.autoplayDirection = 'forward';
            this.embla.scrollNext();
          }
        }
      } else {
        // Forward mode: continuous loop (embla loop handles wrap-around)
        this.embla.scrollNext();
      }
    });
  }

  private stopAutoLoop() {
    this.autoplaySubscription?.unsubscribe();
    this.autoplaySubscription = null;
  }

  private updateScrollState() {
    if (!this.embla) return;
    this.canScrollPrev.set(this.embla.canScrollPrev());
    this.canScrollNext.set(this.embla.canScrollNext());

    const selectedIndex = this.embla.selectedScrollSnap();
    const total = this.embla.scrollSnapList().length;

    const prevSlide = this.currentSlide();
    this.currentSlide.set(selectedIndex + 1);
    this.slideCount.set(total);

    // Announce slide change if it changed
    if (prevSlide !== selectedIndex + 1 && total > 0) {
      this.liveAnnouncer.announce(`Slide ${selectedIndex + 1} of ${total}`);
    }
  }

  scrollPrev() {
    this.embla?.scrollPrev();
  }

  scrollNext() {
    this.embla?.scrollNext();
  }

  ngOnDestroy() {
    this.stopAutoLoop();
    this.embla?.destroy();
    this.embla = null;
  }
}

/**
 * Carousel content container (viewport + slides container)
 */
@Component({
  selector: 'sng-carousel-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div data-carousel-viewport [class]="viewportClasses()">
      <div [class]="containerClasses()">
        <ng-content />
      </div>
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class SngCarouselContent {
  private context = inject(SNG_CAROUSEL_CONTEXT);

  /** Custom CSS classes. */
  class = input<string>('');

  viewportClasses = computed(() => 'overflow-hidden');

  containerClasses = computed(() => {
    const isHorizontal = this.context.orientation() === 'horizontal';
    return cn(
      'flex',
      isHorizontal ? '-ml-4' : 'flex-col gap-4',
      this.class()
    );
  });
}

/**
 * Individual carousel item/slide
 */
@Component({
  selector: 'sng-carousel-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-label]': 'ariaLabel()',
    'role': 'group',
    'aria-roledescription': 'slide',
  },
})
export class SngCarouselItem {
  private context = inject(SNG_CAROUSEL_CONTEXT);
  private slideIndex = this.context.registerSlide();

  /** Custom CSS classes. */
  class = input<string>('');

  /** Custom aria label for this slide */
  label = input<string>('');

  hostClasses = computed(() => {
    const isHorizontal = this.context.orientation() === 'horizontal';
    return cn(
      'min-w-0 shrink-0 grow-0 basis-full',
      isHorizontal ? 'pl-4' : '',
      this.class()
    );
  });

  ariaLabel = computed(() => {
    const custom = this.label();
    if (custom) return custom;
    const total = this.context.slideCount();
    if (total > 0) {
      return this.context.slideAriaLabel(this.slideIndex, total);
    }
    return null;
  });
}

/**
 * Previous button for carousel navigation
 */
@Component({
  selector: 'sng-carousel-previous',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [attr.aria-label]="context.previousSlideLabel()"
      [disabled]="!context.canScrollPrev()"
      (click)="context.scrollPrev()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4"
      >
        <path d="m12 19-7-7 7-7"/>
        <path d="M19 12H5"/>
      </svg>
      <span class="sr-only">{{ context.previousSlideLabel() }}</span>
    </button>
  `,
})
export class SngCarouselPrevious {
  context = inject(SNG_CAROUSEL_CONTEXT);

  /** Custom CSS classes. */
  class = input<string>('');

  buttonClasses = computed(() => {
    const isHorizontal = this.context.orientation() === 'horizontal';
    return cn(
      'absolute h-8 w-8 rounded-full inline-flex items-center justify-center',
      'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
      'disabled:pointer-events-none disabled:opacity-50',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      isHorizontal
        ? 'left-2 sm:-left-12 top-1/2 -translate-y-1/2'
        : 'top-2 sm:-top-12 left-1/2 -translate-x-1/2 rotate-90',
      this.class()
    );
  });
}

/**
 * Next button for carousel navigation
 */
@Component({
  selector: 'sng-carousel-next',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [attr.aria-label]="context.nextSlideLabel()"
      [disabled]="!context.canScrollNext()"
      (click)="context.scrollNext()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4"
      >
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
      </svg>
      <span class="sr-only">{{ context.nextSlideLabel() }}</span>
    </button>
  `,
})
export class SngCarouselNext {
  context = inject(SNG_CAROUSEL_CONTEXT);

  /** Custom CSS classes. */
  class = input<string>('');

  buttonClasses = computed(() => {
    const isHorizontal = this.context.orientation() === 'horizontal';
    return cn(
      'absolute h-8 w-8 rounded-full inline-flex items-center justify-center',
      'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
      'disabled:pointer-events-none disabled:opacity-50',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      isHorizontal
        ? 'right-2 sm:-right-12 top-1/2 -translate-y-1/2'
        : 'bottom-2 sm:-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
      this.class()
    );
  });
}
