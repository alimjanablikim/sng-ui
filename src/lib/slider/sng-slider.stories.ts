import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngSlider } from './sng-slider';

const meta: Meta<SngSlider> = {
  title: 'UI/Slider',
  component: SngSlider,
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum value of the slider',
    },
    max: {
      control: 'number',
      description: 'Maximum value of the slider',
    },
    step: {
      control: 'number',
      description: 'Step increment for the slider',
    },
    value: {
      control: 'number',
      description: 'Current value of the slider',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the slider track',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled',
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-slider ${argsToTemplate(args)} />`,
  }),
};

export default meta;
type Story = StoryObj<SngSlider>;

/**
 * Default slider with standard range (0-100).
 */
export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    orientation: 'horizontal',
    disabled: false,
  },
};

/**
 * Slider at minimum value.
 */
export const Minimum: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    orientation: 'horizontal',
    disabled: false,
  },
};

/**
 * Slider at maximum value.
 */
export const Maximum: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 100,
    orientation: 'horizontal',
    disabled: false,
  },
};

/**
 * Slider with step increment of 10.
 */
export const WithStep: Story = {
  args: {
    min: 0,
    max: 100,
    step: 10,
    value: 50,
    orientation: 'horizontal',
    disabled: false,
  },
};

/**
 * Disabled slider.
 */
export const Disabled: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    orientation: 'horizontal',
    disabled: true,
  },
};

/**
 * Vertical orientation.
 */
export const Vertical: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    orientation: 'vertical',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="h-48 flex items-center justify-center">
        <sng-slider ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

/**
 * Slider with custom range (-50 to 50).
 */
export const CustomRange: Story = {
  args: {
    min: -50,
    max: 50,
    step: 5,
    value: 0,
    orientation: 'horizontal',
    disabled: false,
  },
};

/**
 * Volume control example with label.
 */
export const VolumeControl: Story = {
  render: () => ({
    props: { volume: 70 },
    template: `
      <div class="w-64 space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium">Volume</label>
          <span class="text-sm text-muted-foreground">{{ volume }}%</span>
        </div>
        <sng-slider [(value)]="volume" [min]="0" [max]="100" [step]="1" />
      </div>
    `,
  }),
};

/**
 * Temperature control with visual indicator.
 */
export const TemperatureControl: Story = {
  render: () => ({
    props: { temperature: 22 },
    template: `
      <div class="w-72 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Temperature</span>
          <span class="text-2xl font-bold">{{ temperature }}°C</span>
        </div>
        <sng-slider [(value)]="temperature" [min]="16" [max]="30" [step]="1" />
        <div class="flex justify-between text-xs text-muted-foreground">
          <span>16°C</span>
          <span>30°C</span>
        </div>
      </div>
    `,
  }),
};
