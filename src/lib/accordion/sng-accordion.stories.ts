import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngAccordion } from './sng-accordion';
import { SngAccordionItem } from './sng-accordion-item';
import { SngAccordionTrigger } from './sng-accordion-trigger';
import { SngAccordionContent } from './sng-accordion-content';

/**
 * Accordion component for collapsible content sections.
 *
 * Built on Angular CDK Accordion for robust state management and accessibility.
 * Supports single and multiple expansion modes.
 */
const meta: Meta<SngAccordion> = {
  title: 'UI/Accordion',
  component: SngAccordion,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Expansion behavior mode',
      table: {
        type: { summary: "'single' | 'multiple'" },
        defaultValue: { summary: 'single' },
      },
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether expanded items can be collapsed',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire accordion is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Orientation metadata',
      table: {
        type: { summary: "'vertical' | 'horizontal'" },
        defaultValue: { summary: 'vertical' },
      },
    },
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
    },
    template: `
      <sng-accordion ${argsToTemplate(args)} class="w-full max-w-md">
        <sng-accordion-item value="item-1">
          <sng-accordion-trigger>Is it accessible?</sng-accordion-trigger>
          <sng-accordion-content>
            Yes. It adheres to the WAI-ARIA design pattern.
          </sng-accordion-content>
        </sng-accordion-item>
        <sng-accordion-item value="item-2">
          <sng-accordion-trigger>Is it styled?</sng-accordion-trigger>
          <sng-accordion-content>
            Yes. It comes with default styles that matches the other components' aesthetic.
          </sng-accordion-content>
        </sng-accordion-item>
        <sng-accordion-item value="item-3">
          <sng-accordion-trigger>Is it animated?</sng-accordion-trigger>
          <sng-accordion-content>
            Yes. It's animated by default, but you can disable it if you prefer.
          </sng-accordion-content>
        </sng-accordion-item>
      </sng-accordion>
    `,
  }),
};

export default meta;
type Story = StoryObj<SngAccordion>;

/**
 * Default accordion in single mode - only one item can be open at a time.
 */
export const Default: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
};

/**
 * Multiple mode - multiple items can be open simultaneously.
 */
export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
    },
    template: `
      <sng-accordion ${argsToTemplate(args)} class="w-full max-w-md">
        <sng-accordion-item value="item-1">
          <sng-accordion-trigger>First Section</sng-accordion-trigger>
          <sng-accordion-content>
            You can expand multiple sections at the same time.
          </sng-accordion-content>
        </sng-accordion-item>
        <sng-accordion-item value="item-2">
          <sng-accordion-trigger>Second Section</sng-accordion-trigger>
          <sng-accordion-content>
            Try expanding this while the first is open.
          </sng-accordion-content>
        </sng-accordion-item>
        <sng-accordion-item value="item-3">
          <sng-accordion-trigger>Third Section</sng-accordion-trigger>
          <sng-accordion-content>
            All three can be open at once in multiple mode.
          </sng-accordion-content>
        </sng-accordion-item>
      </sng-accordion>
    `,
  }),
};

/**
 * Non-collapsible - at least one item must remain open.
 */
export const NonCollapsible: Story = {
  args: {
    type: 'single',
    collapsible: false,
    defaultValue: 'item-1',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
    },
    template: `
      <sng-accordion ${argsToTemplate(args)} class="w-full max-w-md">
        <sng-accordion-item value="item-1">
          <sng-accordion-trigger>Always One Open</sng-accordion-trigger>
          <sng-accordion-content>
            You cannot collapse all items - one must stay open.
          </sng-accordion-content>
        </sng-accordion-item>
        <sng-accordion-item value="item-2">
          <sng-accordion-trigger>Switch to this</sng-accordion-trigger>
          <sng-accordion-content>
            Click another item to switch, but cannot close completely.
          </sng-accordion-content>
        </sng-accordion-item>
      </sng-accordion>
    `,
  }),
};

/**
 * With default expanded item.
 */
