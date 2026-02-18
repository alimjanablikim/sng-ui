import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngButton } from './sng-button';

/**
 * Button component for user interactions.
 *
 * Style buttons using Tailwind classes via the `class` input.
 * Uses Angular Signals for reactive inputs.
 *
 * Style patterns:
 * - Default: bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
 * - Destructive: bg-destructive text-white hover:bg-destructive/90
 * - Outline: border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground
 * - Secondary: bg-secondary text-secondary-foreground hover:bg-secondary/80
 * - Ghost: hover:bg-accent hover:text-accent-foreground
 * - Link: text-primary underline-offset-4 hover:underline
 *
 * Size patterns:
 * - Small: h-8 px-3 text-xs
 * - Default: h-9 px-4 text-sm (built-in)
 * - Large: h-10 px-6 text-base
 * - Icon: size-9 p-0
 */
const meta: Meta<SngButton> = {
  title: 'UI/Button',
  component: SngButton,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button shows a loading spinner',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes for styling. See style patterns in component docs.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-button ${argsToTemplate(args)}>Button</sng-button>`,
  }),
};

export default meta;
type Story = StoryObj<SngButton>;

/**
 * The default button style - primary colored with dark background in light mode.
 * Classes: bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
 */
export const Default: Story = {
  args: {
    class: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
  },
};

/**
 * Destructive button for dangerous actions like delete operations.
 * Classes: bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60
 */
export const Destructive: Story = {
  args: {
    class: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
  },
  render: (args) => ({
    props: args,
    template: `<sng-button ${argsToTemplate(args)}>Delete</sng-button>`,
  }),
};

/**
 * Outline button with border and transparent background.
 * Classes: border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50
 */
export const Outline: Story = {
  args: {
    class: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
  },
  render: (args) => ({
    props: args,
    template: `<sng-button ${argsToTemplate(args)}>Cancel</sng-button>`,
  }),
};

/**
 * Secondary button with muted styling for less prominent actions.
 * Classes: bg-secondary text-secondary-foreground hover:bg-secondary/80
 */
export const Secondary: Story = {
  args: {
    class: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  },
};

/**
 * Ghost button with transparent background, showing background on hover.
 * Classes: hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50
 */
export const Ghost: Story = {
  args: {
    class: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
  },
};

/**
 * Link button that looks like a text link with underline on hover.
 * Classes: text-primary underline-offset-4 hover:underline
 */
export const Link: Story = {
  args: {
    class: 'text-primary underline-offset-4 hover:underline',
  },
  render: (args) => ({
    props: args,
    template: `<sng-button ${argsToTemplate(args)}>Learn more</sng-button>`,
  }),
};

/**
 * Small button variant for compact UI areas.
 * Size classes: h-8 px-3 text-xs
 */
export const Small: Story = {
  args: {
    class: 'h-8 px-3 text-xs bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
  },
  render: (args) => ({
    props: args,
    template: `<sng-button ${argsToTemplate(args)}>Small</sng-button>`,
  }),
};

/**
 * Large button variant for prominent CTAs.
 * Size classes: h-10 px-6 text-base
 */
export const Large: Story = {
  args: {
    class: 'h-10 px-6 text-base bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
  },
  render: (args) => ({
    props: args,
    template: `<sng-button ${argsToTemplate(args)}>Large</sng-button>`,
  }),
};

/**
 * Icon-only button, typically square for toolbar actions.
 * Size classes: size-9 p-0
 */
export const Icon: Story = {
  args: {
    class: 'size-9 p-0 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
  },
  render: (args) => ({
    props: args,
    template: `
      <sng-button ${argsToTemplate(args)} aria-label="Add">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/>
          <path d="M12 5v14"/>
        </svg>
      </sng-button>
    `,
  }),
};

/**
 * Button with loading spinner - disables interaction and shows spinner.
 */
export const Loading: Story = {
  args: {
    class: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
    loading: true,
  },
  render: (args) => ({
    props: args,
    template: `<sng-button ${argsToTemplate(args)}>Loading...</sng-button>`,
  }),
};

/**
 * Disabled button state.
 */
export const Disabled: Story = {
  args: {
    class: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
    disabled: true,
  },
};

/**
 * All button styles displayed together for comparison.
 */
export const AllStyles: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
        <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">Default</sng-button>
        <sng-button class="bg-destructive text-white hover:bg-destructive/90">Destructive</sng-button>
        <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Outline</sng-button>
        <sng-button class="bg-secondary text-secondary-foreground hover:bg-secondary/80">Secondary</sng-button>
        <sng-button class="hover:bg-accent hover:text-accent-foreground">Ghost</sng-button>
        <sng-button class="text-primary underline-offset-4 hover:underline">Link</sng-button>
      </div>
    `,
  }),
};

/**
 * All button sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
        <sng-button class="h-8 px-3 text-xs bg-primary text-primary-foreground">Small</sng-button>
        <sng-button class="bg-primary text-primary-foreground">Default</sng-button>
        <sng-button class="h-10 px-6 text-base bg-primary text-primary-foreground">Large</sng-button>
        <sng-button class="size-9 p-0 bg-primary text-primary-foreground" aria-label="Add">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
          </svg>
        </sng-button>
      </div>
    `,
  }),
};

/**
 * Button used as an anchor link.
 */
export const AsLink: Story = {
  render: () => ({
    template: `<sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" href="#">Link Button</sng-button>`,
  }),
};
