import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngCard } from './sng-card';
import { SngCardHeader } from './sng-card-header';
import { SngCardTitle } from './sng-card-title';
import { SngCardDescription } from './sng-card-description';
import { SngCardContent } from './sng-card-content';
import { SngCardFooter } from './sng-card-footer';

@Component({
  standalone: true,
  imports: [SngCard, SngCardHeader, SngCardTitle, SngCardDescription, SngCardContent, SngCardFooter],
  template: `
    <sng-card [class]="customClass">
      <sng-card-header>
        <sng-card-title>Title</sng-card-title>
        <sng-card-description>Description</sng-card-description>
      </sng-card-header>
      <sng-card-content>Content</sng-card-content>
      <sng-card-footer>Footer</sng-card-footer>
    </sng-card>
  `,
})
class TestHostComponent {
  customClass = '';
}

describe('SngCard', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let card: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create card with all sub-components', () => {
    fixture.detectChanges();
    card = fixture.nativeElement.querySelector('sng-card');
    expect(card).toBeTruthy();
    expect(fixture.nativeElement.querySelector('sng-card-header')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('sng-card-title')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('sng-card-description')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('sng-card-content')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('sng-card-footer')).toBeTruthy();
  });

  it('should apply base styles', () => {
    fixture.detectChanges();
    card = fixture.nativeElement.querySelector('sng-card');
    expect(card.classList.contains('rounded-xl')).toBeTrue();
    expect(card.classList.contains('border')).toBeTrue();
    expect(card.classList.contains('shadow-sm')).toBeTrue();
  });

  it('should apply custom class', () => {
    host.customClass = 'w-96';
    fixture.detectChanges();
    card = fixture.nativeElement.querySelector('sng-card');
    expect(card.classList.contains('w-96')).toBeTrue();
  });

  it('should render title text', () => {
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('sng-card-title');
    expect(title.textContent).toContain('Title');
  });

  it('should render description text', () => {
    fixture.detectChanges();
    const desc = fixture.nativeElement.querySelector('sng-card-description');
    expect(desc.textContent).toContain('Description');
  });

  it('should render content', () => {
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('sng-card-content');
    expect(content.textContent).toContain('Content');
  });

  it('should render footer', () => {
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('sng-card-footer');
    expect(footer.textContent).toContain('Footer');
  });
});