export const DefaultExpanded: Story = {
  args: {
    type: 'single',
    defaultValue: 'item-2',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
    },
    template: `
      <sng-accordion ${argsToTemplate(args)} class="w-full max-w-md">
        <sng-accordion-item value="item-1">
          <sng-accordion-trigger>First Item</sng-accordion-trigger>
          <sng-accordion-content>Content for the first item.</sng-accordion-content>
        </sng-accordion-item>
        <sng-accordion-item value="item-2">
          <sng-accordion-trigger>Second Item (Default Open)</sng-accordion-trigger>
          <sng-accordion-content>This item is expanded by default.</sng-accordion-content>
        </sng-accordion-item>
        <sng-accordion-item value="item-3">
          <sng-accordion-trigger>Third Item</sng-accordion-trigger>
          <sng-accordion-content>Content for the third item.</sng-accordion-content>
        </sng-accordion-item>
      </sng-accordion>
    `,
  }),
};

/**
 * Disabled accordion - all interactions are blocked.
 */
export const Disabled: Story = {
  args: {
    type: 'single',
    disabled: true,
  },
};

/**
 * Individual disabled items within an accordion.
 */
export const DisabledItems: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
    },
    template: `
      <sng-accordion type="single" collapsible class="w-full max-w-md">
        <sng-accordion-item value="item-1">
          <sng-accordion-trigger>Enabled Item</sng-accordion-trigger>
          <sng-accordion-content>This item works normally.</sng-accordion-content>
        </sng-accordion-item>
        <sng-accordion-item value="item-2" disabled>
          <sng-accordion-trigger>Disabled Item</sng-accordion-trigger>
          <sng-accordion-content>This content cannot be accessed.</sng-accordion-content>
        </sng-accordion-item>
        <sng-accordion-item value="item-3">
          <sng-accordion-trigger>Another Enabled Item</sng-accordion-trigger>
          <sng-accordion-content>This item also works normally.</sng-accordion-content>
        </sng-accordion-item>
      </sng-accordion>
    `,
  }),
};

/**
 * FAQ-style accordion with longer content.
 */
export const FAQ: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
    },
    template: `
      <div class="max-w-lg">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">Frequently Asked Questions</h2>
        <sng-accordion type="single" collapsible class="w-full">
          <sng-accordion-item value="faq-1">
            <sng-accordion-trigger>What payment methods do you accept?</sng-accordion-trigger>
            <sng-accordion-content>
              We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For enterprise customers, we also offer invoice-based billing.
            </sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="faq-2">
            <sng-accordion-trigger>How do I cancel my subscription?</sng-accordion-trigger>
            <sng-accordion-content>
              You can cancel your subscription at any time from your account settings. Go to Settings → Billing → Cancel Subscription. Your access will continue until the end of your current billing period.
            </sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="faq-3">
            <sng-accordion-trigger>Is there a free trial available?</sng-accordion-trigger>
            <sng-accordion-content>
              Yes! We offer a 14-day free trial with full access to all features. No credit card required. Simply sign up and start exploring.
            </sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="faq-4">
            <sng-accordion-trigger>Do you offer refunds?</sng-accordion-trigger>
            <sng-accordion-content>
              We offer a 30-day money-back guarantee for annual plans. Monthly plans can be cancelled at any time but are non-refundable for the current billing period.
            </sng-accordion-content>
          </sng-accordion-item>
        </sng-accordion>
      </div>
    `,
  }),
};

/**
 * Standalone collapsible - accordion item without parent accordion.
 * Works like a simple collapsible panel with its own open/close state.
 */
export const Collapsible: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
    },
    template: `
      <div class="max-w-md space-y-4">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Standalone Collapsible</h3>
        <sng-accordion-item [defaultOpen]="true" class="rounded-lg border">
          <sng-accordion-trigger class="px-4">Show more details</sng-accordion-trigger>
          <sng-accordion-content class="px-4">
            This is a standalone collapsible panel. It manages its own open/close state
            without needing a parent accordion. Perfect for "show more" sections or
            expandable cards.
          </sng-accordion-content>
        </sng-accordion-item>
      </div>
    `,
  }),
};

/**
 * Collapsible with custom trigger - no chevron icon.
 * Use showChevron="false" for fully custom trigger content.
 */
export const CollapsibleCustomTrigger: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
    },
    template: `
      <div class="max-w-md space-y-4">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Custom Trigger (No Chevron)</h3>
        <sng-accordion-item class="rounded-lg border">
          <sng-accordion-trigger class="px-4" [showChevron]="false">
            <span class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Advanced Settings
            </span>
          </sng-accordion-trigger>
          <sng-accordion-content class="px-4">
            This collapsible has a custom trigger with its own icon.
            The showChevron input is set to false to hide the default chevron.
          </sng-accordion-content>
        </sng-accordion-item>
      </div>
    `,
  }),
};
