import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngInput } from './sng-input';

/**
 * Standard input component for text, email, password, number, and other basic input types.
 *
 * For specialized inputs, use dedicated components:
 * - OTP: `<sng-otp-input>` (UI/OTP Input)
 * - File upload: `<sng-file-input>` (UI/File Input)
 * - Search with dropdown: `<sng-search-input>` (UI/Search Input)
 */
const meta: Meta<SngInput> = {
  title: 'UI/Input',
  component: SngInput,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'],
      description: 'Input type',
      table: {
        type: { summary: 'SngInputType' },
        defaultValue: { summary: 'text' },
      },
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes. Use Tailwind classes to control size.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-input ${argsToTemplate(args)} placeholder="Enter text..." />`,
  }),
};

export default meta;
type Story = StoryObj<SngInput>;

/**
 * Default input with standard height.
 */
export const Default: Story = {
  args: {},
};

/**
 * Small input variant for compact UIs.
 */
export const Small: Story = {
  args: {
    class: 'h-8 text-xs px-2.5',
  },
  render: (args) => ({
    props: args,
    template: `<sng-input ${argsToTemplate(args)} placeholder="Small input" />`,
  }),
};

/**
 * Large input variant for prominent forms.
 */
export const Large: Story = {
  args: {
    class: 'h-10 text-base px-4',
  },
  render: (args) => ({
    props: args,
    template: `<sng-input ${argsToTemplate(args)} placeholder="Large input" />`,
  }),
};

/**
 * Email input type.
 */
export const Email: Story = {
  render: () => ({
    template: `<sng-input type="email" placeholder="email@example.com" />`,
  }),
};

/**
 * Password input type.
 */
export const Password: Story = {
  render: () => ({
    template: `<sng-input type="password" placeholder="Enter password" />`,
  }),
};

/**
 * Number input type.
 */
export const Number: Story = {
  render: () => ({
    template: `<sng-input type="number" placeholder="0" />`,
  }),
};

/**
 * Disabled input state.
 */
export const Disabled: Story = {
  render: () => ({
    template: `<sng-input placeholder="Disabled input" disabled />`,
  }),
};

/**
 * Input with validation error (aria-invalid).
 */
export const WithError: Story = {
  render: () => ({
    template: `<sng-input placeholder="Invalid input" aria-invalid="true" />`,
  }),
};

/**
 * Input with label.
 */
export const WithLabel: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 6px; max-width: 300px;">
        <label for="email" class="text-sm font-medium leading-none">Email</label>
        <sng-input id="email" type="email" placeholder="email@example.com" />
      </div>
    `,
  }),
};

/**
 * All input sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 300px;">
        <div>
          <p style="font-size: 12px; color: gray; margin-bottom: 4px;">Small (h-8)</p>
          <sng-input class="h-8 text-xs px-2.5" placeholder="Small" />
        </div>
        <div>
          <p style="font-size: 12px; color: gray; margin-bottom: 4px;">Default (h-9)</p>
          <sng-input placeholder="Default" />
        </div>
        <div>
          <p style="font-size: 12px; color: gray; margin-bottom: 4px;">Large (h-10)</p>
          <sng-input class="h-10 text-base px-4" placeholder="Large" />
        </div>
      </div>
    `,
  }),
};

/**
 * Date input type.
 */
export const DateInput: Story = {
  render: () => ({
    template: `<sng-input type="date" />`,
  }),
};

/**
 * Time input type.
 */
export const TimeInput: Story = {
  render: () => ({
    template: `<sng-input type="time" />`,
  }),
};

/**
 * Search input type (basic, no dropdown).
 * For search with dropdown results, use SngSearchInput instead.
 */
export const SearchBasic: Story = {
  render: () => ({
    template: `<sng-input type="search" placeholder="Search..." />`,
  }),
};
