import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngSeparator } from './sng-separator';

/**
 * Separator creates visual distinction between content sections.
 *
 * Uses semantic `role="separator"` for accessibility. Supports horizontal and vertical orientations.
 */
const meta: Meta<SngSeparator> = {
  title: 'UI/Separator',
  component: SngSeparator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the separator line',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
      },
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes to merge with default styles',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-separator ${argsToTemplate(args)} />`,
  }),
};

export default meta;
type Story = StoryObj<SngSeparator>;

/**
 * Default horizontal separator - full width with 1px height.
 */
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => ({
    props: args,
    template: `
      <div>
        <div style="padding: 16px;">Content above separator</div>
        <sng-separator ${argsToTemplate(args)} />
        <div style="padding: 16px;">Content below separator</div>
      </div>
    `,
  }),
};

/**
 * Vertical separator - requires explicit height on container.
 */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; height: 48px; align-items: center; gap: 16px;">
        <span>Left</span>
        <sng-separator ${argsToTemplate(args)} />
        <span>Right</span>
      </div>
    `,
  }),
};

/**
 * Separator with custom margin using class input.
 */
export const WithCustomMargin: Story = {
  args: {
    orientation: 'horizontal',
    class: 'my-6',
  },
  render: (args) => ({
    props: args,
    template: `
      <div>
        <div style="padding: 8px;">Content above separator</div>
        <sng-separator ${argsToTemplate(args)} />
        <div style="padding: 8px;">Content below separator</div>
      </div>
    `,
  }),
};

/**
 * Example with labeled sections.
 */
export const BetweenSections: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <h3 style="font-weight: 600; font-size: 18px; margin-bottom: 8px;">Account Settings</h3>
        <p style="color: var(--muted-foreground); font-size: 14px; margin-bottom: 16px;">
          Manage your account preferences.
        </p>
        <sng-separator class="my-4" />
        <h3 style="font-weight: 600; font-size: 18px; margin-bottom: 8px;">Profile</h3>
        <p style="color: var(--muted-foreground); font-size: 14px;">
          Update your public profile information.
        </p>
      </div>
    `,
  }),
};
