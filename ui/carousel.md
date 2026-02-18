
# ShadNG Carousel

Touch-friendly slide navigation built on Embla Carousel. Horizontal or vertical orientation, auto-loop modes, and swipe gestures.

## Installation

```bash
npx @shadng/sng-ui add carousel
```

## Basic Usage

```html
<sng-carousel class="w-full max-w-xs">
  <sng-carousel-content>
    <sng-carousel-item>Slide 1</sng-carousel-item>
    <sng-carousel-item>Slide 2</sng-carousel-item>
    <sng-carousel-item>Slide 3</sng-carousel-item>
  </sng-carousel-content>
  <sng-carousel-previous></sng-carousel-previous>
  <sng-carousel-next></sng-carousel-next>
</sng-carousel>
```

## Multiple Slides Visible

```html
<sng-carousel class="w-full">
  <sng-carousel-content>
    <sng-carousel-item class="basis-1/3">Slide 1</sng-carousel-item>
    <sng-carousel-item class="basis-1/3">Slide 2</sng-carousel-item>
    <sng-carousel-item class="basis-1/3">Slide 3</sng-carousel-item>
  </sng-carousel-content>
  <sng-carousel-previous></sng-carousel-previous>
  <sng-carousel-next></sng-carousel-next>
</sng-carousel>
```

## Vertical Orientation

```html
<sng-carousel orientation="vertical" class="w-full">
  <sng-carousel-content class="h-[200px]">
    <sng-carousel-item>Slide 1</sng-carousel-item>
    <sng-carousel-item>Slide 2</sng-carousel-item>
    <sng-carousel-item>Slide 3</sng-carousel-item>
  </sng-carousel-content>
  <sng-carousel-previous></sng-carousel-previous>
  <sng-carousel-next></sng-carousel-next>
</sng-carousel>
```

## Auto-Loop Forward

```html
<!-- Continuous loop: 1 -> 2 -> 3 -> 1 -> 2 -> ... -->
<sng-carousel loop="forward" [loopDelay]="3000">
  <sng-carousel-content>
    <sng-carousel-item>Slide 1</sng-carousel-item>
    <sng-carousel-item>Slide 2</sng-carousel-item>
    <sng-carousel-item>Slide 3</sng-carousel-item>
  </sng-carousel-content>
</sng-carousel>
```

## Auto-Loop Bounce

```html
<!-- Ping-pong: 1 -> 2 -> 3 -> 2 -> 1 -> 2 -> ... -->
<sng-carousel loop="bounce" [loopDelay]="2000">
  <sng-carousel-content>
    <sng-carousel-item>Slide 1</sng-carousel-item>
    <sng-carousel-item>Slide 2</sng-carousel-item>
    <sng-carousel-item>Slide 3</sng-carousel-item>
  </sng-carousel-content>
</sng-carousel>
```


---

# SngCarousel Technical Reference

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, Embla integration, edge cases.

## Component Architecture

```typescript
// 5 components in compound pattern (all in single file):
// 1. SngCarousel         - Root container, manages Embla instance and state
// 2. SngCarouselContent  - Viewport + slides container wrapper
// 3. SngCarouselItem     - Individual slide with ARIA attributes
// 4. SngCarouselPrevious - Previous navigation button (attribute selector)
// 5. SngCarouselNext     - Next navigation button (attribute selector)
```

## Component Interfaces

```typescript
// SngCarousel - Main Container
interface SngCarouselApi {
  // INPUTS (all via input())
  orientation: InputSignal<'horizontal' | 'vertical'>;  // Default: 'horizontal'
  loop: InputSignal<false | 'forward' | 'bounce'>;      // Default: false
  loopDelay: InputSignal<number>;                       // Default: 3000 (ms)
  plugins: InputSignal<unknown[]>;                      // Default: []
  class: InputSignal<string>;                           // Default: ''
  label: InputSignal<string>;                           // Default: '' (auto-generated)

  // OUTPUTS
  apiReady: OutputEmitterRef<EmblaCarouselType>;

  // SIGNALS (internal state exposed)
  emblaApi: Signal<EmblaCarouselType | null>;
  canScrollPrev: Signal<boolean>;
  canScrollNext: Signal<boolean>;
  currentSlide: Signal<number>;   // 1-based index
  slideCount: Signal<number>;

  // METHODS
  scrollPrev(): void;
  scrollNext(): void;
}

// SngCarouselContent - Viewport + Slides Container
interface SngCarouselContentApi {
  class: InputSignal<string>;
}

// SngCarouselItem - Individual Slide
interface SngCarouselItemApi {
  class: InputSignal<string>;
  label: InputSignal<string>;   // Custom aria-label
}

// SngCarouselPrevious/SngCarouselNext - Navigation Buttons
interface SngCarouselNavigationApi {
  class: InputSignal<string>;
  // Auto-disables when cannot scroll in that direction
}
```

### TypeScript Types

