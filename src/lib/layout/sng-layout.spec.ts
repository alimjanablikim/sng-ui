import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink, RouterLinkActive } from '@angular/router';
import { SngLayoutHeader } from './sng-layout-header';
import { SngLayoutFooter } from './sng-layout-footer';
import { SngLayoutSidebarProvider } from './sng-layout-sidebar-provider';
import { SngLayoutSidebar } from './sng-layout-sidebar';
import { SngLayoutSidebarContent } from './sng-layout-sidebar-content';
import { SngLayoutSidebarInset } from './sng-layout-sidebar-inset';
import { SngLayoutSidebarMenu } from './sng-layout-sidebar-menu';
import { SngLayoutSidebarMenuItem } from './sng-layout-sidebar-menu-item';
import { SngLayoutSidebarMenuButton } from './sng-layout-sidebar-menu-button';
import { SngLayoutSidebarMenuSubButton } from './sng-layout-sidebar-menu-sub-button';
import { SngLayoutSidebarRail } from './sng-layout-sidebar-rail';

@Component({
  standalone: true,
  imports: [SngLayoutHeader, SngLayoutFooter],
  template: `
    <sng-layout-header [class]="headerClass">
      <span>Header Content</span>
    </sng-layout-header>
    <main>Main Content</main>
    <sng-layout-footer [class]="footerClass">
      <span>Footer Content</span>
    </sng-layout-footer>
  `,
})
class BasicLayoutComponent {
  headerClass = '';
  footerClass = '';
}

@Component({
  standalone: true,
  imports: [
    SngLayoutSidebarProvider,
    SngLayoutSidebar,
    SngLayoutSidebarContent,
    SngLayoutSidebarInset,
    SngLayoutSidebarMenu,
    SngLayoutSidebarMenuItem,
    SngLayoutSidebarMenuButton,
    SngLayoutHeader,
  ],
  template: `
    <sng-layout-sidebar-provider [defaultOpen]="defaultOpen">
      <sng-layout-sidebar [side]="side" [collapsible]="collapsible">
        <sng-layout-sidebar-content>
          <sng-layout-sidebar-menu>
            <sng-layout-sidebar-menu-item>
              <sng-layout-sidebar-menu-button>Home</sng-layout-sidebar-menu-button>
            </sng-layout-sidebar-menu-item>
            <sng-layout-sidebar-menu-item>
              <sng-layout-sidebar-menu-button>Settings</sng-layout-sidebar-menu-button>
            </sng-layout-sidebar-menu-item>
          </sng-layout-sidebar-menu>
        </sng-layout-sidebar-content>
      </sng-layout-sidebar>
      <sng-layout-sidebar-inset>
        <sng-layout-header>Inset Header</sng-layout-header>
        <main>Inset Content</main>
      </sng-layout-sidebar-inset>
    </sng-layout-sidebar-provider>
  `,
})
class SidebarLayoutComponent {
  defaultOpen = true;
  side: 'left' | 'right' = 'left';
  collapsible: 'offcanvas' | 'icon' | 'none' = 'offcanvas';
}

@Component({
  standalone: true,
  imports: [SngLayoutSidebarMenuButton, SngLayoutSidebarMenuSubButton],
  template: `
    <div id="plain-item">
      <sng-layout-sidebar-menu-button>Plain</sng-layout-sidebar-menu-button>
    </div>
    <div id="link-item">
      <sng-layout-sidebar-menu-button href="/docs">Link</sng-layout-sidebar-menu-button>
    </div>
    <div id="unsafe-item">
      <sng-layout-sidebar-menu-button href="javascript:void(0)">Unsafe</sng-layout-sidebar-menu-button>
    </div>
    <div id="disabled-item">
      <sng-layout-sidebar-menu-button href="/disabled" [disabled]="true">Disabled</sng-layout-sidebar-menu-button>
    </div>

    <div id="sub-plain-item">
      <sng-layout-sidebar-menu-sub-button>Sub Plain</sng-layout-sidebar-menu-sub-button>
    </div>
    <div id="sub-link-item">
      <sng-layout-sidebar-menu-sub-button href="/sub-docs">Sub Link</sng-layout-sidebar-menu-sub-button>
    </div>
  `,
})
class SidebarMenuButtonModesComponent {}
@Component({
  standalone: true,
  imports: [SngLayoutSidebarMenuButton, SngLayoutSidebarMenuSubButton],
  template: `
    <div id="router-item">
      <sng-layout-sidebar-menu-button [routerLink]="['/docs']">Router Link</sng-layout-sidebar-menu-button>
    </div>
    <div id="sub-router-item">
      <sng-layout-sidebar-menu-sub-button [routerLink]="['/sub-docs']">Sub Router Link</sng-layout-sidebar-menu-sub-button>
    </div>
  `,
})
class SidebarMenuButtonRouterProjectionComponent {}

