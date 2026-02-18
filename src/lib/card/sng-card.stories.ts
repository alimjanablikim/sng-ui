import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngCard } from './sng-card';
import { SngCardHeader } from './sng-card-header';
import { SngCardTitle } from './sng-card-title';
import { SngCardDescription } from './sng-card-description';
import { SngCardContent } from './sng-card-content';
import { SngCardFooter } from './sng-card-footer';
import { SngButton } from '../button/sng-button';
import { SngInput } from '../input/sng-input';

/**
 * Card is a container for grouping related content with a consistent visual boundary.
 *
 * Cards are versatile containers used for dashboards, settings panels, product displays,
 * or any grouped content. Composed of Header, Title, Description, Content, and Footer.
 */
const meta: Meta<SngCard> = {
  title: 'UI/Card',
  component: SngCard,
  tags: ['autodocs'],
  argTypes: {
    class: {
      control: 'text',
      description: 'Custom CSS classes for width constraints, margins, or custom styling',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngCard, SngCardHeader, SngCardTitle, SngCardDescription, SngCardContent, SngCardFooter, SngButton],
    },
    template: `
      <sng-card ${argsToTemplate(args)}>
        <sng-card-header>
          <sng-card-title>Card Title</sng-card-title>
          <sng-card-description>Card description goes here.</sng-card-description>
        </sng-card-header>
        <sng-card-content>
          <p>Card content area for your main content.</p>
        </sng-card-content>
        <sng-card-footer>
          <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Cancel</sng-button>
          <sng-button>Submit</sng-button>
        </sng-card-footer>
      </sng-card>
    `,
  }),
};

export default meta;
type Story = StoryObj<SngCard>;

/**
 * Default card with header, content, and footer.
 */
export const Default: Story = {
  args: {
    class: 'w-[350px]',
  },
};

/**
 * Card with form elements inside.
 */
export const WithForm: Story = {
  args: {
    class: 'w-[400px]',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngCard, SngCardHeader, SngCardTitle, SngCardDescription, SngCardContent, SngCardFooter, SngButton, SngInput],
    },
    template: `
      <sng-card ${argsToTemplate(args)}>
        <sng-card-header>
          <sng-card-title>Create project</sng-card-title>
          <sng-card-description>Deploy your new project in one-click.</sng-card-description>
        </sng-card-header>
        <sng-card-content>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label class="text-sm font-medium leading-none">Name</label>
              <sng-input placeholder="Name of your project" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label class="text-sm font-medium leading-none">Framework</label>
              <sng-input placeholder="Next.js" />
            </div>
          </div>
        </sng-card-content>
        <sng-card-footer class="justify-between">
          <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Cancel</sng-button>
          <sng-button>Deploy</sng-button>
        </sng-card-footer>
      </sng-card>
    `,
  }),
};

/**
 * Card without footer.
 */
export const WithoutFooter: Story = {
  args: {
    class: 'w-[350px]',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngCard, SngCardHeader, SngCardTitle, SngCardDescription, SngCardContent],
    },
    template: `
      <sng-card ${argsToTemplate(args)}>
        <sng-card-header>
          <sng-card-title>Notifications</sng-card-title>
          <sng-card-description>You have 3 unread messages.</sng-card-description>
        </sng-card-header>
        <sng-card-content>
          <p style="color: var(--muted-foreground); font-size: 14px;">
            Check your inbox for the latest updates and messages from your team.
          </p>
        </sng-card-content>
      </sng-card>
    `,
  }),
};

/**
 * Minimal card with only content.
 */
export const Minimal: Story = {
  args: {
    class: 'w-[300px]',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngCard, SngCardContent],
    },
    template: `
      <sng-card ${argsToTemplate(args)}>
        <sng-card-content>
          <p>Simple card with content only.</p>
        </sng-card-content>
      </sng-card>
    `,
  }),
};

/**
 * Multiple cards in a grid layout.
 */
export const CardGrid: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngCard, SngCardHeader, SngCardTitle, SngCardDescription, SngCardContent, SngCardFooter, SngButton],
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 700px;">
        <sng-card>
          <sng-card-header>
            <sng-card-title>Analytics</sng-card-title>
            <sng-card-description>View your site analytics.</sng-card-description>
          </sng-card-header>
          <sng-card-content>
            <p style="font-size: 24px; font-weight: 600;">1,234</p>
            <p style="color: var(--muted-foreground); font-size: 12px;">Total visitors</p>
          </sng-card-content>
        </sng-card>

        <sng-card>
          <sng-card-header>
            <sng-card-title>Revenue</sng-card-title>
            <sng-card-description>Monthly earnings.</sng-card-description>
          </sng-card-header>
          <sng-card-content>
            <p style="font-size: 24px; font-weight: 600;">$12,345</p>
            <p style="color: var(--muted-foreground); font-size: 12px;">This month</p>
          </sng-card-content>
        </sng-card>
      </div>
    `,
  }),
};
