import { type Meta, type StoryObj } from '@storybook/angular';
import { SngCarousel, SngCarouselContent, SngCarouselItem, SngCarouselPrevious, SngCarouselNext } from './sng-carousel';

const meta: Meta<SngCarousel> = {
  title: 'UI/Carousel',
  component: SngCarousel,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Scroll direction',
    },
    loop: {
      control: 'select',
      options: [false, 'forward', 'bounce'],
      description: 'Auto-loop mode',
    },
    loopDelay: {
      control: 'number',
      description: 'Delay between auto-loop transitions (ms)',
    },
    label: {
      control: 'text',
      description: 'Accessible label for the carousel',
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<SngCarousel>;

/**
 * Default horizontal carousel with navigation buttons.
 */
export const Default: Story = {
  render: (args) => ({
    moduleMetadata: {
      imports: [SngCarousel, SngCarouselContent, SngCarouselItem, SngCarouselPrevious, SngCarouselNext],
    },
    props: { ...args, slides: [1, 2, 3, 4, 5] },
    template: `
      <div class="w-full max-w-sm mx-auto px-12">
        <sng-carousel [orientation]="orientation" [loop]="loop" [loopDelay]="loopDelay" [label]="label">
          <sng-carousel-content>
            @for (slide of slides; track slide) {
              <sng-carousel-item>
                <div class="p-1">
                  <div class="flex aspect-square items-center justify-center rounded-lg border border-border bg-card p-6">
                    <span class="text-4xl font-semibold">{{ slide }}</span>
                  </div>
                </div>
              </sng-carousel-item>
            }
          </sng-carousel-content>
          <sng-carousel-previous></sng-carousel-previous>
          <sng-carousel-next></sng-carousel-next>
        </sng-carousel>
      </div>
    `,
  }),
  args: {
    orientation: 'horizontal',
    loop: false,
    loopDelay: 3000,
    label: '',
  },
};

/**
 * Carousel with auto-looping forward mode.
 */
export const AutoLoopForward: Story = {
  render: (args) => ({
    moduleMetadata: {
      imports: [SngCarousel, SngCarouselContent, SngCarouselItem, SngCarouselPrevious, SngCarouselNext],
    },
    props: { ...args, slides: [1, 2, 3, 4, 5] },
    template: `
      <div class="w-full max-w-sm mx-auto px-12">
        <sng-carousel [orientation]="orientation" loop="forward" [loopDelay]="loopDelay">
          <sng-carousel-content>
            @for (slide of slides; track slide) {
              <sng-carousel-item>
                <div class="p-1">
                  <div class="flex aspect-square items-center justify-center rounded-lg bg-primary text-primary-foreground p-6">
                    <span class="text-4xl font-semibold">{{ slide }}</span>
                  </div>
                </div>
              </sng-carousel-item>
            }
          </sng-carousel-content>
          <sng-carousel-previous></sng-carousel-previous>
          <sng-carousel-next></sng-carousel-next>
        </sng-carousel>
        <p class="text-center text-sm text-muted-foreground mt-4">Auto-advances every 3 seconds</p>
      </div>
    `,
  }),
  args: {
    orientation: 'horizontal',
    loopDelay: 3000,
  },
};

/**
 * Carousel with bounce mode auto-loop.
 */
export const AutoLoopBounce: Story = {
  render: (args) => ({
    moduleMetadata: {
      imports: [SngCarousel, SngCarouselContent, SngCarouselItem, SngCarouselPrevious, SngCarouselNext],
    },
    props: { ...args, slides: [1, 2, 3] },
    template: `
      <div class="w-full max-w-sm mx-auto px-12">
        <sng-carousel [orientation]="orientation" loop="bounce" [loopDelay]="loopDelay">
          <sng-carousel-content>
            @for (slide of slides; track slide) {
              <sng-carousel-item>
                <div class="p-1">
                  <div class="flex aspect-square items-center justify-center rounded-lg bg-secondary text-secondary-foreground p-6">
                    <span class="text-4xl font-semibold">{{ slide }}</span>
                  </div>
                </div>
              </sng-carousel-item>
            }
          </sng-carousel-content>
          <sng-carousel-previous></sng-carousel-previous>
          <sng-carousel-next></sng-carousel-next>
        </sng-carousel>
        <p class="text-center text-sm text-muted-foreground mt-4">Bounces back at ends (1→2→3→2→1→2...)</p>
      </div>
    `,
  }),
  args: {
    orientation: 'horizontal',
    loopDelay: 2000,
  },
};

/**
 * Image gallery carousel example.
 */
export const ImageGallery: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngCarousel, SngCarouselContent, SngCarouselItem, SngCarouselPrevious, SngCarouselNext],
    },
    props: {
      images: [
        { alt: 'Placeholder 1', bg: 'bg-blue-500' },
        { alt: 'Placeholder 2', bg: 'bg-green-500' },
        { alt: 'Placeholder 3', bg: 'bg-yellow-500' },
        { alt: 'Placeholder 4', bg: 'bg-red-500' },
        { alt: 'Placeholder 5', bg: 'bg-purple-500' },
      ],
    },
    template: `
      <div class="w-full max-w-lg mx-auto px-12">
        <sng-carousel label="Image gallery">
          <sng-carousel-content>
            @for (img of images; track img.alt) {
              <sng-carousel-item>
                <div class="p-1">
                  <div [class]="img.bg + ' flex aspect-video items-center justify-center rounded-lg text-white text-lg font-medium'">
                    {{ img.alt }}
                  </div>
                </div>
              </sng-carousel-item>
            }
          </sng-carousel-content>
          <sng-carousel-previous></sng-carousel-previous>
          <sng-carousel-next></sng-carousel-next>
        </sng-carousel>
      </div>
    `,
  }),
};

