import { type Meta, type StoryObj } from '@storybook/angular';
import { SngHoverCard } from './sng-hover-card';
import { SngHoverCardTrigger } from './sng-hover-card-trigger';
import { SngHoverCardContent } from './sng-hover-card-content';

const meta: Meta<SngHoverCard> = {
  title: 'UI/HoverCard',
  component: SngHoverCard,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Position of the hover card',
    },
    openDelay: {
      control: 'number',
      description: 'Delay in ms before opening',
    },
    closeDelay: {
      control: 'number',
      description: 'Delay in ms before closing',
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<SngHoverCard>;

/**
 * Default hover card with user profile preview.
 */
export const Default: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngHoverCard, SngHoverCardTrigger, SngHoverCardContent],
    },
    template: `
      <div class="flex items-center justify-center h-64">
        <sng-hover-card>
          <sng-hover-card-trigger href="#" class="text-primary hover:underline font-medium">
            @shadcn
          </sng-hover-card-trigger>
          <sng-hover-card-content class="w-80">
            <div class="flex gap-4">
              <div class="rounded-full bg-muted h-12 w-12 flex items-center justify-center text-lg font-semibold">
                S
              </div>
              <div class="space-y-1">
                <h4 class="text-sm font-semibold">@shadcn</h4>
                <p class="text-sm text-muted-foreground">
                  The creator of shadcn/ui and design engineer.
                </p>
                <div class="flex items-center gap-4 pt-2">
                  <div class="flex items-center gap-1 text-xs text-muted-foreground">
                    <span class="font-semibold text-foreground">1.2k</span> Following
                  </div>
                  <div class="flex items-center gap-1 text-xs text-muted-foreground">
                    <span class="font-semibold text-foreground">15.4k</span> Followers
                  </div>
                </div>
              </div>
            </div>
          </sng-hover-card-content>
        </sng-hover-card>
      </div>
    `,
  }),
};

/**
 * Hover card positioned on top.
 */
export const TopPosition: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngHoverCard, SngHoverCardTrigger, SngHoverCardContent],
    },
    template: `
      <div class="flex items-end justify-center h-64">
        <sng-hover-card side="top">
          <sng-hover-card-trigger href="#" class="text-primary hover:underline font-medium">
            Hover for top card
          </sng-hover-card-trigger>
          <sng-hover-card-content>
            <p class="text-sm">This hover card appears above the trigger.</p>
          </sng-hover-card-content>
        </sng-hover-card>
      </div>
    `,
  }),
};

/**
 * Hover card positioned on the left.
 */
export const LeftPosition: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngHoverCard, SngHoverCardTrigger, SngHoverCardContent],
    },
    template: `
      <div class="flex items-center justify-end h-64 pr-8">
        <sng-hover-card side="left">
          <sng-hover-card-trigger href="#" class="text-primary hover:underline font-medium">
            Hover for left card
          </sng-hover-card-trigger>
          <sng-hover-card-content>
            <p class="text-sm">This hover card appears to the left of the trigger.</p>
          </sng-hover-card-content>
        </sng-hover-card>
      </div>
    `,
  }),
};

/**
 * Hover card positioned on the right.
 */
export const RightPosition: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngHoverCard, SngHoverCardTrigger, SngHoverCardContent],
    },
    template: `
      <div class="flex items-center justify-start h-64 pl-8">
        <sng-hover-card side="right">
          <sng-hover-card-trigger href="#" class="text-primary hover:underline font-medium">
            Hover for right card
          </sng-hover-card-trigger>
          <sng-hover-card-content>
            <p class="text-sm">This hover card appears to the right of the trigger.</p>
          </sng-hover-card-content>
        </sng-hover-card>
      </div>
    `,
  }),
};

/**
 * Hover card with custom delays.
 */
export const CustomDelays: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngHoverCard, SngHoverCardTrigger, SngHoverCardContent],
    },
    template: `
      <div class="flex items-center justify-center gap-8 h-64">
        <sng-hover-card [openDelay]="0" [closeDelay]="100">
          <sng-hover-card-trigger href="#" class="text-primary hover:underline font-medium">
            Fast open (0ms)
          </sng-hover-card-trigger>
          <sng-hover-card-content>
            <p class="text-sm">Opens immediately, closes quickly.</p>
          </sng-hover-card-content>
        </sng-hover-card>

        <sng-hover-card [openDelay]="500" [closeDelay]="500">
          <sng-hover-card-trigger href="#" class="text-primary hover:underline font-medium">
            Slow open (500ms)
          </sng-hover-card-trigger>
          <sng-hover-card-content>
            <p class="text-sm">Takes 500ms to open and close.</p>
          </sng-hover-card-content>
        </sng-hover-card>
      </div>
    `,
  }),
};

/**
 * Hover card on a button trigger.
 */
export const OnButton: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngHoverCard, SngHoverCardTrigger, SngHoverCardContent],
    },
    template: `
      <div class="flex items-center justify-center h-64">
        <sng-hover-card>
          <sng-hover-card-trigger
            class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Hover this button
          </sng-hover-card-trigger>
          <sng-hover-card-content class="w-72">
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">Button Info</h4>
              <p class="text-sm text-muted-foreground">
                Additional context or help text that appears when hovering over this button.
              </p>
            </div>
          </sng-hover-card-content>
        </sng-hover-card>
      </div>
    `,
  }),
};

/**
 * Hover card with rich content.
 */
export const RichContent: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngHoverCard, SngHoverCardTrigger, SngHoverCardContent],
    },
    template: `
      <div class="flex items-center justify-center h-64">
        <sng-hover-card>
          <sng-hover-card-trigger href="#" class="text-primary hover:underline font-medium">
            View product details
          </sng-hover-card-trigger>
          <sng-hover-card-content class="w-80">
            <div class="space-y-3">
              <div class="aspect-video bg-muted rounded-md flex items-center justify-center">
                <span class="text-muted-foreground text-sm">Product Image</span>
              </div>
              <div>
                <h4 class="text-sm font-semibold">Premium Widget</h4>
                <p class="text-sm text-muted-foreground">
                  A high-quality widget with advanced features.
                </p>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">$99.99</span>
                <span class="text-muted-foreground">In stock</span>
              </div>
            </div>
          </sng-hover-card-content>
        </sng-hover-card>
      </div>
    `,
  }),
};