```typescript
/** Carousel scroll direction */
export type CarouselOrientation = 'horizontal' | 'vertical';

/** Auto-loop behavior */
export type CarouselLoopMode = false | 'forward' | 'bounce';

/** Re-exported for API access */
export type { EmblaCarouselType } from 'embla-carousel';

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
}

/** Injection token for context */
export const SNG_CAROUSEL_CONTEXT: InjectionToken<CarouselContext>;
```

## Embla Carousel Integration

```typescript
// SngCarousel initializes Embla in AfterViewInit
@Component({
  selector: 'sng-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: SNG_CAROUSEL_CONTEXT,
    useFactory: () => {
      const carousel = inject(SngCarousel);
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
      };
    },
  }],
  template: `
    <div #container [class]="hostClasses()" role="region"
         aria-roledescription="carousel" [attr.aria-label]="ariaLabel()"
         tabindex="0">
      <ng-content />
    </div>
  `,
})
export class SngCarousel implements AfterViewInit, OnDestroy {
  private embla: EmblaCarouselType | null = null;

  ngAfterViewInit() {
    // Wait for content projection
    afterNextRender(() => this.initCarousel(), { injector: this.injector });
  }

  private initCarousel() {
    const viewport = host.querySelector('[data-carousel-viewport]');
    const options = {
      axis: this.orientation() === 'horizontal' ? 'x' : 'y',
      loop: this.loop() === 'forward', // Embla's infinite loop
    };
    this.embla = EmblaCarousel(viewport, options, this.plugins());
    this.emblaApi.set(this.embla);

    // Set up event listeners
    this.embla.on('select', () => this.updateScrollState());
    this.embla.on('reInit', () => this.updateScrollState());

    // Start auto-loop if enabled
    if (this.loop() === 'forward' || this.loop() === 'bounce') {
      this.startAutoLoop();
    }

    this.apiReady.emit(this.embla);
  }
}
```

## Import Requirements

```typescript
// ALL 5 COMPONENTS typically needed
import {
  SngCarousel,
  SngCarouselContent,
  SngCarouselItem,
  SngCarouselPrevious,
  SngCarouselNext,
} from 'sng-ui';

// Types (optional, for strict typing)
import type {
  CarouselOrientation,
  CarouselLoopMode,
  CarouselContext,
  EmblaCarouselType,
} from 'sng-ui';

@Component({
  standalone: true,
  imports: [
    SngCarousel,
    SngCarouselContent,
    SngCarouselItem,
    SngCarouselPrevious,
    SngCarouselNext,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent { }
```

## ARIA Compliance (Automatic)

```html
<!-- Generated ARIA structure -->
<sng-carousel>
  <div role="region" aria-roledescription="carousel"
       aria-label="Carousel, slide 1 of 5" tabindex="0">
    <sng-carousel-content>
      <div data-carousel-viewport class="overflow-hidden">
        <div class="flex -ml-4">
          <sng-carousel-item role="group" aria-roledescription="slide"
                             aria-label="Slide 1 of 5">
            <!-- content -->
          </sng-carousel-item>
        </div>
      </div>
    </sng-carousel-content>
    <sng-carousel-previous [disabled]="false">
      <span class="sr-only">Previous slide</span>
    </sng-carousel-previous>
    <sng-carousel-next [disabled]="false">
      <span class="sr-only">Next slide</span>
    </sng-carousel-next>
  </div>
</sng-carousel>

<!-- Live announcer updates on slide change -->
<!-- "Slide 2 of 5" announced via LiveAnnouncer -->
```

## Loop Mode Behavior

```typescript
// NO LOOP (default)
loop={false}
// - Buttons disable at ends
// - Manual navigation only
// - canScrollPrev/canScrollNext reflect actual state

// FORWARD LOOP
loop="forward"
// - Embla's infinite loop enabled
// - Continuous: 1 -> 2 -> 3 -> 1 -> 2 -> ...
// - Buttons never disable (always can scroll)

// BOUNCE LOOP
loop="bounce"
// - Embla's loop DISABLED
// - Auto-reverses at ends: 1 -> 2 -> 3 -> 2 -> 1 -> ...
// - Buttons still disable at ends for manual nav
// - autoplayDirection tracks current direction

// loopDelay controls interval (default 3000ms)
[loopDelay]="2000"  // Faster transitions
```

## Slide Sizing with Tailwind

```html
<!-- Full width (default) -->
<sng-carousel-item>Full slide</sng-carousel-item>

<!-- Multiple visible -->
<sng-carousel-item class="basis-1/2">Half width</sng-carousel-item>
<sng-carousel-item class="basis-1/3">Third width</sng-carousel-item>
<sng-carousel-item class="basis-1/4">Quarter width</sng-carousel-item>

<!-- Responsive -->
<sng-carousel-item class="basis-full md:basis-1/2 lg:basis-1/3">
  Responsive slide
</sng-carousel-item>

<!-- Fixed pixel width -->
<sng-carousel-item class="basis-[200px]">Fixed 200px</sng-carousel-item>
```