@Component({
  standalone: true,
  imports: [SngLayoutSidebarMenuButton, SngLayoutSidebarMenuSubButton, RouterLink, RouterLinkActive],
  template: `
    <div id="router-scope-item">
      <sng-layout-sidebar-menu-button [routerLink]="['/docs']" routerLinkActive #rla="routerLinkActive" [isActive]="rla.isActive">
        Scoped Router Link
      </sng-layout-sidebar-menu-button>
    </div>
    <div id="router-scope-sub-item">
      <sng-layout-sidebar-menu-sub-button [routerLink]="['/docs/sub']" routerLinkActive #rlaSub="routerLinkActive" [isActive]="rlaSub.isActive">
        Scoped Sub Router Link
      </sng-layout-sidebar-menu-sub-button>
    </div>
  `,
})
class SidebarMenuButtonRouterScopeComponent {}

@Component({
  standalone: true,
  imports: [
    SngLayoutSidebarProvider,
    SngLayoutSidebar,
    SngLayoutSidebarContent,
    SngLayoutSidebarRail,
  ],
  template: `
    <sng-layout-sidebar-provider>
      <sng-layout-sidebar>
        <sng-layout-sidebar-content>Nav</sng-layout-sidebar-content>
        <sng-layout-sidebar-rail />
      </sng-layout-sidebar>
    </sng-layout-sidebar-provider>
  `,
})
class SidebarRailComponent {}

