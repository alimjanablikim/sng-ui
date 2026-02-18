const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const CLI_PATH = path.resolve(__dirname, 'sng-ui.js');

function createTempWorkspace() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'sng-ui-cli-test-'));
}

function cleanup(workspacePath) {
  fs.rmSync(workspacePath, { recursive: true, force: true });
}

function runCli(args, workspacePath) {
  return spawnSync('node', [CLI_PATH, ...args], {
    cwd: workspacePath,
    encoding: 'utf8'
  });
}

function extractInstallHint(output) {
  const match = output.match(/npm install ([^\n]+)/);
  return match ? match[1].trim().split(/\s+/) : [];
}

function sorted(values) {
  return [...values].sort();
}

test('init creates config with default componentsDir', () => {
  const workspacePath = createTempWorkspace();
  try {
    const result = runCli(['init'], workspacePath);
    assert.equal(result.status, 0, result.stderr || result.stdout);

    const configPath = path.join(workspacePath, 'sng-ui.json');
    assert.equal(fs.existsSync(configPath), true);

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    assert.equal(config.componentsDir, 'src/lib/sng-ui');
  } finally {
    cleanup(workspacePath);
  }
});

test('add code-block includes shiki dependency hint and files', () => {
  const workspacePath = createTempWorkspace();
  try {
    const initResult = runCli(['init'], workspacePath);
    assert.equal(initResult.status, 0, initResult.stderr || initResult.stdout);

    const addResult = runCli(['add', 'code-block'], workspacePath);
    assert.equal(addResult.status, 0, addResult.stderr || addResult.stdout);
    const installHint = extractInstallHint(addResult.stdout);
    assert.deepEqual(installHint, ['clsx', 'shiki', 'tailwind-merge']);

    const codeBlockPath = path.join(workspacePath, 'src/lib/sng-ui/code-block/sng-code-block.ts');
    assert.equal(fs.existsSync(codeBlockPath), true);
  } finally {
    cleanup(workspacePath);
  }
});

test('add table includes normalized package dependency hints', () => {
  const workspacePath = createTempWorkspace();
  try {
    const initResult = runCli(['init'], workspacePath);
    assert.equal(initResult.status, 0, initResult.stderr || initResult.stdout);

    const addResult = runCli(['add', 'table'], workspacePath);
    assert.equal(addResult.status, 0, addResult.stderr || addResult.stdout);
    const installHint = extractInstallHint(addResult.stdout);
    assert.deepEqual(installHint, ['@angular/cdk', 'clsx', 'tailwind-merge']);
  } finally {
    cleanup(workspacePath);
  }
});

test('add multiple components in one command copies both component folders', () => {
  const workspacePath = createTempWorkspace();
  try {
    const initResult = runCli(['init'], workspacePath);
    assert.equal(initResult.status, 0, initResult.stderr || initResult.stdout);

    const addResult = runCli(['add', 'table', 'menu'], workspacePath);
    assert.equal(addResult.status, 0, addResult.stderr || addResult.stdout);

    const installHint = extractInstallHint(addResult.stdout);
    assert.deepEqual(
      sorted(installHint),
      sorted(['@angular/cdk', 'clsx', 'tailwind-merge'])
    );

    const tablePath = path.join(workspacePath, 'src/lib/sng-ui/sng-table/sng-table.ts');
    const menuPath = path.join(workspacePath, 'src/lib/sng-ui/menu/sng-menu.ts');
    assert.equal(fs.existsSync(tablePath), true);
    assert.equal(fs.existsSync(menuPath), true);
  } finally {
    cleanup(workspacePath);
  }
});

test('add --all installs all public components', () => {
  const workspacePath = createTempWorkspace();
  try {
    const initResult = runCli(['init'], workspacePath);
    assert.equal(initResult.status, 0, initResult.stderr || initResult.stdout);

    const addResult = runCli(['add', '--all'], workspacePath);
    assert.equal(addResult.status, 0, addResult.stderr || addResult.stdout);
    assert.match(addResult.stdout, /Installing all components/);

    const installHint = extractInstallHint(addResult.stdout);
    assert.deepEqual(
      sorted(installHint),
      sorted(['@angular/cdk', 'clsx', 'embla-carousel', 'shiki', 'tailwind-merge'])
    );

    const buttonPath = path.join(workspacePath, 'src/lib/sng-ui/button/sng-button.ts');
    const tooltipPath = path.join(workspacePath, 'src/lib/sng-ui/tooltip/sng-tooltip.ts');
    assert.equal(fs.existsSync(buttonPath), true);
    assert.equal(fs.existsSync(tooltipPath), true);
  } finally {
    cleanup(workspacePath);
  }
});

test('add unknown component exits with error', () => {
  const workspacePath = createTempWorkspace();
  try {
    const initResult = runCli(['init'], workspacePath);
    assert.equal(initResult.status, 0, initResult.stderr || initResult.stdout);

    const addResult = runCli(['add', 'does-not-exist'], workspacePath);
    assert.notEqual(addResult.status, 0);
    assert.match(addResult.stderr, /Unknown component/);
  } finally {
    cleanup(workspacePath);
  }
});
