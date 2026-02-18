import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngTabs } from './sng-tabs';
import { SngTabsList } from './sng-tabs-list';
import { SngTabsTrigger } from './sng-tabs-trigger';
import { SngTabsContent } from './sng-tabs-content';
import { SngButton } from '../button/sng-button';
import { SngInput } from '../input/sng-input';
import { SngCard } from '../card/sng-card';
import { SngCardHeader } from '../card/sng-card-header';
import { SngCardTitle } from '../card/sng-card-title';
import { SngCardDescription } from '../card/sng-card-description';
import { SngCardContent } from '../card/sng-card-content';
import { SngCardFooter } from '../card/sng-card-footer';

/**
 * Tabs organize content into separate views where only one view is visible at a time.
 *
 * Default style uses a muted background container. Customize via `class` input on
 * `sng-tabs-list` and `sng-tabs-trigger` for underline or pills styles.
 */
const meta: Meta<SngTabs> = {
  title: 'UI/Tabs',
  component: SngTabs,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'The value of the tab that should be selected by default',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngTabs, SngTabsList, SngTabsTrigger, SngTabsContent],
    },
    template: `
      <sng-tabs ${argsToTemplate(args)} class="w-[400px]">
        <sng-tabs-list>
          <sng-tabs-trigger value="account">Account</sng-tabs-trigger>
          <sng-tabs-trigger value="password">Password</sng-tabs-trigger>
        </sng-tabs-list>
        <sng-tabs-content value="account">
          <p class="text-sm text-muted-foreground">
            Make changes to your account here. Click save when you're done.
          </p>
        </sng-tabs-content>
        <sng-tabs-content value="password">
          <p class="text-sm text-muted-foreground">
            Change your password here. After saving, you'll be logged out.
          </p>
        </sng-tabs-content>
      </sng-tabs>
    `,
  }),
};

export default meta;
type Story = StoryObj<SngTabs>;

/**
 * Default tabs with muted background container.
 */
export const Default: Story = {
  args: {
    defaultValue: 'account',
  },
};

/**
 * Underline style achieved via class overrides on list and triggers.
 */
export const Underline: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTabs, SngTabsList, SngTabsTrigger, SngTabsContent],
    },
    template: `
      <sng-tabs defaultValue="account" class="w-[400px]">
        <sng-tabs-list class="border-b border-border bg-transparent p-0 rounded-none">
          <sng-tabs-trigger value="account"
            class="rounded-none border-b-2 -mb-px pb-1 px-3 shadow-none bg-transparent border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none">
            Account
          </sng-tabs-trigger>
          <sng-tabs-trigger value="password"
            class="rounded-none border-b-2 -mb-px pb-1 px-3 shadow-none bg-transparent border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none">
            Password
          </sng-tabs-trigger>
        </sng-tabs-list>
        <sng-tabs-content value="account">
          <p class="text-sm text-muted-foreground">Account settings here.</p>
        </sng-tabs-content>
        <sng-tabs-content value="password">
          <p class="text-sm text-muted-foreground">Password settings here.</p>
        </sng-tabs-content>
      </sng-tabs>
    `,
  }),
};

/**
 * Pill-shaped tabs achieved via class overrides on list and triggers.
 */
export const Pills: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTabs, SngTabsList, SngTabsTrigger, SngTabsContent],
    },
    template: `
      <sng-tabs defaultValue="account" class="w-[400px]">
        <sng-tabs-list class="bg-transparent gap-1 p-0">
          <sng-tabs-trigger value="account"
            class="rounded-full shadow-none bg-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:hover:bg-muted">
            Account
          </sng-tabs-trigger>
          <sng-tabs-trigger value="password"
            class="rounded-full shadow-none bg-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:hover:bg-muted">
            Password
          </sng-tabs-trigger>
        </sng-tabs-list>
        <sng-tabs-content value="account">
          <p class="text-sm text-muted-foreground">Account settings here.</p>
        </sng-tabs-content>
        <sng-tabs-content value="password">
          <p class="text-sm text-muted-foreground">Password settings here.</p>
        </sng-tabs-content>
      </sng-tabs>
    `,
  }),
};