describe('SngLayout', () => {
  describe('Basic Layout', () => {
    let fixture: ComponentFixture<BasicLayoutComponent>;
    let host: BasicLayoutComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicLayoutComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(BasicLayoutComponent);
      host = fixture.componentInstance;
    });

    it('should create header and footer', () => {
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector('sng-layout-header');
      const footer = fixture.nativeElement.querySelector('sng-layout-footer');
      expect(header).toBeTruthy();
      expect(footer).toBeTruthy();
    });

    it('should project content into header', () => {
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector('sng-layout-header');
      expect(header.textContent).toContain('Header Content');
    });

    it('should project content into footer', () => {
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector('sng-layout-footer');
      expect(footer.textContent).toContain('Footer Content');
    });

    it('should apply custom class to header', () => {
      host.headerClass = 'sticky top-0';
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector('sng-layout-header');
      expect(header.classList.contains('sticky')).toBeTrue();
    });

    it('should apply custom class to footer', () => {
      host.footerClass = 'border-t';
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector('sng-layout-footer');
      expect(footer.classList.contains('border-t')).toBeTrue();
    });
  });

  describe('Sidebar Layout', () => {
    let fixture: ComponentFixture<SidebarLayoutComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SidebarLayoutComponent],
        providers: [
          provideZonelessChangeDetection(),
          provideRouter([]),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SidebarLayoutComponent);
    });

    it('should create sidebar provider', () => {
      fixture.detectChanges();
      const provider = fixture.nativeElement.querySelector('sng-layout-sidebar-provider');
      expect(provider).toBeTruthy();
    });

    it('should create sidebar', () => {
      fixture.detectChanges();
      const sidebar = fixture.nativeElement.querySelector('sng-layout-sidebar');
      expect(sidebar).toBeTruthy();
    });

    it('should create sidebar menu items', () => {
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('sng-layout-sidebar-menu-item');
      expect(items.length).toBe(2);
    });

    it('should have menu buttons with content', () => {
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll('sng-layout-sidebar-menu-button');
      expect(buttons[0].textContent).toContain('Home');
      expect(buttons[1].textContent).toContain('Settings');
    });

    it('should create sidebar inset', () => {
      fixture.detectChanges();
      const inset = fixture.nativeElement.querySelector('sng-layout-sidebar-inset');
      expect(inset).toBeTruthy();
    });

    it('should have sidebar content', () => {
      fixture.detectChanges();
      const content = fixture.nativeElement.querySelector('sng-layout-sidebar-content');
      expect(content).toBeTruthy();
    });
  });

  describe('Sidebar Lifecycle', () => {
    it('should force sidebar host display block on mobile when drawer opens', async () => {
      const originalMatchMedia = window.matchMedia;

      (window as Window & typeof globalThis).matchMedia = () =>
        ({
          matches: true,
          media: '(max-width: 767.98px)',
          onchange: null,
          addListener: () => undefined,
          removeListener: () => undefined,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => true,
        }) as MediaQueryList;

      try {
        await TestBed.configureTestingModule({
          imports: [SidebarLayoutComponent],
          providers: [
            provideZonelessChangeDetection(),
            provideRouter([]),
          ],
        }).compileComponents();

        const fixture = TestBed.createComponent(SidebarLayoutComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const provider = fixture.debugElement.query(By.directive(SngLayoutSidebarProvider))
          .componentInstance as SngLayoutSidebarProvider;
        provider.setOpenMobile(true);
        fixture.detectChanges();
        await fixture.whenStable();

        const sidebar = fixture.nativeElement.querySelector('sng-layout-sidebar') as HTMLElement;
        expect(sidebar.style.display).toBe('block');
      } finally {
        (window as Window & typeof globalThis).matchMedia = originalMatchMedia;
      }
    });

    it('should restore body overflow when destroyed with open mobile drawer', async () => {
      const originalMatchMedia = window.matchMedia;
      document.body.style.overflow = '';

      (window as Window & typeof globalThis).matchMedia = () =>
        ({
          matches: true,
          media: '(max-width: 767.98px)',
          onchange: null,
          addListener: () => undefined,
          removeListener: () => undefined,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => true,
        }) as MediaQueryList;

      try {
        await TestBed.configureTestingModule({
          imports: [SidebarLayoutComponent],
          providers: [
            provideZonelessChangeDetection(),
            provideRouter([]),
          ],
        }).compileComponents();

        const fixture = TestBed.createComponent(SidebarLayoutComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const provider = fixture.debugElement.query(By.directive(SngLayoutSidebarProvider))
          .componentInstance as SngLayoutSidebarProvider;

        provider.setOpenMobile(true);
        fixture.detectChanges();
        expect(document.body.style.overflow).toBe('hidden');

        fixture.destroy();
        expect(document.body.style.overflow).toBe('');
      } finally {
        (window as Window & typeof globalThis).matchMedia = originalMatchMedia;
        document.body.style.overflow = '';
      }
    });
  });

  describe('Sidebar Menu Button Modes', () => {
    let fixture: ComponentFixture<SidebarMenuButtonModesComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SidebarMenuButtonModesComponent],
        providers: [
          provideZonelessChangeDetection(),
          provideRouter([]),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SidebarMenuButtonModesComponent);
      fixture.detectChanges();
    });

    it('should render menu button as native button when no link target is provided', () => {
      const host = fixture.nativeElement.querySelector('#plain-item');
      expect(host.querySelector('button')).toBeTruthy();
      expect(host.querySelector('a')).toBeFalsy();
    });

    it('should render menu button as anchor when href is provided', () => {
      const host = fixture.nativeElement.querySelector('#link-item');
      const anchor = host.querySelector('a') as HTMLAnchorElement;
      expect(anchor).toBeTruthy();
      expect(anchor.getAttribute('href')).toBe('/docs');
    });

    it('should block javascript href and render menu button as native button', () => {
      const host = fixture.nativeElement.querySelector('#unsafe-item');
      expect(host.querySelector('button')).toBeTruthy();
      expect(host.querySelector('a')).toBeFalsy();
    });

    it('should expose disabled semantics on anchor mode', () => {
      const host = fixture.nativeElement.querySelector('#disabled-item');
      const anchor = host.querySelector('a') as HTMLAnchorElement;
      expect(anchor).toBeTruthy();
      expect(anchor.getAttribute('aria-disabled')).toBe('true');
      expect(anchor.getAttribute('tabindex')).toBe('-1');
      expect(anchor.hasAttribute('href')).toBeFalse();
    });

    it('should render sub-menu button as native button when no link target is provided', () => {
      const host = fixture.nativeElement.querySelector('#sub-plain-item');
      expect(host.querySelector('button')).toBeTruthy();
      expect(host.querySelector('a')).toBeFalsy();
    });

    it('should render sub-menu button as anchor when href is provided', () => {
      const host = fixture.nativeElement.querySelector('#sub-link-item');
      const anchor = host.querySelector('a') as HTMLAnchorElement;
      expect(anchor).toBeTruthy();
      expect(anchor.getAttribute('href')).toBe('/sub-docs');
    });

    it('should preserve projected sub-menu label text without template wrappers', () => {
      const host = fixture.nativeElement.querySelector('#sub-plain-item');
      const button = host.querySelector('button') as HTMLButtonElement;
      const injectedWrapper = button.querySelector('span.min-w-0.truncate');

      expect(button.textContent?.trim()).toContain('Sub Plain');
      expect(injectedWrapper).toBeFalsy();
    });
  });

  describe('Sidebar Menu Button RouterLink Projection', () => {
    let fixture: ComponentFixture<SidebarMenuButtonRouterProjectionComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SidebarMenuButtonRouterProjectionComponent],
        providers: [
          provideZonelessChangeDetection(),
          provideRouter([]),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SidebarMenuButtonRouterProjectionComponent);
      fixture.detectChanges();
    });

    it('should project content for menu button when routerLink is provided', () => {
      const host = fixture.nativeElement.querySelector('#router-item');
      const button = host.querySelector('button') as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.textContent?.trim()).toContain('Router Link');
    });

    it('should project content for sub-menu button when routerLink is provided', () => {
      const host = fixture.nativeElement.querySelector('#sub-router-item');
      const button = host.querySelector('button') as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.textContent?.trim()).toContain('Sub Router Link');
    });
  });

  describe('Sidebar Menu Button Router Scope', () => {
    let fixture: ComponentFixture<SidebarMenuButtonRouterScopeComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SidebarMenuButtonRouterScopeComponent],
        providers: [
          provideZonelessChangeDetection(),
          provideRouter([]),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SidebarMenuButtonRouterScopeComponent);
      fixture.detectChanges();
    });

    it('should render menu button content when router directives are in template scope', () => {
      const host = fixture.nativeElement.querySelector('#router-scope-item');
      expect(host.textContent?.trim()).toContain('Scoped Router Link');
    });

    it('should render sub-menu button content when router directives are in template scope', () => {
      const host = fixture.nativeElement.querySelector('#router-scope-sub-item');
      expect(host.textContent?.trim()).toContain('Scoped Sub Router Link');
    });
  });

  describe('Sidebar Rail', () => {
    it('should use pointer cursor and not resize cursors', async () => {
      await TestBed.configureTestingModule({
        imports: [SidebarRailComponent],
        providers: [
          provideZonelessChangeDetection(),
          provideRouter([]),
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(SidebarRailComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const rail = fixture.nativeElement.querySelector('sng-layout-sidebar-rail');
      const className = rail?.getAttribute('class') ?? '';

      expect(className).toContain('cursor-pointer');
      expect(className).not.toContain('cursor-w-resize');
      expect(className).not.toContain('cursor-e-resize');
    });
  });
});
