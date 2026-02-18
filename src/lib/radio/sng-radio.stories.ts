import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { SngRadio } from './sng-radio';
import { SngRadioItem } from './sng-radio-item';

const meta: Meta<SngRadio> = {
  title: 'UI/Radio',
  component: SngRadio,
  decorators: [
    moduleMetadata({
      imports: [SngRadioItem],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Selected value',
    },
    name: {
      control: 'text',
      description: 'Group name for form submission',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the entire group',
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<SngRadio>;

/**
 * Default radio group with three options.
 */
export const Default: Story = {
  render: (args) => ({
    props: { ...args, selected: 'option1' },
    template: `
      <sng-radio [(value)]="selected" ${argsToTemplate(args)}>
        <div class="flex items-center space-x-2">
          <sng-radio-item value="option1" />
          <label class="text-sm">Option 1</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio-item value="option2" />
          <label class="text-sm">Option 2</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio-item value="option3" />
          <label class="text-sm">Option 3</label>
        </div>
      </sng-radio>
      <p class="mt-4 text-sm text-muted-foreground">Selected: {{ selected }}</p>
    `,
  }),
};

/**
 * Radio group with no initial selection.
 */
export const NoSelection: Story = {
  render: (args) => ({
    props: { ...args, selected: '' },
    template: `
      <sng-radio [(value)]="selected">
        <div class="flex items-center space-x-2">
          <sng-radio-item value="small" />
          <label class="text-sm">Small</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio-item value="medium" />
          <label class="text-sm">Medium</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio-item value="large" />
          <label class="text-sm">Large</label>
        </div>
      </sng-radio>
    `,
  }),
};

/**
 * Disabled radio group.
 */
export const Disabled: Story = {
  render: () => ({
    props: { selected: 'option1' },
    template: `
      <sng-radio [(value)]="selected" [disabled]="true">
        <div class="flex items-center space-x-2">
          <sng-radio-item value="option1" />
          <label class="text-sm opacity-50">Option 1</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio-item value="option2" />
          <label class="text-sm opacity-50">Option 2</label>
        </div>
      </sng-radio>
    `,
  }),
};

/**
 * Radio group with individual disabled item.
 */
export const DisabledItem: Story = {
  render: () => ({
    props: { selected: '' },
    template: `
      <sng-radio [(value)]="selected">
        <div class="flex items-center space-x-2">
          <sng-radio-item value="free" />
          <label class="text-sm">Free Plan</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio-item value="pro" />
          <label class="text-sm">Pro Plan</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio-item value="enterprise" [disabled]="true" />
          <label class="text-sm opacity-50">Enterprise (Coming Soon)</label>
        </div>
      </sng-radio>
    `,
  }),
};

/**
 * Horizontal radio group.
 */
export const Horizontal: Story = {
  render: () => ({
    props: { selected: 'medium' },
    template: `
      <sng-radio [(value)]="selected" class="flex flex-row gap-6">
        <div class="flex items-center space-x-2">
          <sng-radio-item value="small" />
          <label class="text-sm">S</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio-item value="medium" />
          <label class="text-sm">M</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio-item value="large" />
          <label class="text-sm">L</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio-item value="xlarge" />
          <label class="text-sm">XL</label>
        </div>
      </sng-radio>
    `,
  }),
};

/**
 * Radio group with descriptions.
 */
export const WithDescriptions: Story = {
  render: () => ({
    props: { selected: 'comfortable' },
    template: `
      <sng-radio [(value)]="selected" class="gap-4">
        <div class="flex items-start space-x-3">
          <sng-radio-item value="default" class="mt-0.5" />
          <div>
            <label class="text-sm font-medium">Default</label>
            <p class="text-sm text-muted-foreground">Standard spacing for most use cases.</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <sng-radio-item value="comfortable" class="mt-0.5" />
          <div>
            <label class="text-sm font-medium">Comfortable</label>
            <p class="text-sm text-muted-foreground">More padding for easier interaction.</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <sng-radio-item value="compact" class="mt-0.5" />
          <div>
            <label class="text-sm font-medium">Compact</label>
            <p class="text-sm text-muted-foreground">Minimal spacing for dense layouts.</p>
          </div>
        </div>
      </sng-radio>
    `,
  }),
};

/**
 * Different radio sizes using class input.
 */
export const Sizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div class="space-y-4">
        <div class="flex items-center space-x-2">
          <sng-radio value="sm">
            <sng-radio-item value="sm" class="size-4" />
          </sng-radio>
          <label class="text-sm">Small (size-4)</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio value="default">
            <sng-radio-item value="default" />
          </sng-radio>
          <label class="text-sm">Default (size-5)</label>
        </div>
        <div class="flex items-center space-x-2">
          <sng-radio value="lg">
            <sng-radio-item value="lg" class="size-6" />
          </sng-radio>
          <label class="text-sm">Large (size-6)</label>
        </div>
      </div>
    `,
  }),
};
