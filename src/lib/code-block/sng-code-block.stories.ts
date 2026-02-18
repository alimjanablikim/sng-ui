import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngCodeBlock } from './sng-code-block';

const sampleTypeScript = `import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: \`<h1>Hello World</h1>\`
})
export class ExampleComponent {}`;

const sampleJSON = `{
  "name": "sng-ui",
  "version": "1.0.0",
  "dependencies": {
    "@angular/core": "^19.0.0"
  }
}`;

const sampleBash = `# Install dependencies
npm install sng-ui

# Run the dev server
ng serve`;

const meta: Meta<SngCodeBlock> = {
  title: 'UI/CodeBlock',
  component: SngCodeBlock,
  tags: ['autodocs'],
  argTypes: {
    code: {
      control: 'text',
      description: 'Code to display',
    },
    language: {
      control: 'select',
      options: ['typescript', 'javascript', 'json', 'bash', 'html', 'css'],
      description: 'Programming language',
    },
    theme: {
      control: 'select',
      options: ['github-light', 'github-dark', 'dracula', 'nord', 'one-dark-pro'],
      description: 'Syntax highlighting theme',
    },
    showHeader: {
      control: 'boolean',
      description: 'Show header with copy button',
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-code-block ${argsToTemplate(args)} />`,
  }),
};

export default meta;
type Story = StoryObj<SngCodeBlock>;

/**
 * Default code block with TypeScript.
 */
export const Default: Story = {
  args: {
    code: sampleTypeScript,
    language: 'typescript',
    theme: 'github-light',
    showHeader: true,
  },
};

/**
 * Code block with dark theme.
 */
export const DarkTheme: Story = {
  args: {
    code: sampleTypeScript,
    language: 'typescript',
    theme: 'github-dark',
    showHeader: true,
  },
};

/**
 * JSON code block.
 */
export const JSONCode: Story = {
  args: {
    code: sampleJSON,
    language: 'json',
    theme: 'github-light',
    showHeader: true,
  },
};

/**
 * Bash/shell commands.
 */
export const BashCode: Story = {
  args: {
    code: sampleBash,
    language: 'bash',
    theme: 'github-light',
    showHeader: true,
  },
};

/**
 * Code block without header.
 */
export const WithoutHeader: Story = {
  args: {
    code: sampleTypeScript,
    language: 'typescript',
    theme: 'github-light',
    showHeader: false,
  },
};

/**
 * Dracula theme.
 */
export const DraculaTheme: Story = {
  args: {
    code: sampleTypeScript,
    language: 'typescript',
    theme: 'dracula',
    showHeader: true,
  },
};

/**
 * Nord theme.
 */
export const NordTheme: Story = {
  args: {
    code: sampleTypeScript,
    language: 'typescript',
    theme: 'nord',
    showHeader: true,
  },
};

/**
 * Code block with custom width.
 */
export const CustomWidth: Story = {
  args: {
    code: sampleTypeScript,
    language: 'typescript',
    theme: 'github-light',
    showHeader: true,
    class: 'max-w-md',
  },
};
