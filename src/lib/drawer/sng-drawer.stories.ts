import { type Meta, type StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { SngDrawer } from './sng-drawer';
import { SngDrawerContent } from './sng-drawer-content';
import { SngDrawerHeader } from './sng-drawer-header';
import { SngDrawerTitle } from './sng-drawer-title';
import { SngDrawerDescription } from './sng-drawer-description';
import { SngDrawerFooter } from './sng-drawer-footer';
import { SngDrawerHandle } from './sng-drawer-handle';
import { SngDrawerClose } from './sng-drawer-close';
import { SngDrawerWrapper } from './sng-drawer-wrapper';

@Component({
  selector: 'drawer-demo',
  standalone: true,
  imports: [
    SngDrawer,
    SngDrawerContent,
    SngDrawerHeader,
    SngDrawerTitle,
    SngDrawerDescription,
    SngDrawerFooter,
    SngDrawerHandle,
    SngDrawerClose,
    SngDrawerWrapper,
  ],
  template: `
    <sng-drawer-wrapper class="p-4">
      <sng-drawer #drawer side="bottom">
        <button
          (click)="drawer.open(content)"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Open Drawer
        </button>
        <ng-template #content>
          <sng-drawer-content>
            <sng-drawer-handle />
            <sng-drawer-header>
              <sng-drawer-title>Move Goal</sng-drawer-title>
              <sng-drawer-description>Set your daily activity goal.</sng-drawer-description>
            </sng-drawer-header>
            <div class="p-4">
              <div class="flex items-center justify-center gap-4">
                <button
                  class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent"
                  (click)="decrementGoal()"
                >
                  -
                </button>
                <div class="text-4xl font-bold">{{ goal }}</div>
                <button
                  class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent"
                  (click)="incrementGoal()"
                >
                  +
                </button>
              </div>
              <p class="text-center text-sm text-muted-foreground mt-2">calories per day</p>
            </div>
            <sng-drawer-footer>
              <sng-drawer-close
                class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full"
              >
                Submit
              </sng-drawer-close>
            </sng-drawer-footer>
          </sng-drawer-content>
        </ng-template>
      </sng-drawer>
    </sng-drawer-wrapper>
  `,
})
class DrawerDemoComponent {
  goal = 350;
  incrementGoal() { this.goal += 10; }
  decrementGoal() { this.goal = Math.max(0, this.goal - 10); }
}

@Component({
  selector: 'drawer-sides-demo',
  standalone: true,
  imports: [
    SngDrawer,
    SngDrawerContent,
    SngDrawerHeader,
    SngDrawerTitle,
    SngDrawerDescription,
    SngDrawerFooter,
    SngDrawerHandle,
    SngDrawerClose,
    SngDrawerWrapper,
  ],
  template: `
    <sng-drawer-wrapper class="p-4 space-y-4">
      <div class="flex flex-wrap gap-4">
        <sng-drawer #topDrawer side="top">
          <button
            (click)="topDrawer.open(topContent)"
            class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
          >
            Top Drawer
          </button>
          <ng-template #topContent>
            <sng-drawer-content>
              <sng-drawer-header>
                <sng-drawer-title>Top Drawer</sng-drawer-title>
                <sng-drawer-description>This drawer slides from the top.</sng-drawer-description>
              </sng-drawer-header>
              <div class="p-4">
                <p>Content for top drawer.</p>
              </div>
              <sng-drawer-footer>
                <sng-drawer-close class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent w-full">Close</sng-drawer-close>
              </sng-drawer-footer>
            </sng-drawer-content>
          </ng-template>
        </sng-drawer>

        <sng-drawer #bottomDrawer side="bottom">
          <button
            (click)="bottomDrawer.open(bottomContent)"
            class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
          >
            Bottom Drawer
          </button>
          <ng-template #bottomContent>
            <sng-drawer-content>
              <sng-drawer-handle />
              <sng-drawer-header>
                <sng-drawer-title>Bottom Drawer</sng-drawer-title>
                <sng-drawer-description>This drawer slides from the bottom.</sng-drawer-description>
              </sng-drawer-header>
              <div class="p-4">
                <p>Content for bottom drawer.</p>
              </div>
              <sng-drawer-footer>
                <sng-drawer-close class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent w-full">Close</sng-drawer-close>
              </sng-drawer-footer>
            </sng-drawer-content>
          </ng-template>
        </sng-drawer>

        <sng-drawer #leftDrawer side="left">
          <button
            (click)="leftDrawer.open(leftContent)"
            class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
          >
            Left Drawer
          </button>
          <ng-template #leftContent>
            <sng-drawer-content class="max-w-sm">
              <sng-drawer-header>
                <sng-drawer-title>Left Drawer</sng-drawer-title>
                <sng-drawer-description>This drawer slides from the left.</sng-drawer-description>
              </sng-drawer-header>
              <div class="p-4 flex-1">
                <p>Content for left drawer.</p>
              </div>
              <sng-drawer-footer>
                <sng-drawer-close class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent w-full">Close</sng-drawer-close>
              </sng-drawer-footer>
            </sng-drawer-content>
          </ng-template>
        </sng-drawer>

        <sng-drawer #rightDrawer side="right">
          <button
            (click)="rightDrawer.open(rightContent)"
            class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
          >
            Right Drawer
          </button>
          <ng-template #rightContent>
            <sng-drawer-content class="max-w-sm">
              <sng-drawer-header>
                <sng-drawer-title>Right Drawer</sng-drawer-title>
                <sng-drawer-description>This drawer slides from the right.</sng-drawer-description>
              </sng-drawer-header>
              <div class="p-4 flex-1">
                <p>Content for right drawer.</p>
              </div>
              <sng-drawer-footer>
                <sng-drawer-close class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent w-full">Close</sng-drawer-close>
              </sng-drawer-footer>
            </sng-drawer-content>
          </ng-template>
        </sng-drawer>
      </div>
    </sng-drawer-wrapper>
  `,
})
class DrawerSidesDemoComponent {}

@Component({
  selector: 'drawer-no-scale-demo',
  standalone: true,
  imports: [
    SngDrawer,
    SngDrawerContent,
    SngDrawerHeader,
    SngDrawerTitle,
    SngDrawerDescription,
    SngDrawerFooter,
    SngDrawerHandle,
    SngDrawerClose,
  ],
  template: `
    <div class="p-4">
      <sng-drawer #drawer side="bottom" [shouldScaleBackground]="false">
        <button
          (click)="drawer.open(content)"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Open (No Scale)
        </button>
        <ng-template #content>
          <sng-drawer-content>
            <sng-drawer-handle />
            <sng-drawer-header>
              <sng-drawer-title>No Background Scale</sng-drawer-title>
              <sng-drawer-description>This drawer opens without scaling the background.</sng-drawer-description>
            </sng-drawer-header>
            <div class="p-4">
              <p>Background remains at full size.</p>
            </div>
            <sng-drawer-footer>
              <sng-drawer-close class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent w-full">Close</sng-drawer-close>
            </sng-drawer-footer>
          </sng-drawer-content>
        </ng-template>
      </sng-drawer>
    </div>
  `,
})
class DrawerNoScaleDemoComponent {}

@Component({
  selector: 'drawer-modal-demo',
  standalone: true,
  imports: [
    SngDrawer,
    SngDrawerContent,
    SngDrawerHeader,
    SngDrawerTitle,
    SngDrawerDescription,
    SngDrawerFooter,
    SngDrawerClose,
  ],
  template: `
    <div class="p-4">
      <sng-drawer #drawer side="right" [modal]="true">
        <button
          (click)="drawer.open(content)"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Open Modal Drawer
        </button>
        <ng-template #content>
          <sng-drawer-content class="sm:max-w-[400px]">
            <sng-drawer-header>
              <sng-drawer-title>Modal Mode</sng-drawer-title>
              <sng-drawer-description>This drawer uses modal mode with a darker backdrop and no background scaling.</sng-drawer-description>
            </sng-drawer-header>
            <div class="p-4 flex-1">
              <p>Works like a Sheet component - traditional modal overlay behavior.</p>
            </div>
            <sng-drawer-footer>
              <sng-drawer-close class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent">Cancel</sng-drawer-close>
              <sng-drawer-close class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save</sng-drawer-close>
            </sng-drawer-footer>
          </sng-drawer-content>
        </ng-template>
      </sng-drawer>
    </div>
  `,
})
class DrawerModalDemoComponent {}

const meta: Meta = {
  title: 'UI/Drawer',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/**
 * Default bottom drawer with handle and goal setter example.
 */
export const Default: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [DrawerDemoComponent],
    },
    template: `<drawer-demo />`,
  }),
};

/**
 * Drawer from all four sides: top, bottom, left, right.
 */
export const AllSides: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [DrawerSidesDemoComponent],
    },
    template: `<drawer-sides-demo />`,
  }),
};

/**
 * Drawer without background scaling animation.
 */
export const NoBackgroundScale: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [DrawerNoScaleDemoComponent],
    },
    template: `<drawer-no-scale-demo />`,
  }),
};

/**
 * Modal mode drawer (Sheet-like behavior) with darker backdrop and no background scaling.
 */
export const ModalMode: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [DrawerModalDemoComponent],
    },
    template: `<drawer-modal-demo />`,
  }),
};
