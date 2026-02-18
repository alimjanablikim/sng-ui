import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngCheckbox } from './sng-checkbox';

/**
 * Checkbox is a control that allows users to select one or more items from a set.
 *
 * Size is controlled via Tailwind classes: size-4 (small), size-5 (default), size-6 (large).
 */
const meta: Meta<SngCheckbox> = {
  title: 'UI/Checkbox',
  component: SngCheckbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in indeterminate state',
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes. Use Tailwind size classes: size-4 (sm), size-5 (default), size-6 (lg).',
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-checkbox ${argsToTemplate(args)} />`,
  }),
};

export default meta;
type Story = StoryObj<SngCheckbox>;

/**
 * Default unchecked checkbox.
 */
export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
  },
};

/**
 * Checkbox in checked state.
 */
export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
    indeterminate: false,
  },
};

/**
 * Checkbox in indeterminate state (shows minus icon).
 */
export const Indeterminate: Story = {
  args: {
    checked: false,
    disabled: false,
    indeterminate: true,
  },
};

/**
 * Disabled checkbox (unchecked).
 */
export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    indeterminate: false,
  },
};

/**
 * Disabled checkbox (checked).
 */
export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    indeterminate: false,
  },
};

/**
 * Small size variant.
 */
export const Small: Story = {
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    class: 'size-4',
  },
};

/**
 * Large size variant.
 */
export const Large: Story = {
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    class: 'size-6',
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
          <sng-checkbox class="size-4" [checked]="true" />
          <span class="text-xs text-muted-foreground">Small</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <sng-checkbox [checked]="true" />
          <span class="text-xs text-muted-foreground">Default</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <sng-checkbox class="size-6" [checked]="true" />
          <span class="text-xs text-muted-foreground">Large</span>
        </div>
      </div>
    `,
  }),
};

/**
 * All states comparison.
 */
export const AllStates: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <sng-checkbox />
          <span class="text-xs text-muted-foreground">Unchecked</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <sng-checkbox [checked]="true" />
          <span class="text-xs text-muted-foreground">Checked</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <sng-checkbox [indeterminate]="true" />
          <span class="text-xs text-muted-foreground">Indeterminate</span>
        </div>
      </div>
    `,
  }),
};

/**
 * Checkbox with label showing typical usage.
 */
export const WithLabel: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-3">
        <sng-checkbox id="terms" />
        <label for="terms" class="text-sm font-medium cursor-pointer">
          Accept terms and conditions
        </label>
      </div>
    `,
  }),
};
