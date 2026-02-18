import type { Meta, StoryObj } from '@storybook/angular';
import { SngMenu } from './sng-menu';
import { SngMenuTrigger } from './sng-menu-trigger';
import { SngContextTrigger } from './sng-context-trigger';
import { SngMenuItem } from './sng-menu-item';
import { SngMenuSeparator } from './sng-menu-separator';
import { SngMenuLabel } from './sng-menu-label';
import { SngMenuShortcut } from './sng-menu-shortcut';
import { SngMenuCheckboxItem } from './sng-menu-checkbox-item';
import { SngMenuRadioGroup } from './sng-menu-radio-group';
import { SngMenuRadioItem } from './sng-menu-radio-item';
import { SngMenuSub } from './sng-menu-sub';
import { SngMenuSubTrigger } from './sng-menu-sub-trigger';
import { SngMenuSubContent } from './sng-menu-sub-content';
import { SngButton } from '../button/sng-button';

/**
 * Menu displays a list of actions or options in a dropdown panel.
 *
 * Built on Angular CDK Overlay.
 * Supports triggers, context menus, submenus, checkbox items, and radio groups.
 */
const meta: Meta<SngMenu> = {
  title: 'UI/Menu',
  component: SngMenu,
  tags: ['autodocs'],
  render: () => ({
    moduleMetadata: {
      imports: [
        SngMenu,
        SngMenuTrigger,
        SngMenuItem,
        SngMenuSeparator,
        SngMenuShortcut,
        SngButton,
      ],
    },
    template: `
      <sng-menu #menu>
        <sng-menu-item>
          New Tab
          <sng-menu-shortcut>Ctrl+T</sng-menu-shortcut>
        </sng-menu-item>
        <sng-menu-item>
          New Window
          <sng-menu-shortcut>Ctrl+N</sng-menu-shortcut>
        </sng-menu-item>
        <sng-menu-item [isDisabled]="true">New Incognito Window</sng-menu-item>
        <sng-menu-separator />
        <sng-menu-item>
          Print...
          <sng-menu-shortcut>Ctrl+P</sng-menu-shortcut>
        </sng-menu-item>
      </sng-menu>
      <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" [sngMenuTrigger]="menu">Open Menu</sng-button>
    `,
  }),
};

export default meta;
type Story = StoryObj<SngMenu>;

/**
 * Default dropdown menu with items and shortcuts.
 */
export const Default: Story = {};

/**
 * Menu with labels for grouping items.
 */
export const WithLabels: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngMenu,
        SngMenuTrigger,
        SngMenuItem,
        SngMenuSeparator,
        SngMenuLabel,
        SngButton,
      ],
    },
    template: `
      <sng-menu #menu>
        <sng-menu-label>My Account</sng-menu-label>
        <sng-menu-separator />
        <sng-menu-item>Profile</sng-menu-item>
        <sng-menu-item>Billing</sng-menu-item>
        <sng-menu-item>Settings</sng-menu-item>
        <sng-menu-separator />
        <sng-menu-item>Log out</sng-menu-item>
      </sng-menu>
      <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" [sngMenuTrigger]="menu">My Account</sng-button>
    `,
  }),
};

/**
 * Menu with checkbox items for toggleable options.
 */
export const WithCheckboxes: Story = {
  render: () => ({
    props: {
      showStatusBar: true,
      showActivityBar: false,
      showPanel: true,
    },
    moduleMetadata: {
      imports: [
        SngMenu,
        SngMenuTrigger,
        SngMenuItem,
        SngMenuSeparator,
        SngMenuLabel,
        SngMenuCheckboxItem,
        SngButton,
      ],
    },
    template: `
      <sng-menu #menu>
        <sng-menu-label>Appearance</sng-menu-label>
        <sng-menu-separator />
        <sng-menu-checkbox-item [(checked)]="showStatusBar">Status Bar</sng-menu-checkbox-item>
        <sng-menu-checkbox-item [(checked)]="showActivityBar">Activity Bar</sng-menu-checkbox-item>
        <sng-menu-checkbox-item [(checked)]="showPanel">Panel</sng-menu-checkbox-item>
      </sng-menu>
      <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" [sngMenuTrigger]="menu">View Options</sng-button>
      <p class="mt-4 text-sm text-muted-foreground">
        Status Bar: {{ showStatusBar }}, Activity Bar: {{ showActivityBar }}, Panel: {{ showPanel }}
      </p>
    `,
  }),
};

/**
 * Menu with radio group for mutually exclusive options.
 */