/**
 * Tabs with form content inside cards.
 */
export const WithCards: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngTabs,
        SngTabsList,
        SngTabsTrigger,
        SngTabsContent,
        SngButton,
        SngInput,
        SngCard,
        SngCardHeader,
        SngCardTitle,
        SngCardDescription,
        SngCardContent,
        SngCardFooter,
      ],
    },
    template: `
      <sng-tabs defaultValue="account" class="w-[400px]">
        <sng-tabs-list class="grid w-full grid-cols-2">
          <sng-tabs-trigger value="account">Account</sng-tabs-trigger>
          <sng-tabs-trigger value="password">Password</sng-tabs-trigger>
        </sng-tabs-list>
        <sng-tabs-content value="account">
          <sng-card>
            <sng-card-header>
              <sng-card-title>Account</sng-card-title>
              <sng-card-description>
                Make changes to your account here. Click save when you're done.
              </sng-card-description>
            </sng-card-header>
            <sng-card-content class="space-y-2">
              <div class="space-y-1">
                <label for="name" class="text-sm font-medium">Name</label>
                <sng-input id="name" name="name" autocomplete="name" value="Pedro Duarte" />
              </div>
              <div class="space-y-1">
                <label for="username" class="text-sm font-medium">Username</label>
                <sng-input id="username" name="username" autocomplete="username" value="@peduarte" />
              </div>
            </sng-card-content>
            <sng-card-footer>
              <sng-button>Save changes</sng-button>
            </sng-card-footer>
          </sng-card>
        </sng-tabs-content>
        <sng-tabs-content value="password">
          <sng-card>
            <sng-card-header>
              <sng-card-title>Password</sng-card-title>
              <sng-card-description>
                Change your password here. After saving, you'll be logged out.
              </sng-card-description>
            </sng-card-header>
            <form class="contents" action="#">
              <input type="text" name="username" autocomplete="username" value="@peduarte" class="sr-only" tabindex="-1" aria-hidden="true" />
              <sng-card-content class="space-y-2">
                <div class="space-y-1">
                  <label for="current" class="text-sm font-medium">Current password</label>
                  <sng-input id="current" name="current-password" type="password" autocomplete="current-password" />
                </div>
                <div class="space-y-1">
                  <label for="new" class="text-sm font-medium">New password</label>
                  <sng-input id="new" name="new-password" type="password" autocomplete="new-password" />
                </div>
              </sng-card-content>
              <sng-card-footer>
                <sng-button type="submit">Save password</sng-button>
              </sng-card-footer>
            </form>
          </sng-card>
        </sng-tabs-content>
      </sng-tabs>
    `,
  }),
};

/**
 * Multiple tabs with more options.
 */
export const MultipleTabs: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTabs, SngTabsList, SngTabsTrigger, SngTabsContent],
    },
    template: `
      <sng-tabs defaultValue="overview" class="w-[500px]">
        <sng-tabs-list>
          <sng-tabs-trigger value="overview">Overview</sng-tabs-trigger>
          <sng-tabs-trigger value="analytics">Analytics</sng-tabs-trigger>
          <sng-tabs-trigger value="reports">Reports</sng-tabs-trigger>
          <sng-tabs-trigger value="notifications">Notifications</sng-tabs-trigger>
        </sng-tabs-list>
        <sng-tabs-content value="overview">
          <div class="p-4">
            <h3 class="text-lg font-medium">Overview</h3>
            <p class="text-sm text-muted-foreground mt-2">
              View a summary of your account activity and key metrics.
            </p>
          </div>
        </sng-tabs-content>
        <sng-tabs-content value="analytics">
          <div class="p-4">
            <h3 class="text-lg font-medium">Analytics</h3>
            <p class="text-sm text-muted-foreground mt-2">
              Dive deep into your data with detailed analytics and insights.
            </p>
          </div>
        </sng-tabs-content>
        <sng-tabs-content value="reports">
          <div class="p-4">
            <h3 class="text-lg font-medium">Reports</h3>
            <p class="text-sm text-muted-foreground mt-2">
              Generate and download custom reports for your data.
            </p>
          </div>
        </sng-tabs-content>
        <sng-tabs-content value="notifications">
          <div class="p-4">
            <h3 class="text-lg font-medium">Notifications</h3>
            <p class="text-sm text-muted-foreground mt-2">
              Configure how and when you receive notifications.
            </p>
          </div>
        </sng-tabs-content>
      </sng-tabs>
    `,
  }),
};