## Programmatic Control via API

```typescript
@Component({
  template: `
    <sng-carousel (apiReady)="onApiReady($event)">...</sng-carousel>
    <button (click)="goToSlide(2)">Go to slide 3</button>
  `
})
export class MyComponent {
  private api: EmblaCarouselType | null = null;

  onApiReady(api: EmblaCarouselType) {
    this.api = api;

    // Listen to events
    api.on('select', () => {
      console.log('Current:', api.selectedScrollSnap());
      console.log('Total:', api.scrollSnapList().length);
    });
  }

  goToSlide(index: number) {
    this.api?.scrollTo(index);
  }
}
```

## Edge Cases & Constraints

```typescript
// 1. VIEWPORT QUERY
// SngCarouselContent must have [data-carousel-viewport] attribute
// Carousel looks for this to initialize Embla

// 2. TIMING - afterNextRender in AfterViewInit
// Content projection requires waiting for next render cycle
// Don't call embla methods before apiReady

// 3. NAVIGATION BUTTON PLACEMENT
// Must be INSIDE sng-carousel to access context via DI
// Won't work if placed outside the component

// 4. VERTICAL HEIGHT REQUIRED
// For vertical orientation, set explicit height on content:
<sng-carousel-content class="h-[200px]">

// 5. CLEANUP ON DESTROY
// Embla.destroy() called automatically
// Auto-loop interval cleared

// 6. PLUGINS TIMING
// Pass plugins in input, they're applied at init
// Changing plugins after init requires reinit

// 7. ORIENTATION AXIS MAPPING
// 'horizontal' -> Embla axis: 'x'
// 'vertical' -> Embla axis: 'y'
```

## Custom Navigation Position

```html
<!-- Default: Outside left/right (horizontal) or top/bottom (vertical) -->
<sng-carousel-previous></sng-carousel-previous>
<sng-carousel-next></sng-carousel-next>

<!-- Custom position with class override -->
<sng-carousel-previous
        class="absolute left-2 top-1/2 -translate-y-1/2"></sng-carousel-previous>
<sng-carousel-next
        class="absolute right-2 top-1/2 -translate-y-1/2"></sng-carousel-next>

<!-- Below carousel -->
<div class="flex justify-center gap-2 mt-4">
  <sng-carousel-previous class="static translate-y-0"></sng-carousel-previous>
  <sng-carousel-next class="static translate-y-0"></sng-carousel-next>
</div>
```

## Do's and Don'ts

### Do
- Set explicit height for vertical carousels (`class="h-[200px]"` on content)
- Use `basis-*` classes for multiple visible slides
- Handle `apiReady` for programmatic control
- Use `loop="forward"` for infinite galleries
- Use `loop="bounce"` for finite content with auto-advance
- Test touch gestures on real mobile devices
- Provide clear slide count indication (dots or numbers)

### Don't
- Place navigation buttons outside `sng-carousel` (context injection fails)
- Use auto-play for marketing carousels (users find it annoying)
- Forget `data-carousel-viewport` on custom content components
- Call Embla methods before `apiReady` fires
- Use more than 10-15 slides (consider pagination instead)
- Mix horizontal and vertical in responsive (orientation can't be responsive)
- Auto-loop without pause on hover/focus (a11y issue)

## Common Mistakes

1. **Navigation buttons don't work** - Buttons must be inside `sng-carousel` element to access injected context. Moving them outside breaks the DI chain.

2. **Vertical carousel has no height** - Unlike horizontal, vertical needs explicit height on `sng-carousel-content`. Without it, slides collapse to 0 height.

3. **Using npm install** - Use `npx @shadng/sng-ui add carousel` (copy-paste model). Also installs `embla-carousel` dependency.

4. **Calling API before ready** - Embla initializes in `AfterViewInit` via `afterNextRender`. Always use `(apiReady)` output or check `emblaApi()` for null.

5. **Auto-loop without user control** - Both loop modes run indefinitely. Consider pausing on hover/focus and providing manual controls.

6. **Slides not sized correctly** - Default is `basis-full`. For multiple visible slides, add `basis-1/3` etc. to `sng-carousel-item`.

7. **Forgetting component imports** - Need all 5: `SngCarousel`, `SngCarouselContent`, `SngCarouselItem`, `SngCarouselPrevious`, `SngCarouselNext`.

8. **Custom content missing viewport** - If creating custom content wrapper, include `data-carousel-viewport` attribute on the scrollable container.

## Accessibility Summary

### Automatic ARIA (no configuration needed)
- `role="region"` on carousel container
- `aria-roledescription="carousel"` on container
- `aria-roledescription="slide"` on items
- `aria-label` with current/total slides (auto-generated or custom via `label`)
- `tabindex="0"` for focus focus
- Live region announcements on slide change


### Screen Reader Support
- `LiveAnnouncer` announces slide changes
- Navigation buttons have `sr-only` text
- Slides announce their position ("Slide 1 of 5")
