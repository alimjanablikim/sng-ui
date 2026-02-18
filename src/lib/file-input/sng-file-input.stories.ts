import type { Meta, StoryObj } from '@storybook/angular';
import { SngFileInput } from './sng-file-input';

/**
 * File input component with button and dropzone modes.
 *
 * Use `dropzone` attribute for drag & drop mode, or default button mode for simple file selection.
 */
const meta: Meta<SngFileInput> = {
  title: 'UI/File Input',
  component: SngFileInput,
  tags: ['autodocs'],
  argTypes: {
    dropzone: {
      control: 'boolean',
      description: 'Enable dropzone mode for drag & drop',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    accept: {
      control: 'text',
      description: 'Accepted file types (e.g., ".jpg,.png" or "image/*")',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    showFileList: {
      control: 'boolean',
      description: 'Show list of selected files',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<SngFileInput>;

/**
 * Simple file input with button mode.
 */
export const Default: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-file-input />
      </div>
    `,
  }),
};

/**
 * File input with dropzone mode for drag & drop.
 */
export const Dropzone: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-file-input dropzone />
      </div>
    `,
  }),
};

/**
 * File input that accepts multiple files.
 */
export const Multiple: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-file-input dropzone multiple />
      </div>
    `,
  }),
};

/**
 * File input that only accepts images.
 */
export const ImagesOnly: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-file-input dropzone accept="image/*" />
      </div>
    `,
  }),
};

/**
 * Disabled file input.
 */
export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-file-input dropzone disabled />
      </div>
    `,
  }),
};

/**
 * File input without file list display.
 */
export const NoFileList: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-file-input dropzone multiple [showFileList]="false" />
      </div>
    `,
  }),
};

/**
 * Button mode with specific file types.
 */
export const ButtonModeWithAccept: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-file-input accept=".pdf,.doc,.docx" multiple />
      </div>
    `,
  }),
};