/**
 * Card carousel with content.
 */
export const CardCarousel: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngCarousel, SngCarouselContent, SngCarouselItem, SngCarouselPrevious, SngCarouselNext],
    },
    props: {
      cards: [
        { title: 'Card 1', desc: 'This is the first card with some content.' },
        { title: 'Card 2', desc: 'Second card has different information.' },
        { title: 'Card 3', desc: 'Third card completes the carousel.' },
        { title: 'Card 4', desc: 'Fourth card with more content here.' },
      ],
    },
    template: `
      <div class="w-full max-w-md mx-auto px-12">
        <sng-carousel>
          <sng-carousel-content>
            @for (card of cards; track card.title) {
              <sng-carousel-item>
                <div class="p-1">
                  <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h3 class="text-lg font-semibold mb-2">{{ card.title }}</h3>
                    <p class="text-sm text-muted-foreground">{{ card.desc }}</p>
                  </div>
                </div>
              </sng-carousel-item>
            }
          </sng-carousel-content>
          <sng-carousel-previous></sng-carousel-previous>
          <sng-carousel-next></sng-carousel-next>
        </sng-carousel>
      </div>
    `,
  }),
};

/**
 * Carousel without navigation buttons.
 */
export const NoButtons: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngCarousel, SngCarouselContent, SngCarouselItem],
    },
    props: { slides: [1, 2, 3, 4, 5] },
    template: `
      <div class="w-full max-w-xs mx-auto">
        <sng-carousel>
          <sng-carousel-content>
            @for (slide of slides; track slide) {
              <sng-carousel-item>
                <div class="p-1">
                  <div class="flex aspect-square items-center justify-center rounded-lg border border-border bg-muted p-6">
                    <span class="text-3xl font-semibold">{{ slide }}</span>
                  </div>
                </div>
              </sng-carousel-item>
            }
          </sng-carousel-content>
        </sng-carousel>
        <p class="text-center text-xs text-muted-foreground mt-2">Use arrow keys or drag to navigate</p>
      </div>
    `,
  }),
};
