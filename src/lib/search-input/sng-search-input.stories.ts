import { NgModule } from '@angular/core';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { SngSearchInput } from './sng-search-input';
import { SngSearchInputList } from './sng-search-input-list';
import { SngSearchInputGroup } from './sng-search-input-group';
import { SngSearchInputItem } from './sng-search-input-item';
import { SngSearchInputEmpty } from './sng-search-input-empty';
import { SngSearchInputSeparator } from './sng-search-input-separator';
import { SngSearchInputShortcut } from './sng-search-input-shortcut';

// NgModule wrapper to help Storybook JIT compilation
@NgModule({
  imports: [
    SngSearchInput,
    SngSearchInputList,
    SngSearchInputGroup,
    SngSearchInputItem,
    SngSearchInputEmpty,
    SngSearchInputSeparator,
    SngSearchInputShortcut,
  ],
  exports: [
    SngSearchInput,
    SngSearchInputList,
    SngSearchInputGroup,
    SngSearchInputItem,
    SngSearchInputEmpty,
    SngSearchInputSeparator,
    SngSearchInputShortcut,
  ],
})
class SearchInputModule {}

/**
 * Search input component with dropdown for search results or command-style filtering.
 *
 * Use `command` attribute to show all non-hidden items by default.
 */
const meta: Meta<SngSearchInput> = {
  title: 'UI/Search Input',
  component: SngSearchInput,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SearchInputModule],
    }),
  ],
  argTypes: {
    command: {
      control: 'boolean',
      description: 'Show all non-hidden items by default, then filter by input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear button when there is text',
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
type Story = StoryObj<SngSearchInput>;

/**
 * Basic search input with dropdown results.
 */
export const Default: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-search-input placeholder="Search...">
          <sng-search-input-list>
            <sng-search-input-group heading="Suggestions">
              <sng-search-input-item value="calendar">Calendar</sng-search-input-item>
              <sng-search-input-item value="search">Search Emoji</sng-search-input-item>
              <sng-search-input-item value="calculator">Calculator</sng-search-input-item>
            </sng-search-input-group>
            <sng-search-input-separator />
            <sng-search-input-group heading="Settings">
              <sng-search-input-item value="profile">Profile</sng-search-input-item>
              <sng-search-input-item value="billing">Billing</sng-search-input-item>
              <sng-search-input-item value="settings">Settings</sng-search-input-item>
            </sng-search-input-group>
          </sng-search-input-list>
          <sng-search-input-empty>No results found.</sng-search-input-empty>
        </sng-search-input>
      </div>
    `,
  }),
};

/**
 * Command-style example with trailing hint text.
 */
export const CommandPalette: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-search-input command placeholder="Type a command or search...">
          <sng-search-input-list>
            <sng-search-input-group heading="Actions">
              <sng-search-input-item value="copy">
                Copy
                <sng-search-input-shortcut>Common</sng-search-input-shortcut>
              </sng-search-input-item>
              <sng-search-input-item value="paste">
                Paste
                <sng-search-input-shortcut>Recent</sng-search-input-shortcut>
              </sng-search-input-item>
              <sng-search-input-item value="cut">
                Cut
                <sng-search-input-shortcut>Draft</sng-search-input-shortcut>
              </sng-search-input-item>
            </sng-search-input-group>
            <sng-search-input-separator />
            <sng-search-input-group heading="Navigation">
              <sng-search-input-item value="home">
                Go to Home
                <sng-search-input-shortcut>Page</sng-search-input-shortcut>
              </sng-search-input-item>
              <sng-search-input-item value="settings">
                Open Settings
                <sng-search-input-shortcut>Panel</sng-search-input-shortcut>
              </sng-search-input-item>
            </sng-search-input-group>
          </sng-search-input-list>
          <sng-search-input-empty>No commands found.</sng-search-input-empty>
        </sng-search-input>
      </div>
    `,
  }),
};

/**
 * Search input without clear button.
 */
export const NoClearButton: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-search-input placeholder="Search..." [showClearButton]="false">
          <sng-search-input-list>
            <sng-search-input-item value="item1">Item 1</sng-search-input-item>
            <sng-search-input-item value="item2">Item 2</sng-search-input-item>
            <sng-search-input-item value="item3">Item 3</sng-search-input-item>
          </sng-search-input-list>
        </sng-search-input>
      </div>
    `,
  }),
};

/**
 * Disabled search input.
 */
export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-search-input placeholder="Search disabled..." disabled>
          <sng-search-input-list>
            <sng-search-input-item value="item1">Item 1</sng-search-input-item>
          </sng-search-input-list>
        </sng-search-input>
      </div>
    `,
  }),
};

/**
 * Search with disabled items.
 */
export const WithDisabledItems: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <sng-search-input placeholder="Search...">
          <sng-search-input-list>
            <sng-search-input-item value="available">Available Item</sng-search-input-item>
            <sng-search-input-item value="disabled" disabled>Disabled Item</sng-search-input-item>
            <sng-search-input-item value="another">Another Available</sng-search-input-item>
          </sng-search-input-list>
        </sng-search-input>
      </div>
    `,
  }),
};
