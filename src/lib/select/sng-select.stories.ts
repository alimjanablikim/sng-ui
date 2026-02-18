import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngSelect } from './sng-select';
import { SngSelectItem } from './sng-select-item';
import { SngSelectGroup } from './sng-select-group';
import { SngSelectLabel } from './sng-select-label';
import { SngSelectSeparator } from './sng-select-separator';
import { SngSelectEmpty } from './sng-select-empty';

/**
 * Select provides a dropdown selection interface.
 *
 * Built with Angular CDK Overlay for viewport-aware positioning.
 * Supports two-way binding via model() and grouped items.
 *
 * Size is controlled via Tailwind classes: h-8 text-xs py-1 px-2.5 (small),
 * h-9 text-sm py-2 px-3 (default), h-10 text-base py-2.5 px-4 (large).
 */
const meta: Meta<SngSelect> = {
  title: 'UI/Select',
  component: SngSelect,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Select an option' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes. Use Tailwind classes to control size: h-8 text-xs (sm), h-9 text-sm (default), h-10 text-base (lg).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem],
    },
    template: `
      <div class="w-[200px]">
        <sng-select ${argsToTemplate(args)}>
          <sng-select-item value="apple">Apple</sng-select-item>
          <sng-select-item value="banana">Banana</sng-select-item>
          <sng-select-item value="orange">Orange</sng-select-item>
          <sng-select-item value="grape">Grape</sng-select-item>
          <sng-select-item value="mango">Mango</sng-select-item>
        </sng-select>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<SngSelect>;

/**
 * Default select with placeholder and items.
 */
export const Default: Story = {
  args: {
    placeholder: 'Select a fruit',
  },
};

/**
 * Small size variant.
 */
export const Small: Story = {
  args: {
    placeholder: 'Small select',
    class: 'h-8 text-xs py-1 px-2.5',
  },
};

/**
 * Large size variant.
 */
export const Large: Story = {
  args: {
    placeholder: 'Large select',
    class: 'h-10 text-base py-2.5 px-4',
  },
};

/**
 * Disabled select state.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Select a fruit',
    disabled: true,
  },
};

/**
 * Select with some disabled items.
 */
export const WithDisabledItems: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem],
    },
    template: `
      <div class="w-[200px]">
        <sng-select placeholder="Select a fruit">
          <sng-select-item value="apple">Apple</sng-select-item>
          <sng-select-item value="banana" [isDisabled]="true">Banana (Out of stock)</sng-select-item>
          <sng-select-item value="orange">Orange</sng-select-item>
          <sng-select-item value="grape" [isDisabled]="true">Grape (Out of stock)</sng-select-item>
          <sng-select-item value="mango">Mango</sng-select-item>
        </sng-select>
      </div>
    `,
  }),
};

/**
 * Select with grouped items.
 */
export const WithGroups: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem, SngSelectGroup, SngSelectLabel, SngSelectSeparator],
    },
    template: `
      <div class="w-[200px]">
        <sng-select placeholder="Select a timezone">
          <sng-select-group>
            <sng-select-label>North America</sng-select-label>
            <sng-select-item value="est">Eastern Standard Time (EST)</sng-select-item>
            <sng-select-item value="cst">Central Standard Time (CST)</sng-select-item>
            <sng-select-item value="mst">Mountain Standard Time (MST)</sng-select-item>
            <sng-select-item value="pst">Pacific Standard Time (PST)</sng-select-item>
          </sng-select-group>
          <sng-select-separator />
          <sng-select-group>
            <sng-select-label>Europe</sng-select-label>
            <sng-select-item value="gmt">Greenwich Mean Time (GMT)</sng-select-item>
            <sng-select-item value="cet">Central European Time (CET)</sng-select-item>
            <sng-select-item value="eet">Eastern European Time (EET)</sng-select-item>
          </sng-select-group>
          <sng-select-separator />
          <sng-select-group>
            <sng-select-label>Asia</sng-select-label>
            <sng-select-item value="ist">India Standard Time (IST)</sng-select-item>
            <sng-select-item value="cst-china">China Standard Time (CST)</sng-select-item>
            <sng-select-item value="jst">Japan Standard Time (JST)</sng-select-item>
          </sng-select-group>
        </sng-select>
      </div>
    `,
  }),
};

/**
 * Select with label.
 */
export const WithLabel: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem],
    },
    template: `
      <div class="grid w-[200px] gap-1.5">
        <label for="fruit-select" class="text-sm font-medium leading-none">Favorite fruit</label>
        <sng-select id="fruit-select" placeholder="Select a fruit">
          <sng-select-item value="apple">Apple</sng-select-item>
          <sng-select-item value="banana">Banana</sng-select-item>
          <sng-select-item value="orange">Orange</sng-select-item>
        </sng-select>
      </div>
    `,
  }),
};

/**
 * All size variants comparison.
 */
export const AllSizes: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem],
    },
    template: `
      <div class="flex flex-col gap-4 w-[200px]">
        <div class="space-y-1">
          <span class="text-sm text-muted-foreground">Small</span>
          <sng-select class="h-8 text-xs py-1 px-2.5" placeholder="Small select">
            <sng-select-item value="1">Option 1</sng-select-item>
            <sng-select-item value="2">Option 2</sng-select-item>
          </sng-select>
        </div>
        <div class="space-y-1">
          <span class="text-sm text-muted-foreground">Default</span>
          <sng-select placeholder="Default select">
            <sng-select-item value="1">Option 1</sng-select-item>
            <sng-select-item value="2">Option 2</sng-select-item>
          </sng-select>
        </div>
        <div class="space-y-1">
          <span class="text-sm text-muted-foreground">Large</span>
          <sng-select class="h-10 text-base py-2.5 px-4" placeholder="Large select">
            <sng-select-item value="1">Option 1</sng-select-item>
            <sng-select-item value="2">Option 2</sng-select-item>
          </sng-select>
        </div>
      </div>
    `,
  }),
};

/**
 * Pre-selected value.
 */
export const WithDefaultValue: Story = {
  render: () => ({
    props: {
      selectedValue: 'orange',
    },
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem],
    },
    template: `
      <div class="w-[200px]">
        <sng-select [(value)]="selectedValue" placeholder="Select a fruit">
          <sng-select-item value="apple">Apple</sng-select-item>
          <sng-select-item value="banana">Banana</sng-select-item>
          <sng-select-item value="orange">Orange</sng-select-item>
          <sng-select-item value="grape">Grape</sng-select-item>
        </sng-select>
        <p class="mt-2 text-sm text-muted-foreground">Selected: {{ selectedValue }}</p>
      </div>
    `,
  }),
};

// ============================================================================
// SEARCHABLE SELECT STORIES
// ============================================================================

/**
 * Default searchable select with framework options.
 */
export const SearchableDefault: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem, SngSelectGroup, SngSelectEmpty],
    },
    props: {
      selectedFramework: '',
    },
    template: `
      <div class="w-64">
        <sng-select searchable [(value)]="selectedFramework" placeholder="Select framework..." searchPlaceholder="Search frameworks...">
          <sng-select-empty>No framework found.</sng-select-empty>
          <sng-select-group>
            <sng-select-item value="angular">Angular</sng-select-item>
            <sng-select-item value="react">React</sng-select-item>
            <sng-select-item value="vue">Vue</sng-select-item>
            <sng-select-item value="svelte">Svelte</sng-select-item>
            <sng-select-item value="solid">SolidJS</sng-select-item>
          </sng-select-group>
        </sng-select>
        <p class="text-xs text-muted-foreground mt-2">Selected: {{ selectedFramework || 'none' }}</p>
      </div>
    `,
  }),
};

/**
 * Searchable select with pre-selected value.
 */
export const SearchableWithPreselected: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem, SngSelectGroup, SngSelectEmpty],
    },
    props: {
      selectedLanguage: 'typescript',
    },
    template: `
      <div class="w-64">
        <sng-select searchable [(value)]="selectedLanguage" placeholder="Select language..." searchPlaceholder="Search languages...">
          <sng-select-empty>No language found.</sng-select-empty>
          <sng-select-group>
            <sng-select-item value="javascript">JavaScript</sng-select-item>
            <sng-select-item value="typescript">TypeScript</sng-select-item>
            <sng-select-item value="python">Python</sng-select-item>
            <sng-select-item value="rust">Rust</sng-select-item>
            <sng-select-item value="go">Go</sng-select-item>
          </sng-select-group>
        </sng-select>
      </div>
    `,
  }),
};

/**
 * Disabled searchable select.
 */
export const SearchableDisabled: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem, SngSelectGroup, SngSelectEmpty],
    },
    template: `
      <div class="w-64">
        <sng-select searchable [disabled]="true" placeholder="Disabled select">
          <sng-select-empty>No results.</sng-select-empty>
          <sng-select-group>
            <sng-select-item value="option1">Option 1</sng-select-item>
            <sng-select-item value="option2">Option 2</sng-select-item>
          </sng-select-group>
        </sng-select>
      </div>
    `,
  }),
};

/**
 * Searchable select with disabled items.
 */
export const SearchableWithDisabledItems: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem, SngSelectGroup, SngSelectEmpty],
    },
    props: {
      selectedPlan: '',
    },
    template: `
      <div class="w-64">
        <sng-select searchable [(value)]="selectedPlan" placeholder="Select plan..." searchPlaceholder="Search plans...">
          <sng-select-empty>No plan found.</sng-select-empty>
          <sng-select-group>
            <sng-select-item value="free">Free</sng-select-item>
            <sng-select-item value="pro">Pro</sng-select-item>
            <sng-select-item value="enterprise" [isDisabled]="true">Enterprise (Contact us)</sng-select-item>
          </sng-select-group>
        </sng-select>
      </div>
    `,
  }),
};

/**
 * All searchable select size variants comparison.
 */
export const SearchableAllSizes: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem, SngSelectGroup, SngSelectEmpty],
    },
    template: `
      <div class="space-y-4 w-64">
        <div>
          <label class="text-xs text-muted-foreground mb-1 block">Small</label>
          <sng-select searchable class="h-8 text-xs px-2.5" placeholder="Select...">
            <sng-select-empty>No results.</sng-select-empty>
            <sng-select-group>
              <sng-select-item value="a">Option A</sng-select-item>
              <sng-select-item value="b">Option B</sng-select-item>
            </sng-select-group>
          </sng-select>
        </div>
        <div>
          <label class="text-xs text-muted-foreground mb-1 block">Default</label>
          <sng-select searchable placeholder="Select...">
            <sng-select-empty>No results.</sng-select-empty>
            <sng-select-group>
              <sng-select-item value="a">Option A</sng-select-item>
              <sng-select-item value="b">Option B</sng-select-item>
            </sng-select-group>
          </sng-select>
        </div>
        <div>
          <label class="text-xs text-muted-foreground mb-1 block">Large</label>
          <sng-select searchable class="h-10 text-base px-4" placeholder="Select...">
            <sng-select-empty>No results.</sng-select-empty>
            <sng-select-group>
              <sng-select-item value="a">Option A</sng-select-item>
              <sng-select-item value="b">Option B</sng-select-item>
            </sng-select-group>
          </sng-select>
        </div>
      </div>
    `,
  }),
};

/**
 * Country selector example with searchable select.
 */
export const SearchableCountrySelector: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngSelect, SngSelectItem, SngSelectGroup, SngSelectEmpty],
    },
    props: {
      selectedCountry: '',
    },
    template: `
      <div class="w-72">
        <label class="text-sm font-medium mb-2 block">Country</label>
        <sng-select searchable [(value)]="selectedCountry" placeholder="Select your country..." searchPlaceholder="Search countries...">
          <sng-select-empty>No country found.</sng-select-empty>
          <sng-select-group>
            <sng-select-item value="us">United States</sng-select-item>
            <sng-select-item value="uk">United Kingdom</sng-select-item>
            <sng-select-item value="ca">Canada</sng-select-item>
            <sng-select-item value="au">Australia</sng-select-item>
            <sng-select-item value="de">Germany</sng-select-item>
            <sng-select-item value="fr">France</sng-select-item>
            <sng-select-item value="jp">Japan</sng-select-item>
            <sng-select-item value="cn">China</sng-select-item>
            <sng-select-item value="in">India</sng-select-item>
            <sng-select-item value="br">Brazil</sng-select-item>
          </sng-select-group>
        </sng-select>
      </div>
    `,
  }),
};
