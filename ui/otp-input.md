# ShadNG OTP Input

Angular OTP (One-Time Password) input component with individual character slots. Built for verification codes, 2FA, and SMS confirmations.

## Installation

```bash
npx @shadng/sng-ui add otp-input
```

## Basic Usage

```html
<!-- Basic 6-digit OTP -->
<sng-otp-input name="otp-code" [(value)]="otpCode" [maxLength]="6">
  <sng-otp-input-group>
    <sng-otp-input-slot [index]="0" />
    <sng-otp-input-slot [index]="1" />
    <sng-otp-input-slot [index]="2" />
    <sng-otp-input-slot [index]="3" />
    <sng-otp-input-slot [index]="4" />
    <sng-otp-input-slot [index]="5" />
  </sng-otp-input-group>
</sng-otp-input>

<!-- With separator (XXX-XXX pattern) -->
<sng-otp-input name="otp-code-grouped" [(value)]="otpCode" [maxLength]="6" (complete)="onVerify($event)">
  <sng-otp-input-group>
    <sng-otp-input-slot [index]="0" />
    <sng-otp-input-slot [index]="1" />
    <sng-otp-input-slot [index]="2" />
  </sng-otp-input-group>
  <sng-otp-input-separator />
  <sng-otp-input-group>
    <sng-otp-input-slot [index]="3" />
    <sng-otp-input-slot [index]="4" />
    <sng-otp-input-slot [index]="5" />
  </sng-otp-input-group>
</sng-otp-input>
```

---

# SngOtpInput Technical Reference

Complete reference for implementing the OTP input component. Provides individual character slots with paste support and editing behavior.

## Component Architecture

```typescript
// 4 components (standalone):
// 1. SngOtpInput - Main container with hidden input
// 2. SngOtpInputGroup - Visual grouping for slots
// 3. SngOtpInputSlot - Individual character display
// 4. SngOtpInputSeparator - Visual separator (dash)
```

## Implementation

```typescript
// projects/sng-ui/src/lib/otp-input/sng-otp-input.ts
import { Component, input, model, output, signal, computed } from '@angular/core';

export const REGEXP_ONLY_DIGITS = /^\d+$/;
export const REGEXP_ONLY_CHARS = /^[a-zA-Z]+$/;
export const REGEXP_ONLY_DIGITS_AND_CHARS = /^[a-zA-Z0-9]+$/;

@Component({
  selector: 'sng-otp-input',
  standalone: true,
  template: `
    <input
      type="text"
      [attr.inputmode]="inputMode()"
      [attr.autocomplete]="autoComplete()"
      [attr.maxlength]="maxLength()"
      [value]="value()"
      [disabled]="disabled()"
      class="absolute inset-0 w-full h-full opacity-0"
      (input)="onInput($event)"
      (paste)="onPaste($event)"
    />
    <ng-content select="sng-otp-input-group, sng-otp-input-slot, sng-otp-input-separator" />
  `,
})
export class SngOtpInput {
  maxLength = input<number>(6);
  pattern = input<RegExp>(REGEXP_ONLY_DIGITS);
  name = input<string>();
  autoComplete = input<string>('one-time-code');
  disabled = input(false);
  class = input<string>('');

  value = model<string>('');
  complete = output<string>();

  // Slot state for child components
  slots = computed(() => {
    const val = this.value();
    return Array.from({ length: this.maxLength() }, (_, i) => ({
      char: val[i] || '',
      isActive: i === this._focusedIndex(),
      hasFakeCaret: i === this._focusedIndex() && !val[i],
    }));
  });

  private _focusedIndex = signal(0);
}
```

## Slot Component

```typescript
// projects/sng-ui/src/lib/otp-input/sng-otp-input-slot.ts
@Component({
  selector: 'sng-otp-input-slot',
  template: `
    <div [class]="slotClasses()">
      {{ slotState()?.char }}
      @if (slotState()?.hasFakeCaret) {
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="h-4 w-px bg-foreground animate-caret-blink"></div>
        </div>
      }
    </div>
  `,
})
export class SngOtpInputSlot {
  index = input.required<number>();
  // Gets state from parent SngOtpInput via DI
}
```

## Pattern Options

```typescript
import {
  REGEXP_ONLY_DIGITS,        // 0-9 only (default)
  REGEXP_ONLY_CHARS,         // a-zA-Z only
  REGEXP_ONLY_DIGITS_AND_CHARS,  // Alphanumeric
} from 'sng-ui';

// Digits only (default)
<sng-otp-input name="otp-digits" [pattern]="REGEXP_ONLY_DIGITS" />

// Letters only
<sng-otp-input name="otp-chars" [pattern]="REGEXP_ONLY_CHARS" />

// Custom pattern
<sng-otp-input name="otp-hex" [pattern]="/^[A-F0-9]+$/" />  // Hex only
```

## Auto-Submit on Complete

```typescript
@Component({
  template: `
    <sng-otp-input
      name="verification-code"
      [(value)]="otpCode"
      [maxLength]="6"
      (complete)="verifyCode($event)"
    >
      <!-- slots -->
    </sng-otp-input>
  `
})
export class VerificationComponent {
  otpCode = signal('');

  verifyCode(code: string) {
    // Called automatically when all 6 digits are entered
    this.authService.verify(code).subscribe(/* ... */);
  }
}
```

## Do's and Don'ts

### Do
- Use (complete) to auto-submit verification forms
- Match the visual pattern to how codes appear in emails/SMS
- Use REGEXP_ONLY_DIGITS for numeric codes (most common)
- Clear the input and re-focus on verification failure

### Don't
- Forget to set [maxLength] matching your slot count
- Use mismatched [index] values on slots
- Block paste - users copy codes from SMS/email
- Make users manually submit after entering all digits


## Accessibility

- Hidden input handles actual text entry
- Visual slots are presentation only
- Works with screen readers
- Supports autocomplete="one-time-code" for SMS autofill
- Proper focus management