export const WithRadioGroup: Story = {
  render: () => ({
    props: {
      selectedPerson: 'pedro',
    },
    moduleMetadata: {
      imports: [
        SngMenu,
        SngMenuTrigger,
        SngMenuItem,
        SngMenuSeparator,
        SngMenuLabel,
        SngMenuRadioGroup,
        SngMenuRadioItem,
        SngButton,
      ],
    },
    template: `
      <sng-menu #menu>
        <sng-menu-label>Team Members</sng-menu-label>
        <sng-menu-separator />
        <sng-menu-radio-group [(value)]="selectedPerson">
          <sng-menu-radio-item value="pedro">Pedro Duarte</sng-menu-radio-item>
          <sng-menu-radio-item value="colm">Colm Tuite</sng-menu-radio-item>
          <sng-menu-radio-item value="john">John Smith</sng-menu-radio-item>
        </sng-menu-radio-group>
      </sng-menu>
      <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" [sngMenuTrigger]="menu">Select Person</sng-button>
      <p class="mt-4 text-sm text-muted-foreground">Selected: {{ selectedPerson }}</p>
    `,
  }),
};

/**
 * Menu with nested submenu.
 */
export const WithSubmenu: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngMenu,
        SngMenuTrigger,
        SngMenuItem,
        SngMenuSeparator,
        SngMenuShortcut,
        SngMenuSub,
        SngMenuSubTrigger,
        SngMenuSubContent,
        SngButton,
      ],
    },
    template: `
      <sng-menu #menu>
        <sng-menu-item>Back</sng-menu-item>
        <sng-menu-item [isDisabled]="true">Forward</sng-menu-item>
        <sng-menu-item>Reload</sng-menu-item>
        <sng-menu-separator />
        <sng-menu-sub>
          <sng-menu-sub-trigger>More Tools</sng-menu-sub-trigger>
          <sng-menu-sub-content>
            <sng-menu-item>
              Save Page As...
              <sng-menu-shortcut>Ctrl+S</sng-menu-shortcut>
            </sng-menu-item>
            <sng-menu-item>Create Shortcut...</sng-menu-item>
            <sng-menu-item>Name Window...</sng-menu-item>
            <sng-menu-separator />
            <sng-menu-item>Developer Tools</sng-menu-item>
          </sng-menu-sub-content>
        </sng-menu-sub>
        <sng-menu-separator />
        <sng-menu-item>
          Show Bookmarks Bar
          <sng-menu-shortcut>Ctrl+Shift+B</sng-menu-shortcut>
        </sng-menu-item>
        <sng-menu-item>Show Full URLs</sng-menu-item>
      </sng-menu>
      <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" [sngMenuTrigger]="menu">Open Menu</sng-button>
    `,
  }),
};

/**
 * Context menu triggered by right-click.
 */
export const ContextMenu: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngMenu,
        SngContextTrigger,
        SngMenuItem,
        SngMenuSeparator,
        SngMenuShortcut,
      ],
    },
    template: `
      <sng-menu #contextMenu>
        <sng-menu-item>
          Cut
          <sng-menu-shortcut>Ctrl+X</sng-menu-shortcut>
        </sng-menu-item>
        <sng-menu-item>
          Copy
          <sng-menu-shortcut>Ctrl+C</sng-menu-shortcut>
        </sng-menu-item>
        <sng-menu-item>
          Paste
          <sng-menu-shortcut>Ctrl+V</sng-menu-shortcut>
        </sng-menu-item>
        <sng-menu-separator />
        <sng-menu-item>Select All</sng-menu-item>
      </sng-menu>
      <div
        [sngContextTrigger]="contextMenu"
        class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Right click here
      </div>
    `,
  }),
};

/**
 * Menu with disabled items.
 */
export const WithDisabledItems: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngMenu,
        SngMenuTrigger,
        SngMenuItem,
        SngMenuSeparator,
        SngButton,
      ],
    },
    template: `
      <sng-menu #menu>
        <sng-menu-item>Undo</sng-menu-item>
        <sng-menu-item [isDisabled]="true">Redo</sng-menu-item>
        <sng-menu-separator />
        <sng-menu-item>Cut</sng-menu-item>
        <sng-menu-item [isDisabled]="true">Copy</sng-menu-item>
        <sng-menu-item>Paste</sng-menu-item>
      </sng-menu>
      <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" [sngMenuTrigger]="menu">Edit</sng-button>
    `,
  }),
};

/**
 * Menu with inset items for alignment with checkbox/radio items.
 */
export const InsetItems: Story = {
  render: () => ({
    props: {
      showBookmarks: true,
    },
    moduleMetadata: {
      imports: [
        SngMenu,
        SngMenuTrigger,
        SngMenuItem,
        SngMenuSeparator,
        SngMenuCheckboxItem,
        SngButton,
      ],
    },
    template: `
      <sng-menu #menu>
        <sng-menu-checkbox-item [(checked)]="showBookmarks">Show Bookmarks</sng-menu-checkbox-item>
        <sng-menu-separator />
        <sng-menu-item inset>Reload</sng-menu-item>
        <sng-menu-item inset>Force Reload</sng-menu-item>
      </sng-menu>
      <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" [sngMenuTrigger]="menu">View</sng-button>
    `,
  }),
};
