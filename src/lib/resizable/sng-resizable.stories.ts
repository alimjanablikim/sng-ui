import { type Meta, type StoryObj } from '@storybook/angular';
import { SngResizableGroup } from './sng-resizable-group';
import { SngResizablePanel } from './sng-resizable-panel';
import { SngResizableHandle } from './sng-resizable-handle';

const meta: Meta<SngResizableGroup> = {
  title: 'UI/Resizable',
  component: SngResizableGroup,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Direction of the resizable panels',
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<SngResizableGroup>;

/**
 * Default horizontal resizable panels.
 */
export const Default: Story = {
  render: (args) => ({
    moduleMetadata: {
      imports: [SngResizableGroup, SngResizablePanel, SngResizableHandle],
    },
    props: args,
    template: `
      <sng-resizable-group [direction]="direction" class="min-h-[200px] max-w-md rounded-lg border">
        <sng-resizable-panel [defaultSize]="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">One</span>
          </div>
        </sng-resizable-panel>
        <sng-resizable-handle />
        <sng-resizable-panel [defaultSize]="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Two</span>
          </div>
        </sng-resizable-panel>
      </sng-resizable-group>
    `,
  }),
  args: {
    direction: 'horizontal',
  },
};

/**
 * Vertical resizable panels.
 */
export const Vertical: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngResizableGroup, SngResizablePanel, SngResizableHandle],
    },
    template: `
      <sng-resizable-group direction="vertical" class="min-h-[300px] max-w-md rounded-lg border">
        <sng-resizable-panel [defaultSize]="30">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Header</span>
          </div>
        </sng-resizable-panel>
        <sng-resizable-handle />
        <sng-resizable-panel [defaultSize]="70">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Content</span>
          </div>
        </sng-resizable-panel>
      </sng-resizable-group>
    `,
  }),
};

/**
 * Resizable panels with visible grip handles.
 */
export const WithHandle: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngResizableGroup, SngResizablePanel, SngResizableHandle],
    },
    template: `
      <sng-resizable-group direction="horizontal" class="min-h-[200px] max-w-md rounded-lg border">
        <sng-resizable-panel [defaultSize]="30">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Sidebar</span>
          </div>
        </sng-resizable-panel>
        <sng-resizable-handle [withHandle]="true" />
        <sng-resizable-panel [defaultSize]="70">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Content</span>
          </div>
        </sng-resizable-panel>
      </sng-resizable-group>
    `,
  }),
};

/**
 * Three-panel layout with two handles.
 */
export const ThreePanels: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngResizableGroup, SngResizablePanel, SngResizableHandle],
    },
    template: `
      <sng-resizable-group direction="horizontal" class="min-h-[200px] max-w-2xl rounded-lg border">
        <sng-resizable-panel [defaultSize]="25" [minSize]="15">
          <div class="flex h-full items-center justify-center p-6 bg-muted/30">
            <span class="font-semibold">Left</span>
          </div>
        </sng-resizable-panel>
        <sng-resizable-handle [withHandle]="true" />
        <sng-resizable-panel [defaultSize]="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Center</span>
          </div>
        </sng-resizable-panel>
        <sng-resizable-handle [withHandle]="true" />
        <sng-resizable-panel [defaultSize]="25" [minSize]="15">
          <div class="flex h-full items-center justify-center p-6 bg-muted/30">
            <span class="font-semibold">Right</span>
          </div>
        </sng-resizable-panel>
      </sng-resizable-group>
    `,
  }),
};

/**
 * Nested resizable groups for complex layouts.
 */
export const NestedLayout: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngResizableGroup, SngResizablePanel, SngResizableHandle],
    },
    template: `
      <sng-resizable-group direction="horizontal" class="min-h-[400px] max-w-3xl rounded-lg border">
        <sng-resizable-panel [defaultSize]="25" [minSize]="15">
          <div class="flex h-full items-center justify-center bg-muted/30">
            <span class="font-semibold">Sidebar</span>
          </div>
        </sng-resizable-panel>
        <sng-resizable-handle />
        <sng-resizable-panel [defaultSize]="75">
          <sng-resizable-group direction="vertical" class="h-full">
            <sng-resizable-panel [defaultSize]="30">
              <div class="flex h-full items-center justify-center bg-primary/10">
                <span class="font-semibold">Top</span>
              </div>
            </sng-resizable-panel>
            <sng-resizable-handle />
            <sng-resizable-panel [defaultSize]="70">
              <div class="flex h-full items-center justify-center">
                <span class="font-semibold">Main Content</span>
              </div>
            </sng-resizable-panel>
          </sng-resizable-group>
        </sng-resizable-panel>
      </sng-resizable-group>
    `,
  }),
};

/**
 * Panels with minimum and maximum size constraints.
 */
export const WithConstraints: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngResizableGroup, SngResizablePanel, SngResizableHandle],
    },
    template: `
      <sng-resizable-group direction="horizontal" class="min-h-[200px] max-w-md rounded-lg border">
        <sng-resizable-panel [defaultSize]="50" [minSize]="20" [maxSize]="80">
          <div class="flex h-full flex-col items-center justify-center p-6">
            <span class="font-semibold">Left</span>
            <span class="text-xs text-muted-foreground mt-1">min: 20%, max: 80%</span>
          </div>
        </sng-resizable-panel>
        <sng-resizable-handle [withHandle]="true" />
        <sng-resizable-panel [defaultSize]="50" [minSize]="20" [maxSize]="80">
          <div class="flex h-full flex-col items-center justify-center p-6">
            <span class="font-semibold">Right</span>
            <span class="text-xs text-muted-foreground mt-1">min: 20%, max: 80%</span>
          </div>
        </sng-resizable-panel>
      </sng-resizable-group>
    `,
  }),
};
