import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal, ViewChild } from '@angular/core';
import { SngAccordion } from './sng-accordion';
import { SngAccordionItem } from './sng-accordion-item';
import { SngAccordionTrigger } from './sng-accordion-trigger';
import { SngAccordionContent } from './sng-accordion-content';

// Base template for tests
const ACCORDION_TEMPLATE = `
  <sng-accordion [type]="type" [collapsible]="collapsible" [(defaultValue)]="value">
    <sng-accordion-item value="item-1">
      <sng-accordion-trigger>Item 1</sng-accordion-trigger>
      <sng-accordion-content>Content 1</sng-accordion-content>
    </sng-accordion-item>
    <sng-accordion-item value="item-2">
      <sng-accordion-trigger>Item 2</sng-accordion-trigger>
      <sng-accordion-content>Content 2</sng-accordion-content>
    </sng-accordion-item>
    <sng-accordion-item value="item-3" [disabled]="disabledItem">
      <sng-accordion-trigger>Item 3</sng-accordion-trigger>
      <sng-accordion-content>Content 3</sng-accordion-content>
    </sng-accordion-item>
  </sng-accordion>
`;

describe('SngAccordion', () => {
  describe('Basic functionality', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: ACCORDION_TEMPLATE,
    })
    class TestHostComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      type: 'single' | 'multiple' = 'single';
      collapsible = true;
      value: string | string[] = '';
      disabledItem = false;
    }

    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
    });

    it('should create', () => {
      const accordion = fixture.nativeElement.querySelector('sng-accordion');
      expect(accordion).toBeTruthy();
    });

    it('should render all accordion items', () => {
      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items.length).toBe(3);
    });

    it('should be collapsed by default', () => {
      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      items.forEach((item: HTMLElement) => {
        expect(item.getAttribute('data-state')).toBe('closed');
      });
    });
  });

  describe('Single mode - expand behavior', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: ACCORDION_TEMPLATE,
    })
    class TestHostComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      type: 'single' | 'multiple' = 'single';
      collapsible = true;
      value: string | string[] = '';
      disabledItem = false;
    }

    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
    });

    it('should expand item when trigger is clicked', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      triggers[0].click();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');
      expect(items[1].getAttribute('data-state')).toBe('closed');
    });

    it('should collapse other items when opening a new one', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      triggers[0].click();
      fixture.detectChanges();

      triggers[1].click();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('closed');
      expect(items[1].getAttribute('data-state')).toBe('open');
    });

    it('should collapse when clicked again if collapsible', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      triggers[0].click();
      fixture.detectChanges();

      triggers[0].click();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('closed');
    });
  });

  describe('Single mode - non-collapsible', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: ACCORDION_TEMPLATE,
    })
    class NonCollapsibleTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      type: 'single' | 'multiple' = 'single';
      collapsible = false; // Set to false from the start
      value: string | string[] = '';
      disabledItem = false;
    }

    let fixture: ComponentFixture<NonCollapsibleTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NonCollapsibleTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(NonCollapsibleTestComponent);
      fixture.detectChanges();
    });

    it('should not collapse when clicked again if not collapsible', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      triggers[0].click();
      fixture.detectChanges();

      triggers[0].click();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');
    });
  });

  describe('Multiple mode', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: ACCORDION_TEMPLATE,
    })
    class MultipleTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      type: 'single' | 'multiple' = 'multiple'; // Set to multiple from the start
      collapsible = true;
      value: string | string[] = '';
      disabledItem = false;
    }

    let fixture: ComponentFixture<MultipleTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MultipleTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(MultipleTestComponent);
      fixture.detectChanges();
    });

    it('should allow multiple items to be expanded', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      triggers[0].click();
      fixture.detectChanges();

      triggers[1].click();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');
      expect(items[1].getAttribute('data-state')).toBe('open');
    });
  });

  describe('Default value - single mode', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: ACCORDION_TEMPLATE,
    })
    class DefaultValueTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      type: 'single' | 'multiple' = 'single';
      collapsible = true;
      value: string | string[] = 'item-2'; // Set default value from the start
      disabledItem = false;
    }

    let fixture: ComponentFixture<DefaultValueTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DefaultValueTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DefaultValueTestComponent);
      fixture.detectChanges();
    });

    it('should open item matching default value', () => {
      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[1].getAttribute('data-state')).toBe('open');
    });
  });

  describe('Default value - multiple mode', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: ACCORDION_TEMPLATE,
    })
    class DefaultValueMultipleTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      type: 'single' | 'multiple' = 'multiple';
      collapsible = true;
      value: string | string[] = ['item-1', 'item-2']; // Set default values from the start
      disabledItem = false;
    }

    let fixture: ComponentFixture<DefaultValueMultipleTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DefaultValueMultipleTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DefaultValueMultipleTestComponent);
      fixture.detectChanges();
    });

    it('should open multiple items matching default values in multiple mode', () => {
      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');
      expect(items[1].getAttribute('data-state')).toBe('open');
    });
  });

  describe('Disabled items', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: ACCORDION_TEMPLATE,
    })
    class DisabledItemTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      type: 'single' | 'multiple' = 'single';
      collapsible = true;
      value: string | string[] = '';
      disabledItem = true; // Set disabled from the start
    }

    let fixture: ComponentFixture<DisabledItemTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DisabledItemTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DisabledItemTestComponent);
      fixture.detectChanges();
    });

    it('should not toggle disabled items', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      triggers[2].click();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[2].getAttribute('data-state')).toBe('closed');
    });
  });

  describe('Item outputs', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: `
        <sng-accordion [(defaultValue)]="value">
          <sng-accordion-item
            value="item-1"
            (opened)="openCount = openCount + 1"
            (closed)="closeCount = closeCount + 1"
          >
            <sng-accordion-trigger>Item 1</sng-accordion-trigger>
            <sng-accordion-content>Content 1</sng-accordion-content>
          </sng-accordion-item>
        </sng-accordion>
      `,
    })
    class OutputTestComponent {
      value: string | string[] = '';
      openCount = 0;
      closeCount = 0;
    }

    let fixture: ComponentFixture<OutputTestComponent>;
    let component: OutputTestComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [OutputTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(OutputTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should not emit opened/closed on initial render', () => {
      expect(component.openCount).toBe(0);
      expect(component.closeCount).toBe(0);
    });

    it('should emit opened and closed when toggled', () => {
      const trigger = fixture.nativeElement.querySelector('sng-accordion-trigger');

      trigger.click();
      fixture.detectChanges();
      expect(component.openCount).toBe(1);
      expect(component.closeCount).toBe(0);

      trigger.click();
      fixture.detectChanges();
      expect(component.openCount).toBe(1);
      expect(component.closeCount).toBe(1);
    });
  });

  describe('ARIA attributes', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: ACCORDION_TEMPLATE,
    })
    class AriaTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      type: 'single' | 'multiple' = 'single';
      collapsible = true;
      value: string | string[] = '';
      disabledItem = false;
    }

    let fixture: ComponentFixture<AriaTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AriaTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(AriaTestComponent);
      fixture.detectChanges();
    });

    it('should have unique IDs on triggers and contents', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      const contents = fixture.nativeElement.querySelectorAll('sng-accordion-content');

      triggers.forEach((trigger: HTMLElement, index: number) => {
        expect(trigger.id).toBeTruthy();
        expect(contents[index].id).toBeTruthy();
        expect(trigger.id).not.toBe(contents[index].id);
      });
    });

    it('should have aria-controls on triggers pointing to content IDs', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      const contents = fixture.nativeElement.querySelectorAll('sng-accordion-content');

      triggers.forEach((trigger: HTMLElement, index: number) => {
        expect(trigger.getAttribute('aria-controls')).toBe(contents[index].id);
      });
    });

    it('should have aria-labelledby on contents pointing to trigger IDs', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      const contents = fixture.nativeElement.querySelectorAll('sng-accordion-content');

      contents.forEach((content: HTMLElement, index: number) => {
        expect(content.getAttribute('aria-labelledby')).toBe(triggers[index].id);
      });
    });

    it('should have role="button" on triggers', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      triggers.forEach((trigger: HTMLElement) => {
        expect(trigger.getAttribute('role')).toBe('button');
      });
    });

    it('should have role="region" on contents', () => {
      const contents = fixture.nativeElement.querySelectorAll('sng-accordion-content');
      contents.forEach((content: HTMLElement) => {
        expect(content.getAttribute('role')).toBe('region');
      });
    });

    it('should update aria-expanded when item is toggled', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      expect(triggers[0].getAttribute('aria-expanded')).toBe('false');

      triggers[0].click();
      fixture.detectChanges();

      expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    });

    it('should set aria-hidden and inert on collapsed content', () => {
      const contents = fixture.nativeElement.querySelectorAll('sng-accordion-content');
      expect(contents[0].getAttribute('aria-hidden')).toBe('true');
      expect(contents[0].hasAttribute('inert')).toBeTrue();
    });

    it('should remove aria-hidden and inert when content opens', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      triggers[0].click();
      fixture.detectChanges();

      const contents = fixture.nativeElement.querySelectorAll('sng-accordion-content');
      expect(contents[0].getAttribute('aria-hidden')).toBeNull();
      expect(contents[0].hasAttribute('inert')).toBeFalse();
    });
  });

  describe('Dynamic type change', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: `
        <sng-accordion [type]="type()" [collapsible]="collapsible()" [(defaultValue)]="value">
          <sng-accordion-item value="item-1">
            <sng-accordion-trigger>Item 1</sng-accordion-trigger>
            <sng-accordion-content>Content 1</sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="item-2">
            <sng-accordion-trigger>Item 2</sng-accordion-trigger>
            <sng-accordion-content>Content 2</sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="item-3">
            <sng-accordion-trigger>Item 3</sng-accordion-trigger>
            <sng-accordion-content>Content 3</sng-accordion-content>
          </sng-accordion-item>
        </sng-accordion>
      `,
    })
    class DynamicTypeTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      type = signal<'single' | 'multiple'>('single');
      collapsible = signal(true);
      value: string | string[] = '';
    }

    let fixture: ComponentFixture<DynamicTypeTestComponent>;
    let component: DynamicTypeTestComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DynamicTypeTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DynamicTypeTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should switch from single to multiple mode at runtime', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Start in single mode - expand item 1
      triggers[0].click();
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');

      // Switch to multiple mode
      component.type.set('multiple');
      component.value = ['item-1']; // Convert to array for multiple mode
      fixture.detectChanges();

      // Now expand item 2 - both should be open
      triggers[1].click();
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');
      expect(items[1].getAttribute('data-state')).toBe('open');
    });

    it('should switch from multiple to single mode at runtime', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Start in multiple mode
      component.type.set('multiple');
      component.value = [];
      fixture.detectChanges();

      // Expand two items
      triggers[0].click();
      fixture.detectChanges();
      triggers[1].click();
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');
      expect(items[1].getAttribute('data-state')).toBe('open');

      // Switch to single mode - keep only item-1
      component.type.set('single');
      component.value = 'item-1';
      fixture.detectChanges();

      // Click item 2 - should close item 1
      triggers[1].click();
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('closed');
      expect(items[1].getAttribute('data-state')).toBe('open');
    });
  });

  describe('Dynamic collapsible change', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: `
        <sng-accordion type="single" [collapsible]="collapsible()" [(defaultValue)]="value">
          <sng-accordion-item value="item-1">
            <sng-accordion-trigger>Item 1</sng-accordion-trigger>
            <sng-accordion-content>Content 1</sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="item-2">
            <sng-accordion-trigger>Item 2</sng-accordion-trigger>
            <sng-accordion-content>Content 2</sng-accordion-content>
          </sng-accordion-item>
        </sng-accordion>
      `,
    })
    class DynamicCollapsibleTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      collapsible = signal(true);
      value: string | string[] = '';
    }

    let fixture: ComponentFixture<DynamicCollapsibleTestComponent>;
    let component: DynamicCollapsibleTestComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DynamicCollapsibleTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DynamicCollapsibleTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should respect collapsible change from true to false', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Expand item 1 while collapsible
      triggers[0].click();
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');

      // Change to non-collapsible
      component.collapsible.set(false);
      fixture.detectChanges();

      // Try to collapse - should stay open
      triggers[0].click();
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');
    });

    it('should respect collapsible change from false to true', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Start non-collapsible
      component.collapsible.set(false);
      fixture.detectChanges();

      // Expand item 1
      triggers[0].click();
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');

      // Try to collapse - should stay open
      triggers[0].click();
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');

      // Change to collapsible
      component.collapsible.set(true);
      fixture.detectChanges();

      // Now should be able to collapse
      triggers[0].click();
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('closed');
    });
  });

  describe('Rapid toggle', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: ACCORDION_TEMPLATE,
    })
    class RapidToggleTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      type: 'single' | 'multiple' = 'single';
      collapsible = true;
      value: string | string[] = '';
      disabledItem = false;
    }

    let fixture: ComponentFixture<RapidToggleTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RapidToggleTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(RapidToggleTestComponent);
      fixture.detectChanges();
    });

    it('should handle rapid clicks without race conditions', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Rapid fire clicks - 3 clicks: open -> close -> open = OPEN
      triggers[0].click();
      triggers[0].click();
      triggers[0].click();
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      // Odd number of clicks (3) on collapsible = open
      expect(items[0].getAttribute('data-state')).toBe('open');

      // 2 more clicks: open -> close -> = CLOSE (even total from current state)
      triggers[0].click();
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      // 4th click closes it
      expect(items[0].getAttribute('data-state')).toBe('closed');
    });

    it('should handle rapid switching between items', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Rapidly switch between items
      triggers[0].click();
      triggers[1].click();
      triggers[2].click();
      triggers[0].click();
      triggers[1].click();
      fixture.detectChanges();

      // In single mode, only the last clicked should be open
      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('closed');
      expect(items[1].getAttribute('data-state')).toBe('open');
      expect(items[2].getAttribute('data-state')).toBe('closed');
    });
  });

  describe('External value changes', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: `
        <sng-accordion [type]="type()" [collapsible]="true" [(defaultValue)]="value">
          <sng-accordion-item value="item-1">
            <sng-accordion-trigger>Item 1</sng-accordion-trigger>
            <sng-accordion-content>Content 1</sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="item-2">
            <sng-accordion-trigger>Item 2</sng-accordion-trigger>
            <sng-accordion-content>Content 2</sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="item-3">
            <sng-accordion-trigger>Item 3</sng-accordion-trigger>
            <sng-accordion-content>Content 3</sng-accordion-content>
          </sng-accordion-item>
        </sng-accordion>
      `,
    })
    class ExternalValueTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      type = signal<'single' | 'multiple'>('single');
      value = signal<string | string[]>('');
    }

    let fixture: ComponentFixture<ExternalValueTestComponent>;
    let component: ExternalValueTestComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ExternalValueTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(ExternalValueTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should react to external value changes in single mode', () => {
      // All closed initially
      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('closed');
      expect(items[1].getAttribute('data-state')).toBe('closed');

      // Parent sets value externally
      component.value.set('item-2');
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('closed');
      expect(items[1].getAttribute('data-state')).toBe('open');

      // Parent changes value
      component.value.set('item-1');
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');
      expect(items[1].getAttribute('data-state')).toBe('closed');
    });

    it('should react to external value changes in multiple mode', () => {
      component.type.set('multiple');
      component.value.set([]);
      fixture.detectChanges();

      // Parent sets multiple values
      component.value.set(['item-1', 'item-3']);
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');
      expect(items[1].getAttribute('data-state')).toBe('closed');
      expect(items[2].getAttribute('data-state')).toBe('open');

      // Parent removes one value
      component.value.set(['item-1']);
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');
      expect(items[1].getAttribute('data-state')).toBe('closed');
      expect(items[2].getAttribute('data-state')).toBe('closed');
    });

    it('should handle external reset to empty value', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Expand an item via click
      triggers[0].click();
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');

      // Parent resets to empty
      component.value.set('');
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('closed');
    });
  });

  describe('Item destruction', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: `
        <sng-accordion type="single" [(defaultValue)]="value">
          @for (item of items(); track item.id) {
            <sng-accordion-item [value]="item.id">
              <sng-accordion-trigger>{{ item.label }}</sng-accordion-trigger>
              <sng-accordion-content>{{ item.content }}</sng-accordion-content>
            </sng-accordion-item>
          }
        </sng-accordion>
      `,
    })
    class ItemDestructionTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      value = signal<string | string[]>('');
      items = signal([
        { id: 'item-1', label: 'Item 1', content: 'Content 1' },
        { id: 'item-2', label: 'Item 2', content: 'Content 2' },
        { id: 'item-3', label: 'Item 3', content: 'Content 3' },
      ]);
    }

    let fixture: ComponentFixture<ItemDestructionTestComponent>;
    let component: ItemDestructionTestComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ItemDestructionTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(ItemDestructionTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should handle removal of expanded item', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Expand item-2
      triggers[1].click();
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[1].getAttribute('data-state')).toBe('open');
      expect(component.value()).toBe('item-2');

      // Remove item-2
      component.items.set([
        { id: 'item-1', label: 'Item 1', content: 'Content 1' },
        { id: 'item-3', label: 'Item 3', content: 'Content 3' },
      ]);
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items.length).toBe(2);

      // Value still points to removed item, but no item is visually open
      // This is expected behavior - the value is stale
      items.forEach((item: HTMLElement) => {
        expect(item.getAttribute('data-state')).toBe('closed');
      });
    });

    it('should handle removal of non-expanded item', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Expand item-1
      triggers[0].click();
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');

      // Remove item-2 (not expanded)
      component.items.set([
        { id: 'item-1', label: 'Item 1', content: 'Content 1' },
        { id: 'item-3', label: 'Item 3', content: 'Content 3' },
      ]);
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items.length).toBe(2);

      // item-1 should still be open
      expect(items[0].getAttribute('data-state')).toBe('open');
    });

    it('should handle adding new items', () => {
      // Add a new item
      component.items.set([
        { id: 'item-1', label: 'Item 1', content: 'Content 1' },
        { id: 'item-2', label: 'Item 2', content: 'Content 2' },
        { id: 'item-3', label: 'Item 3', content: 'Content 3' },
        { id: 'item-4', label: 'Item 4', content: 'Content 4' },
      ]);
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items.length).toBe(4);

      // New item should be expandable
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      triggers[3].click();
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[3].getAttribute('data-state')).toBe('open');
    });

    it('should handle removal of all items', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Expand an item
      triggers[0].click();
      fixture.detectChanges();

      // Remove all items
      component.items.set([]);
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items.length).toBe(0);
    });
  });

  describe('Disabled accordion (root level)', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: `
        <sng-accordion [disabled]="disabled()" [(defaultValue)]="value">
          <sng-accordion-item value="item-1">
            <sng-accordion-trigger>Item 1</sng-accordion-trigger>
            <sng-accordion-content>Content 1</sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="item-2">
            <sng-accordion-trigger>Item 2</sng-accordion-trigger>
            <sng-accordion-content>Content 2</sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="item-3" [disabled]="true">
            <sng-accordion-trigger>Item 3 (explicit disabled)</sng-accordion-trigger>
            <sng-accordion-content>Content 3</sng-accordion-content>
          </sng-accordion-item>
        </sng-accordion>
      `,
    })
    class DisabledAccordionTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      disabled = signal(false);
      value: string | string[] = '';
    }

    let fixture: ComponentFixture<DisabledAccordionTestComponent>;
    let component: DisabledAccordionTestComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DisabledAccordionTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DisabledAccordionTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have data-disabled attribute when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      const accordion = fixture.nativeElement.querySelector('sng-accordion');
      expect(accordion.getAttribute('data-disabled')).toBe('true');
    });

    it('should not have data-disabled attribute when not disabled', () => {
      const accordion = fixture.nativeElement.querySelector('sng-accordion');
      expect(accordion.getAttribute('data-disabled')).toBeNull();
    });

    it('should prevent all items from toggling when accordion is disabled', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Disable the accordion
      component.disabled.set(true);
      fixture.detectChanges();

      // Try to click each trigger
      triggers[0].click();
      fixture.detectChanges();
      triggers[1].click();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('closed');
      expect(items[1].getAttribute('data-state')).toBe('closed');
    });

    it('should work normally when disabled is toggled back to false', () => {
      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');

      // Start disabled
      component.disabled.set(true);
      fixture.detectChanges();

      // Try to expand - should fail
      triggers[0].click();
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('closed');

      // Enable accordion
      component.disabled.set(false);
      fixture.detectChanges();

      // Now should work
      triggers[0].click();
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('sng-accordion-item');
      expect(items[0].getAttribute('data-state')).toBe('open');
    });

    it('should set aria-disabled on all triggers when accordion is disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      triggers.forEach((trigger: HTMLElement) => {
        expect(trigger.getAttribute('aria-disabled')).toBe('true');
      });
    });

    it('should set tabindex=-1 on all triggers when accordion is disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      triggers.forEach((trigger: HTMLElement) => {
        expect(trigger.getAttribute('tabindex')).toBe('-1');
      });
    });

  });

  describe('Orientation', () => {
    @Component({
      standalone: true,
      imports: [SngAccordion, SngAccordionItem, SngAccordionTrigger, SngAccordionContent],
      template: `
        <sng-accordion [orientation]="orientation()" [(defaultValue)]="value">
          <sng-accordion-item value="item-1">
            <sng-accordion-trigger>Item 1</sng-accordion-trigger>
            <sng-accordion-content>Content 1</sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="item-2">
            <sng-accordion-trigger>Item 2</sng-accordion-trigger>
            <sng-accordion-content>Content 2</sng-accordion-content>
          </sng-accordion-item>
          <sng-accordion-item value="item-3">
            <sng-accordion-trigger>Item 3</sng-accordion-trigger>
            <sng-accordion-content>Content 3</sng-accordion-content>
          </sng-accordion-item>
        </sng-accordion>
      `,
    })
    class OrientationTestComponent {
      @ViewChild(SngAccordion) accordion!: SngAccordion;
      orientation = signal<'vertical' | 'horizontal'>('vertical');
      value: string | string[] = '';
    }

    let fixture: ComponentFixture<OrientationTestComponent>;
    let component: OrientationTestComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [OrientationTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(OrientationTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have data-orientation="vertical" by default', () => {
      const accordion = fixture.nativeElement.querySelector('sng-accordion');
      expect(accordion.getAttribute('data-orientation')).toBe('vertical');
    });

    it('should have data-orientation="horizontal" when set', () => {
      component.orientation.set('horizontal');
      fixture.detectChanges();

      const accordion = fixture.nativeElement.querySelector('sng-accordion');
      expect(accordion.getAttribute('data-orientation')).toBe('horizontal');
    });

    it('should propagate orientation to triggers', () => {
      component.orientation.set('horizontal');
      fixture.detectChanges();

      const triggers = fixture.nativeElement.querySelectorAll('sng-accordion-trigger');
      triggers.forEach((trigger: HTMLElement) => {
        expect(trigger.getAttribute('data-orientation')).toBe('horizontal');
      });
    });

  });
});