/**
 * Three style approaches for comparison: default (built-in), underline (class override), pills (class override).
 */
export const AllStyles: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngTabs, SngTabsList, SngTabsTrigger, SngTabsContent],
    },
    template: `
      <div class="space-y-8">
        <div>
          <p class="text-sm font-medium mb-2">Default (built-in)</p>
          <sng-tabs defaultValue="tab1" class="w-[400px]">
            <sng-tabs-list>
              <sng-tabs-trigger value="tab1">Tab 1</sng-tabs-trigger>
              <sng-tabs-trigger value="tab2">Tab 2</sng-tabs-trigger>
              <sng-tabs-trigger value="tab3">Tab 3</sng-tabs-trigger>
            </sng-tabs-list>
            <sng-tabs-content value="tab1">Content for Tab 1</sng-tabs-content>
            <sng-tabs-content value="tab2">Content for Tab 2</sng-tabs-content>
            <sng-tabs-content value="tab3">Content for Tab 3</sng-tabs-content>
          </sng-tabs>
        </div>

        <div>
          <p class="text-sm font-medium mb-2">Underline (via class)</p>
          <sng-tabs defaultValue="tab1" class="w-[400px]">
            <sng-tabs-list class="border-b border-border bg-transparent p-0 rounded-none">
              <sng-tabs-trigger value="tab1"
                class="rounded-none border-b-2 -mb-px pb-1 px-3 shadow-none bg-transparent border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none">
                Tab 1
              </sng-tabs-trigger>
              <sng-tabs-trigger value="tab2"
                class="rounded-none border-b-2 -mb-px pb-1 px-3 shadow-none bg-transparent border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none">
                Tab 2
              </sng-tabs-trigger>
              <sng-tabs-trigger value="tab3"
                class="rounded-none border-b-2 -mb-px pb-1 px-3 shadow-none bg-transparent border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none">
                Tab 3
              </sng-tabs-trigger>
            </sng-tabs-list>
            <sng-tabs-content value="tab1">Content for Tab 1</sng-tabs-content>
            <sng-tabs-content value="tab2">Content for Tab 2</sng-tabs-content>
            <sng-tabs-content value="tab3">Content for Tab 3</sng-tabs-content>
          </sng-tabs>
        </div>

        <div>
          <p class="text-sm font-medium mb-2">Pills (via class)</p>
          <sng-tabs defaultValue="tab1" class="w-[400px]">
            <sng-tabs-list class="bg-transparent gap-1 p-0">
              <sng-tabs-trigger value="tab1"
                class="rounded-full shadow-none bg-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:hover:bg-muted">
                Tab 1
              </sng-tabs-trigger>
              <sng-tabs-trigger value="tab2"
                class="rounded-full shadow-none bg-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:hover:bg-muted">
                Tab 2
              </sng-tabs-trigger>
              <sng-tabs-trigger value="tab3"
                class="rounded-full shadow-none bg-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:hover:bg-muted">
                Tab 3
              </sng-tabs-trigger>
            </sng-tabs-list>
            <sng-tabs-content value="tab1">Content for Tab 1</sng-tabs-content>
            <sng-tabs-content value="tab2">Content for Tab 2</sng-tabs-content>
            <sng-tabs-content value="tab3">Content for Tab 3</sng-tabs-content>
          </sng-tabs>
        </div>
      </div>
    `,
  }),
};
