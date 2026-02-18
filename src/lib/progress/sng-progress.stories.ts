import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngProgress } from './sng-progress';

const meta: Meta<SngProgress> = {
  title: 'UI/Progress',
  component: SngProgress,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-progress ${argsToTemplate(args)} />`,
  }),
};

export default meta;
type Story = StoryObj<SngProgress>;

/**
 * Default progress bar at 33%.
 */
export const Default: Story = {
  args: {
    value: 33,
  },
};

/**
 * Empty progress bar.
 */
export const Empty: Story = {
  args: {
    value: 0,
  },
};

/**
 * Half-filled progress bar.
 */
export const HalfFilled: Story = {
  args: {
    value: 50,
  },
};

/**
 * Full progress bar.
 */
export const Full: Story = {
  args: {
    value: 100,
  },
};

/**
 * Progress bar with custom height.
 */
export const CustomHeight: Story = {
  args: {
    value: 66,
    class: 'h-4',
  },
};

/**
 * Success style progress bar (green).
 */
export const Success: Story = {
  args: {
    value: 80,
    class: 'text-green-500 dark:text-green-400',
  },
};

/**
 * Warning style progress bar (yellow).
 */
export const Warning: Story = {
  args: {
    value: 45,
    class: 'text-yellow-500 dark:text-yellow-400',
  },
};

/**
 * Error/destructive style progress bar (red).
 */
export const Error: Story = {
  args: {
    value: 25,
    class: 'text-destructive',
  },
};

/**
 * Multiple progress bars showing different states.
 */
export const MultipleProgress: Story = {
  render: () => ({
    template: `
      <div class="w-80 space-y-4">
        <div class="space-y-1">
          <div class="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>33%</span>
          </div>
          <sng-progress [value]="33" />
        </div>
        <div class="space-y-1">
          <div class="flex justify-between text-sm">
            <span>Processing</span>
            <span>66%</span>
          </div>
          <sng-progress [value]="66" />
        </div>
        <div class="space-y-1">
          <div class="flex justify-between text-sm">
            <span>Complete</span>
            <span>100%</span>
          </div>
          <sng-progress [value]="100" class="text-green-500" />
        </div>
      </div>
    `,
  }),
};
