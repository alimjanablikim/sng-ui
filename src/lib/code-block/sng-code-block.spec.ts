import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, ViewChild } from '@angular/core';
import { SngCodeBlock, ShikiTheme } from './sng-code-block';

@Component({
  standalone: true,
  imports: [SngCodeBlock],
  template: `
    <sng-code-block
      [code]="code"
      [language]="language"
      [theme]="theme"
      [showHeader]="showHeader"
      [class]="codeBlockClass"
    />
  `,
})
class TestHostComponent {
  @ViewChild(SngCodeBlock) codeBlock!: SngCodeBlock;
  code = 'const x = 1;';
  language = 'typescript';
  theme: ShikiTheme = 'github-light';
  showHeader = true;
  codeBlockClass = '';
}

describe('SngCodeBlock', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let codeBlockEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  describe('Basic functionality', () => {
    it('should create', () => {
      fixture.detectChanges();
      codeBlockEl = fixture.nativeElement.querySelector('sng-code-block');
      expect(codeBlockEl).toBeTruthy();
    });

    it('should render code container', () => {
      fixture.detectChanges();
      codeBlockEl = fixture.nativeElement.querySelector('sng-code-block');
      const container = codeBlockEl.querySelector('.code-container');
      expect(container).toBeTruthy();
    });

    it('should render code content', () => {
      fixture.detectChanges();
      codeBlockEl = fixture.nativeElement.querySelector('sng-code-block');
      const content = codeBlockEl.querySelector('.code-content');
      expect(content).toBeTruthy();
    });
  });

  describe('Header', () => {
    it('should show header by default', () => {
      fixture.detectChanges();
      codeBlockEl = fixture.nativeElement.querySelector('sng-code-block');
      const header = codeBlockEl.querySelector('.code-header');
      expect(header).toBeTruthy();
    });

    it('should show language label', () => {
      fixture.detectChanges();
      codeBlockEl = fixture.nativeElement.querySelector('sng-code-block');
      const label = codeBlockEl.querySelector('.language-label');
      expect(label?.textContent).toBe('typescript');
    });

    it('should hide header when showHeader is false', () => {
      host.showHeader = false;
      fixture.detectChanges();
      codeBlockEl = fixture.nativeElement.querySelector('sng-code-block');

      const header = codeBlockEl.querySelector('.code-header');
      expect(header).toBeFalsy();
    });
  });

  describe('Language', () => {
    it('should update language', () => {
      host.language = 'javascript';
      fixture.detectChanges();
      codeBlockEl = fixture.nativeElement.querySelector('sng-code-block');

      const label = codeBlockEl.querySelector('.language-label');
      expect(label?.textContent).toBe('javascript');
    });
  });

  describe('Theme', () => {
    it('should accept github-light theme', () => {
      fixture.detectChanges();
      expect(host.codeBlock.theme()).toBe('github-light');
    });

    it('should accept github-dark theme', () => {
      host.theme = 'github-dark';
      fixture.detectChanges();
      expect(host.codeBlock.theme()).toBe('github-dark');
    });

    it('should accept dracula theme', () => {
      host.theme = 'dracula';
      fixture.detectChanges();
      expect(host.codeBlock.theme()).toBe('dracula');
    });
  });

  describe('Copy button', () => {
    it('should render copy button', () => {
      fixture.detectChanges();
      codeBlockEl = fixture.nativeElement.querySelector('sng-code-block');
      const copyBtn = codeBlockEl.querySelector('.copy-btn');
      expect(copyBtn).toBeTruthy();
    });

    it('should show "Copy" text initially', () => {
      fixture.detectChanges();
      codeBlockEl = fixture.nativeElement.querySelector('sng-code-block');
      const copyBtn = codeBlockEl.querySelector('.copy-btn');
      expect(copyBtn?.textContent).toContain('Copy');
    });

    it('should have copyCode method', () => {
      fixture.detectChanges();
      expect(typeof host.codeBlock.copyCode).toBe('function');
    });

    it('should track copied state', () => {
      fixture.detectChanges();
      expect(host.codeBlock._copied()).toBeFalse();
    });
  });

  describe('Code content', () => {
    it('should have code input', () => {
      fixture.detectChanges();
      expect(host.codeBlock.code()).toBe('const x = 1;');
    });

    it('should update code content', () => {
      host.code = 'function test() { return true; }';
      fixture.detectChanges();

      expect(host.codeBlock.code()).toBe('function test() { return true; }');
    });
  });

  describe('Class input', () => {
    it('should apply custom classes', () => {
      host.codeBlockClass = 'max-w-md h-64';
      fixture.detectChanges();
      codeBlockEl = fixture.nativeElement.querySelector('sng-code-block');

      expect(codeBlockEl.classList.contains('max-w-md')).toBeTrue();
      expect(codeBlockEl.classList.contains('h-64')).toBeTrue();
    });
  });

  describe('Supported languages', () => {
    it('should handle json', () => {
      host.language = 'json';
      host.code = '{"key": "value"}';
      fixture.detectChanges();

      expect(host.codeBlock.language()).toBe('json');
    });

    it('should handle html', () => {
      host.language = 'html';
      host.code = '<div>Hello</div>';
      fixture.detectChanges();

      expect(host.codeBlock.language()).toBe('html');
    });

    it('should handle css', () => {
      host.language = 'css';
      host.code = '.class { color: red; }';
      fixture.detectChanges();

      expect(host.codeBlock.language()).toBe('css');
    });
  });
});
