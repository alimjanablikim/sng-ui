import { type Meta, type StoryObj } from '@storybook/angular';
import { SngBreadcrumb } from './sng-breadcrumb';
import { SngBreadcrumbList } from './sng-breadcrumb-list';
import { SngBreadcrumbItem } from './sng-breadcrumb-item';
import { SngBreadcrumbLink } from './sng-breadcrumb-link';
import { SngBreadcrumbSeparator } from './sng-breadcrumb-separator';
import { SngBreadcrumbPage } from './sng-breadcrumb-page';
import { SngBreadcrumbEllipsis } from './sng-breadcrumb-ellipsis';

const meta: Meta<SngBreadcrumb> = {
  title: 'UI/Breadcrumb',
  component: SngBreadcrumb,
  tags: ['autodocs'],
  argTypes: {
    class: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<SngBreadcrumb>;

/**
 * Default breadcrumb navigation with three levels.
 */
export const Default: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngBreadcrumb,
        SngBreadcrumbList,
        SngBreadcrumbItem,
        SngBreadcrumbLink,
        SngBreadcrumbSeparator,
        SngBreadcrumbPage,
      ],
    },
    template: `
      <sng-breadcrumb>
        <sng-breadcrumb-list>
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Home</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Products</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-page>Product Details</sng-breadcrumb-page>
          </sng-breadcrumb-item>
        </sng-breadcrumb-list>
      </sng-breadcrumb>
    `,
  }),
};

/**
 * Breadcrumb with ellipsis for collapsed items.
 */
export const WithEllipsis: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngBreadcrumb,
        SngBreadcrumbList,
        SngBreadcrumbItem,
        SngBreadcrumbLink,
        SngBreadcrumbSeparator,
        SngBreadcrumbPage,
        SngBreadcrumbEllipsis,
      ],
    },
    template: `
      <sng-breadcrumb>
        <sng-breadcrumb-list>
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Home</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-ellipsis />
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Category</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-page>Current Page</sng-breadcrumb-page>
          </sng-breadcrumb-item>
        </sng-breadcrumb-list>
      </sng-breadcrumb>
    `,
  }),
};

/**
 * Simple two-level breadcrumb.
 */
export const TwoLevels: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngBreadcrumb,
        SngBreadcrumbList,
        SngBreadcrumbItem,
        SngBreadcrumbLink,
        SngBreadcrumbSeparator,
        SngBreadcrumbPage,
      ],
    },
    template: `
      <sng-breadcrumb>
        <sng-breadcrumb-list>
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Home</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-page>Dashboard</sng-breadcrumb-page>
          </sng-breadcrumb-item>
        </sng-breadcrumb-list>
      </sng-breadcrumb>
    `,
  }),
};

/**
 * Deep breadcrumb with many levels.
 */
export const DeepNavigation: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngBreadcrumb,
        SngBreadcrumbList,
        SngBreadcrumbItem,
        SngBreadcrumbLink,
        SngBreadcrumbSeparator,
        SngBreadcrumbPage,
      ],
    },
    template: `
      <sng-breadcrumb>
        <sng-breadcrumb-list>
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Home</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Electronics</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Computers</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Laptops</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-page>MacBook Pro</sng-breadcrumb-page>
          </sng-breadcrumb-item>
        </sng-breadcrumb-list>
      </sng-breadcrumb>
    `,
  }),
};

/**
 * Breadcrumb with custom separator (slash).
 */
export const CustomSeparator: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngBreadcrumb,
        SngBreadcrumbList,
        SngBreadcrumbItem,
        SngBreadcrumbLink,
        SngBreadcrumbSeparator,
        SngBreadcrumbPage,
      ],
    },
    template: `
      <sng-breadcrumb>
        <sng-breadcrumb-list>
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Home</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator>
            <span class="text-muted-foreground">/</span>
          </sng-breadcrumb-separator>
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Settings</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator>
            <span class="text-muted-foreground">/</span>
          </sng-breadcrumb-separator>
          <sng-breadcrumb-item>
            <sng-breadcrumb-page>Profile</sng-breadcrumb-page>
          </sng-breadcrumb-item>
        </sng-breadcrumb-list>
      </sng-breadcrumb>
    `,
  }),
};

/**
 * Breadcrumb in a page header context.
 */
export const InPageHeader: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngBreadcrumb,
        SngBreadcrumbList,
        SngBreadcrumbItem,
        SngBreadcrumbLink,
        SngBreadcrumbSeparator,
        SngBreadcrumbPage,
      ],
    },
    template: `
      <div class="space-y-4">
        <sng-breadcrumb>
          <sng-breadcrumb-list>
            <sng-breadcrumb-item>
              <sng-breadcrumb-link href="#">Dashboard</sng-breadcrumb-link>
            </sng-breadcrumb-item>
            <sng-breadcrumb-separator />
            <sng-breadcrumb-item>
              <sng-breadcrumb-link href="#">Users</sng-breadcrumb-link>
            </sng-breadcrumb-item>
            <sng-breadcrumb-separator />
            <sng-breadcrumb-item>
              <sng-breadcrumb-page>John Doe</sng-breadcrumb-page>
            </sng-breadcrumb-item>
          </sng-breadcrumb-list>
        </sng-breadcrumb>
        <div>
          <h1 class="text-2xl font-bold">John Doe</h1>
          <p class="text-muted-foreground">User profile and settings</p>
        </div>
      </div>
    `,
  }),
};

/**
 * Breadcrumb with icon prefix.
 */
export const WithHomeIcon: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngBreadcrumb,
        SngBreadcrumbList,
        SngBreadcrumbItem,
        SngBreadcrumbLink,
        SngBreadcrumbSeparator,
        SngBreadcrumbPage,
      ],
    },
    template: `
      <sng-breadcrumb>
        <sng-breadcrumb-list>
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#" class="flex items-center gap-1.5">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span class="sr-only">Home</span>
            </sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-link href="#">Documents</sng-breadcrumb-link>
          </sng-breadcrumb-item>
          <sng-breadcrumb-separator />
          <sng-breadcrumb-item>
            <sng-breadcrumb-page>Report.pdf</sng-breadcrumb-page>
          </sng-breadcrumb-item>
        </sng-breadcrumb-list>
      </sng-breadcrumb>
    `,
  }),
};
