import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngSwitch } from './sng-switch';

/**
 * Switch is a control that allows users to turn an option on or off.
 *
 * Size is controlled via Tailwind classes: h-4 w-7 (small), h-5 w-9 (default), h-6 w-11 (large).
 */
const meta: Meta<SngSwitch> = {
  title: 'UI/Switch',
  component: SngSwitch,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is checked/on',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes. Use Tailwind classes to control size: h-4 w-7 (sm), h-5 w-9 (default), h-6 w-11 (lg).',
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-switch ${argsToTemplate(args)} />`,
  }),
};

export default meta;
type Story = StoryObj<SngSwitch>;

/**
 * Default switch in unchecked state.
 */
export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};

/**
 * Switch in checked state.
 */
export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
  },
};

/**
 * Disabled switch (unchecked).
 */
export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

/**
 * Disabled switch (checked).
 */
export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

/**
 * Small size variant.
 */
export const Small: Story = {
  args: {
    checked: false,
    disabled: false,
    class: 'h-4 w-7',
  },
};

/**
 * Large size variant.
 */
export const Large: Story = {
  args: {
    checked: false,
    disabled: false,
    class: 'h-6 w-11',
  },
};

/**
 * All size variants comparison.
 */
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <sng-switch class="h-4 w-7" />
          <span class="text-xs text-muted-foreground">Small</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <sng-switch />
          <span class="text-xs text-muted-foreground">Default</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <sng-switch class="h-6 w-11" />
          <span class="text-xs text-muted-foreground">Large</span>
        </div>
      </div>
    `,
  }),
};

/**
 * Switch with label showing typical usage.
 */
export const WithLabel: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-3">
        <sng-switch id="airplane-mode" />
        <label for="airplane-mode" class="text-sm font-medium cursor-pointer">
          Airplane Mode
        </label>
      </div>
    `,
  }),
};
