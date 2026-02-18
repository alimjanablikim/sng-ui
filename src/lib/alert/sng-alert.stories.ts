import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngAlert } from './sng-alert';
import { SngAlertTitle } from './sng-alert-title';
import { SngAlertDescription } from './sng-alert-description';

/**
 * Alert displays a callout for user attention with title and description.
 *
 * Simple and customizable - apply your own colors via the `class` input.
 */
const meta: Meta<SngAlert> = {
  title: 'UI/Alert',
  component: SngAlert,
  tags: ['autodocs'],
  argTypes: {
    class: {
      control: 'text',
      description: 'Custom CSS classes for styling (e.g., text-destructive)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAlert, SngAlertTitle, SngAlertDescription],
    },
    template: `
      <sng-alert ${argsToTemplate(args)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <sng-alert-title>Heads up!</sng-alert-title>
        <sng-alert-description>
          You can add components and dependencies to your app using the CLI.
        </sng-alert-description>
      </sng-alert>
    `,
  }),
};

export default meta;
type Story = StoryObj<SngAlert>;

/**
 * Default alert for informational messages.
 */
export const Default: Story = {
  args: {},
};

/**
 * Destructive alert for error messages - styled via class.
 */
export const Destructive: Story = {
  args: {
    class: 'text-destructive',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAlert, SngAlertTitle, SngAlertDescription],
    },
    template: `
      <sng-alert ${argsToTemplate(args)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <sng-alert-title>Error</sng-alert-title>
        <sng-alert-description>
          Your session has expired. Please log in again.
        </sng-alert-description>
      </sng-alert>
    `,
  }),
};

/**
 * Alert without an icon.
 */
export const WithoutIcon: Story = {
  args: {},
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAlert, SngAlertTitle, SngAlertDescription],
    },
    template: `
      <sng-alert ${argsToTemplate(args)}>
        <sng-alert-title>Note</sng-alert-title>
        <sng-alert-description>
          This alert has no icon and uses the grid layout accordingly.
        </sng-alert-description>
      </sng-alert>
    `,
  }),
};

/**
 * Alert with only a title (no description).
 */
export const TitleOnly: Story = {
  args: {},
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAlert, SngAlertTitle],
    },
    template: `
      <sng-alert ${argsToTemplate(args)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        <sng-alert-title>Did you know?</sng-alert-title>
      </sng-alert>
    `,
  }),
};

/**
 * Custom styled alerts - showing flexibility via class input.
 */
export const CustomStyles: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngAlert, SngAlertTitle, SngAlertDescription],
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <sng-alert>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          <sng-alert-title>Default</sng-alert-title>
          <sng-alert-description>Default alert with standard styling.</sng-alert-description>
        </sng-alert>

        <sng-alert class="text-destructive">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <sng-alert-title>Destructive</sng-alert-title>
          <sng-alert-description>Error alert using text-destructive class.</sng-alert-description>
        </sng-alert>

        <sng-alert class="border-green-500 text-green-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <sng-alert-title>Success</sng-alert-title>
          <sng-alert-description>Custom success styling via class.</sng-alert-description>
        </sng-alert>
      </div>
    `,
  }),
};
