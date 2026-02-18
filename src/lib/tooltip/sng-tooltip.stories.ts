import { type Meta, type StoryObj } from '@storybook/angular';
import { SngTooltip } from './sng-tooltip';

const meta: Meta<SngTooltip> = {
  title: 'UI/Tooltip',
  component: SngTooltip,
  tags: ['autodocs'],
  argTypes: {
    sngTooltip: {
      control: 'text',
      description: 'Tooltip text content',
    },
    sngTooltipPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Position of the tooltip',
    },
    sngTooltipClass: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<SngTooltip>;

/**
 * Default tooltip appearing on top.
 */
export const Default: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTooltip],
    },
    template: `
      <div class="flex items-center justify-center h-32">
        <button
          [sngTooltip]="'This is a tooltip'"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Hover me
        </button>
      </div>
    `,
  }),
};

/**
 * Tooltip positioned at the bottom.
 */
export const Bottom: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTooltip],
    },
    template: `
      <div class="flex items-center justify-center h-32">
        <button
          [sngTooltip]="'Tooltip at bottom'"
          sngTooltipPosition="bottom"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Bottom tooltip
        </button>
      </div>
    `,
  }),
};

/**
 * Tooltip positioned on the left.
 */
export const Left: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTooltip],
    },
    template: `
      <div class="flex items-center justify-center h-32">
        <button
          [sngTooltip]="'Tooltip on left'"
          sngTooltipPosition="left"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Left tooltip
        </button>
      </div>
    `,
  }),
};

/**
 * Tooltip positioned on the right.
 */
export const Right: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTooltip],
    },
    template: `
      <div class="flex items-center justify-center h-32">
        <button
          [sngTooltip]="'Tooltip on right'"
          sngTooltipPosition="right"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Right tooltip
        </button>
      </div>
    `,
  }),
};

/**
 * All tooltip positions comparison.
 */
export const AllPositions: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTooltip],
    },
    template: `
      <div class="flex flex-wrap items-center justify-center gap-8 p-16">
        <button
          [sngTooltip]="'Top tooltip'"
          sngTooltipPosition="top"
          class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
        >
          Top
        </button>
        <button
          [sngTooltip]="'Bottom tooltip'"
          sngTooltipPosition="bottom"
          class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
        >
          Bottom
        </button>
        <button
          [sngTooltip]="'Left tooltip'"
          sngTooltipPosition="left"
          class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
        >
          Left
        </button>
        <button
          [sngTooltip]="'Right tooltip'"
          sngTooltipPosition="right"
          class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
        >
          Right
        </button>
      </div>
    `,
  }),
};

/**
 * Tooltip on icon buttons.
 */
export const IconButtons: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTooltip],
    },
    template: `
      <div class="flex items-center justify-center gap-4 h-32">
        <button
          [sngTooltip]="'Bold'"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h8a4 4 0 100-8H6v8zm0 0h8a4 4 0 110 8H6v-8z" />
          </svg>
        </button>
        <button
          [sngTooltip]="'Italic'"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l-4 4 4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
        <button
          [sngTooltip]="'Underline'"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19h16M6 3v8a6 6 0 1012 0V3" />
          </svg>
        </button>
      </div>
    `,
  }),
};

/**
 * Tooltip with longer text content.
 */
export const LongText: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTooltip],
    },
    template: `
      <div class="flex items-center justify-center h-32">
        <button
          [sngTooltip]="'This is a tooltip with longer text content that wraps nicely'"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Longer tooltip
        </button>
      </div>
    `,
  }),
};

/**
 * Tooltip on disabled-looking element (still interactive for a11y).
 */
export const OnDisabledStyle: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTooltip],
    },
    template: `
      <div class="flex items-center justify-center h-32">
        <span
          [sngTooltip]="'This action is currently unavailable'"
          tabindex="0"
          class="inline-flex h-9 items-center justify-center rounded-md bg-muted px-4 text-sm font-medium text-muted-foreground cursor-not-allowed"
        >
          Disabled action
        </span>
      </div>
    `,
  }),
};
