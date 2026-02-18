import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngBreadcrumb } from './sng-breadcrumb';
import { SngBreadcrumbList } from './sng-breadcrumb-list';
import { SngBreadcrumbItem } from './sng-breadcrumb-item';
import { SngBreadcrumbLink } from './sng-breadcrumb-link';
import { SngBreadcrumbSeparator } from './sng-breadcrumb-separator';
import { SngBreadcrumbPage } from './sng-breadcrumb-page';

@Component({
  standalone: true,
  imports: [
    SngBreadcrumb,
    SngBreadcrumbList,
    SngBreadcrumbItem,
    SngBreadcrumbLink,
    SngBreadcrumbSeparator,
    SngBreadcrumbPage,
  ],
  template: `
    <sng-breadcrumb [class]="customClass">
      <sng-breadcrumb-list>
        <sng-breadcrumb-item>
          <sng-breadcrumb-link href="/">Home</sng-breadcrumb-link>
        </sng-breadcrumb-item>
        <sng-breadcrumb-separator />
        <sng-breadcrumb-item>
          <sng-breadcrumb-link href="/docs">Docs</sng-breadcrumb-link>
        </sng-breadcrumb-item>
        <sng-breadcrumb-separator />
        <sng-breadcrumb-item>
          <sng-breadcrumb-page>Current</sng-breadcrumb-page>
        </sng-breadcrumb-item>
      </sng-breadcrumb-list>
    </sng-breadcrumb>
  `,
})
class TestHostComponent {
  customClass = '';
}

describe('SngBreadcrumb', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let breadcrumb: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    breadcrumb = fixture.nativeElement.querySelector('sng-breadcrumb');
    expect(breadcrumb).toBeTruthy();
  });

  it('should have role="navigation"', () => {
    fixture.detectChanges();
    breadcrumb = fixture.nativeElement.querySelector('sng-breadcrumb');
    expect(breadcrumb.getAttribute('role')).toBe('navigation');
  });

  it('should have aria-label="breadcrumb"', () => {
    fixture.detectChanges();
    breadcrumb = fixture.nativeElement.querySelector('sng-breadcrumb');
    expect(breadcrumb.getAttribute('aria-label')).toBe('breadcrumb');
  });

  it('should apply custom class', () => {
    host.customClass = 'mb-4';
    fixture.detectChanges();
    breadcrumb = fixture.nativeElement.querySelector('sng-breadcrumb');
    expect(breadcrumb.classList.contains('mb-4')).toBeTrue();
  });

  it('should render all items', () => {
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('sng-breadcrumb-item');
    expect(items.length).toBe(3);
  });

  it('should render separators', () => {
    fixture.detectChanges();
    const separators = fixture.nativeElement.querySelectorAll('sng-breadcrumb-separator');
    expect(separators.length).toBe(2);
  });

  it('should render links with href', () => {
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('sng-breadcrumb-link');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('/');
    expect(links[1].getAttribute('href')).toBe('/docs');
  });

  it('should render current page', () => {
    fixture.detectChanges();
    const page = fixture.nativeElement.querySelector('sng-breadcrumb-page');
    expect(page).toBeTruthy();
    expect(page.textContent).toContain('Current');
  });
});
