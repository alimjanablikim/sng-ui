import { type Meta, type StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { SngLayoutHeader } from './sng-layout-header';
import { SngLayoutFooter } from './sng-layout-footer';
import { SngLayoutSidebarProvider } from './sng-layout-sidebar-provider';
import { SngLayoutSidebar } from './sng-layout-sidebar';
import { SngLayoutSidebarHeader } from './sng-layout-sidebar-header';
import { SngLayoutSidebarContent } from './sng-layout-sidebar-content';
import { SngLayoutSidebarFooter } from './sng-layout-sidebar-footer';
import { SngLayoutSidebarInset } from './sng-layout-sidebar-inset';
import { SngLayoutSidebarTrigger } from './sng-layout-sidebar-trigger';
import { SngLayoutSidebarGroup } from './sng-layout-sidebar-group';
import { SngLayoutSidebarGroupLabel } from './sng-layout-sidebar-group-label';
import { SngLayoutSidebarGroupContent } from './sng-layout-sidebar-group-content';
import { SngLayoutSidebarMenu } from './sng-layout-sidebar-menu';
import { SngLayoutSidebarMenuItem } from './sng-layout-sidebar-menu-item';
import { SngLayoutSidebarMenuButton } from './sng-layout-sidebar-menu-button';
import { SngLayoutSidebarSeparator } from './sng-layout-sidebar-separator';

@Component({
  selector: 'layout-demo',
  standalone: true,
  imports: [
    SngLayoutHeader,
    SngLayoutFooter,
    SngLayoutSidebarProvider,
    SngLayoutSidebar,
    SngLayoutSidebarHeader,
    SngLayoutSidebarContent,
    SngLayoutSidebarFooter,
    SngLayoutSidebarInset,
    SngLayoutSidebarTrigger,
    SngLayoutSidebarGroup,
    SngLayoutSidebarGroupLabel,
    SngLayoutSidebarGroupContent,
    SngLayoutSidebarMenu,
    SngLayoutSidebarMenuItem,
    SngLayoutSidebarMenuButton,
    SngLayoutSidebarSeparator,
  ],
  template: `
    <sng-layout-sidebar-provider class="min-h-[400px]">
      <sng-layout-sidebar>
        <sng-layout-sidebar-header>
          <div class="flex items-center gap-2 px-4">
            <div class="h-8 w-8 rounded-lg bg-primary"></div>
            <span class="font-semibold">ShadNG</span>
          </div>
        </sng-layout-sidebar-header>
        <sng-layout-sidebar-content>
          <sng-layout-sidebar-group>
            <sng-layout-sidebar-group-label>Platform</sng-layout-sidebar-group-label>
            <sng-layout-sidebar-group-content>
              <sng-layout-sidebar-menu>
                <sng-layout-sidebar-menu-item>
                  <sng-layout-sidebar-menu-button>
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </sng-layout-sidebar-menu-button>
                </sng-layout-sidebar-menu-item>
                <sng-layout-sidebar-menu-item>
                  <sng-layout-sidebar-menu-button [isActive]="true">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </sng-layout-sidebar-menu-button>
                </sng-layout-sidebar-menu-item>
                <sng-layout-sidebar-menu-item>
                  <sng-layout-sidebar-menu-button>
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Users
                  </sng-layout-sidebar-menu-button>
                </sng-layout-sidebar-menu-item>
              </sng-layout-sidebar-menu>
            </sng-layout-sidebar-group-content>
          </sng-layout-sidebar-group>
          <sng-layout-sidebar-separator />
          <sng-layout-sidebar-group>
            <sng-layout-sidebar-group-label>Settings</sng-layout-sidebar-group-label>
            <sng-layout-sidebar-group-content>
              <sng-layout-sidebar-menu>
                <sng-layout-sidebar-menu-item>
                  <sng-layout-sidebar-menu-button>
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </sng-layout-sidebar-menu-button>
                </sng-layout-sidebar-menu-item>
              </sng-layout-sidebar-menu>
            </sng-layout-sidebar-group-content>
          </sng-layout-sidebar-group>
        </sng-layout-sidebar-content>
        <sng-layout-sidebar-footer>
          <div class="flex items-center gap-2 px-4 py-2">
            <div class="h-8 w-8 rounded-full bg-muted"></div>
            <div class="flex flex-col">
              <span class="text-sm font-medium">John Doe</span>
              <span class="text-xs text-muted-foreground">john&#64;example.com</span>
            </div>
          </div>
        </sng-layout-sidebar-footer>
      </sng-layout-sidebar>
      <sng-layout-sidebar-inset>
        <sng-layout-header class="flex items-center gap-4 border-b px-4">
          <sng-layout-sidebar-trigger />
          <h1 class="text-lg font-semibold">Dashboard</h1>
        </sng-layout-header>
        <main class="flex-1 p-4">
          <div class="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            Main content area
          </div>
        </main>
        <sng-layout-footer class="border-t px-4 py-2 text-xs text-muted-foreground">
          © 2024 ShadNG Inc. All rights reserved.
        </sng-layout-footer>
      </sng-layout-sidebar-inset>
    </sng-layout-sidebar-provider>
  `,
})
class LayoutDemoComponent {}

@Component({
  selector: 'header-footer-demo',
  standalone: true,
  imports: [SngLayoutHeader, SngLayoutFooter],
  template: `
    <div class="flex flex-col min-h-[300px] border rounded-lg">
      <sng-layout-header class="flex items-center justify-between px-4 border-b">
        <span class="font-semibold">My App</span>
        <nav class="flex gap-4 text-sm">
          <a href="#" class="text-muted-foreground hover:text-foreground">Home</a>
          <a href="#" class="text-muted-foreground hover:text-foreground">About</a>
          <a href="#" class="text-muted-foreground hover:text-foreground">Contact</a>
        </nav>
      </sng-layout-header>
      <main class="flex-1 p-4">
        <div class="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          Page content
        </div>
      </main>
      <sng-layout-footer class="flex items-center justify-between px-4 py-2 border-t text-xs text-muted-foreground">
        <span>© 2024 My App</span>
        <div class="flex gap-4">
          <a href="#" class="hover:text-foreground">Privacy</a>
          <a href="#" class="hover:text-foreground">Terms</a>
        </div>
      </sng-layout-footer>
    </div>
  `,
})
class HeaderFooterDemoComponent {}

const meta: Meta = {
  title: 'UI/Layout',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/**
 * Complete layout with sidebar, header, and footer.
 */
export const Default: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [LayoutDemoComponent],
    },
    template: `<layout-demo />`,
  }),
};

/**
 * Simple header and footer without sidebar.
 */
export const HeaderAndFooter: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [HeaderFooterDemoComponent],
    },
    template: `<header-footer-demo />`,
  }),
};
