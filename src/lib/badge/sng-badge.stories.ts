import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngBadge } from './sng-badge';

/**
 * Badge displays a small status descriptor for labels, categories, counts, or status indicators.
 * Customize colors and sizes via class input.
 */
const meta: Meta<SngBadge> = {
  title: 'UI/Badge',
  component: SngBadge,
  tags: ['autodocs'],
  argTypes: {
    class: {
      control: 'text',
      description: 'Custom CSS classes for colors, sizing, etc.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-badge ${argsToTemplate(args)}>Badge</sng-badge>`,
  }),
};

export default meta;
type Story = StoryObj<SngBadge>;

/** Default badge style - primary colored. */
export const Default: Story = {};

/** Secondary style - muted background. */
export const Secondary: Story = {
  args: {
    class: 'bg-secondary text-secondary-foreground',
  },
};

/** Outline style - transparent with border. */
export const Outline: Story = {
  args: {
    class: 'bg-transparent text-foreground',
  },
};

/** Destructive style - for errors or warnings. */
export const Destructive: Story = {
  args: {
    class: 'bg-destructive text-white',
  },
  render: (args) => ({
    props: args,
    template: `<sng-badge ${argsToTemplate(args)}>Error</sng-badge>`,
  }),
};

/** Small badge for compact areas. */
export const Small: Story = {
  args: {
    class: 'px-1.5 py-0 text-[10px]',
  },
  render: (args) => ({
    props: args,
    template: `<sng-badge ${argsToTemplate(args)}>Small</sng-badge>`,
  }),
};

/** Large badge for prominence. */
export const Large: Story = {
  args: {
    class: 'px-2.5 py-1 text-sm',
  },
  render: (args) => ({
    props: args,
    template: `<sng-badge ${argsToTemplate(args)}>Large</sng-badge>`,
  }),
};

/** Badge with icon. */
export const WithIcon: Story = {
  args: {
    class: 'bg-secondary text-secondary-foreground',
  },
  render: (args) => ({
    props: args,
    template: `
      <sng-badge ${argsToTemplate(args)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        Featured
      </sng-badge>
    `,
  }),
};

/** Style variations using class. */
export const StyleVariations: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <sng-badge>Default</sng-badge>
        <sng-badge class="bg-secondary text-secondary-foreground">Secondary</sng-badge>
        <sng-badge class="bg-transparent text-foreground">Outline</sng-badge>
        <sng-badge class="bg-destructive text-white">Destructive</sng-badge>
      </div>
    `,
  }),
};

/** Size variations using class. */
export const SizeVariations: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <sng-badge class="px-1.5 py-0 text-[10px]">Small</sng-badge>
        <sng-badge>Default</sng-badge>
        <sng-badge class="px-2.5 py-1 text-sm">Large</sng-badge>
      </div>
    `,
  }),
};

/** Custom colors via class. */
export const CustomColors: Story = {
  args: {
    class: 'bg-green-500 text-white',
  },
  render: (args) => ({
    props: args,
    template: `<sng-badge ${argsToTemplate(args)}>Success</sng-badge>`,
  }),
};
