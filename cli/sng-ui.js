#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const CONFIG_FILE = 'sng-ui.json';
const DEFAULT_COMPONENTS_DIR = 'src/lib/sng-ui';
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const LIB_SOURCE_ROOT = path.join(PACKAGE_ROOT, 'src', 'lib');

const ALWAYS_AVAILABLE_IMPORTS = new Set([
  '@angular/animations',
  '@angular/common',
  '@angular/core',
  '@angular/forms',
  '@angular/platform-browser',
  '@angular/router',
  'rxjs',
  'tslib'
]);

function printHelp() {
  console.log(`sng-ui CLI

Usage:
  npx sng-ui init [--path <dir>] [--force]
  npx @shadng/sng-ui add <component...> [--path <dir>] [--force] [--dry-run]
  npx @shadng/sng-ui add --all [--path <dir>] [--force] [--dry-run]

Examples:
  npx sng-ui init
  npx @shadng/sng-ui add button
  npx @shadng/sng-ui add table menu
  npx @shadng/sng-ui add --all
  npx @shadng/sng-ui add slider --path src/lib/ui
`);
}

function parseOptions(tokens) {
  const options = { force: false, dryRun: false, all: false, path: null, values: [] };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === '--force') {
      options.force = true;
      continue;
    }
    if (token === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (token === '--all') {
      options.all = true;
      continue;
    }
    if (token === '--path') {
      const next = tokens[index + 1];
      if (!next || next.startsWith('--')) {
        throw new Error('Missing value for --path.');
      }
      options.path = next;
      index += 1;
      continue;
    }
    options.values.push(token);
  }

  return options;
}

function readConfig(cwd) {
  const configPath = path.join(cwd, CONFIG_FILE);
  if (!fs.existsSync(configPath)) {
    return { componentsDir: DEFAULT_COMPONENTS_DIR };
  }
  const raw = fs.readFileSync(configPath, 'utf8');
  const parsed = JSON.parse(raw);
  return {
    componentsDir: typeof parsed.componentsDir === 'string' && parsed.componentsDir.trim()
      ? parsed.componentsDir
      : DEFAULT_COMPONENTS_DIR
  };
}

function writeConfig(cwd, componentsDir, force) {
  const configPath = path.join(cwd, CONFIG_FILE);
  if (fs.existsSync(configPath) && !force) {
    throw new Error(`Config already exists at ${CONFIG_FILE}. Use --force to overwrite.`);
  }
  const payload = {
    componentsDir
  };
  fs.writeFileSync(configPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.mkdirSync(path.resolve(cwd, componentsDir), { recursive: true });
}

function getComponentFolderMap() {
  const entries = fs.readdirSync(LIB_SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== 'styles');

  const map = new Map();
  for (const folder of entries) {
    map.set(folder, folder);
    if (folder.startsWith('sng-')) {
      map.set(folder.slice(4), folder);
    }
  }
  return map;
}

function resolveComponentFolder(componentName, folderMap) {
  return folderMap.get(componentName) || null;
}

function getInstallableComponents(folderMap) {
  return [...new Set(
    [...folderMap.keys()]
      .filter((name) => !name.startsWith('sng-') && !name.endsWith('-core'))
  )].sort();
}

function shouldSkipFile(filePath) {
  return filePath.endsWith('.spec.ts') || filePath.endsWith('.stories.ts');
}

function listFilesRecursively(directoryPath) {
  const files = [];
  const stack = [directoryPath];

  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (!shouldSkipFile(fullPath)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function resolveImportFile(fromFile, importPath) {
  const fromDirectory = path.dirname(fromFile);
  const base = path.resolve(fromDirectory, importPath);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.js`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.js')
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

function extractImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  const imports = [];
  const pattern = /\bfrom\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;
  let match = pattern.exec(content);
  while (match) {
    imports.push(match[1] || match[2]);
    match = pattern.exec(content);
  }
  return imports;
}

function toPackageName(importPath) {
  if (importPath.startsWith('@')) {
    const parts = importPath.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : importPath;
  }
  return importPath.split('/')[0];
}

function collectComponentFiles(componentFolder) {
  const queue = [];
  const visitedFiles = new Set();
  const visitedFolders = new Set([componentFolder]);

  const rootPath = path.join(LIB_SOURCE_ROOT, componentFolder);
  for (const file of listFilesRecursively(rootPath)) {
    queue.push(file);
  }

  const externalPackages = new Set();

  while (queue.length) {
    const currentFile = queue.shift();
    if (visitedFiles.has(currentFile)) {
      continue;
    }
    visitedFiles.add(currentFile);

    const imports = extractImports(currentFile);
    for (const importPath of imports) {
      if (importPath.startsWith('.')) {
        const resolved = resolveImportFile(currentFile, importPath);
        if (!resolved || !resolved.startsWith(LIB_SOURCE_ROOT) || shouldSkipFile(resolved)) {
          continue;
        }
        const relative = path.relative(LIB_SOURCE_ROOT, resolved);
        const rootFolder = relative.split(path.sep)[0];
        if (!visitedFolders.has(rootFolder)) {
          visitedFolders.add(rootFolder);
          for (const file of listFilesRecursively(path.join(LIB_SOURCE_ROOT, rootFolder))) {
            queue.push(file);
          }
        } else {
          queue.push(resolved);
        }
      } else if (!ALWAYS_AVAILABLE_IMPORTS.has(importPath) && !importPath.startsWith('node:')) {
        const packageName = toPackageName(importPath);
        if (!ALWAYS_AVAILABLE_IMPORTS.has(packageName) && packageName !== 'sng-ui') {
          externalPackages.add(packageName);
        }
      }
    }
  }

  return {
    files: [...visitedFiles].sort(),
    externalPackages: [...externalPackages].sort()
  };
}

function copyFiles(files, destinationRoot, options) {
  let copied = 0;
  let skipped = 0;

  for (const sourceFile of files) {
    const relative = path.relative(LIB_SOURCE_ROOT, sourceFile);
    const destination = path.join(destinationRoot, relative);
    const destinationDirectory = path.dirname(destination);

    if (!options.dryRun) {
      fs.mkdirSync(destinationDirectory, { recursive: true });
    }

    if (fs.existsSync(destination) && !options.force) {
      skipped += 1;
      continue;
    }

    if (!options.dryRun) {
      fs.copyFileSync(sourceFile, destination);
    }
    copied += 1;
  }

  return { copied, skipped };
}

function runInit(cwd, options) {
  const componentsDir = options.path || DEFAULT_COMPONENTS_DIR;
  writeConfig(cwd, componentsDir, options.force);
  console.log(`Created ${CONFIG_FILE} with componentsDir="${componentsDir}".`);
}

function runAdd(cwd, options) {
  if (!options.values.length && !options.all) {
    throw new Error('Missing component name. Example: npx @shadng/sng-ui add button');
  }

  const config = readConfig(cwd);
  const destinationRoot = path.resolve(cwd, options.path || config.componentsDir);
  const folderMap = getComponentFolderMap();
  const installableComponents = getInstallableComponents(folderMap);
  const componentNames = [...new Set(options.all ? installableComponents : options.values)];
  const missing = [];

  let totalCopied = 0;
  let totalSkipped = 0;
  const dependencySet = new Set();

  if (options.all) {
    console.log(`Installing all components (${componentNames.length})...`);
  }

  for (const componentName of componentNames) {
    const folder = resolveComponentFolder(componentName, folderMap);
    if (!folder) {
      missing.push(componentName);
      continue;
    }

    const { files, externalPackages } = collectComponentFiles(folder);
    const result = copyFiles(files, destinationRoot, options);
    totalCopied += result.copied;
    totalSkipped += result.skipped;
    for (const dependency of externalPackages) {
      dependencySet.add(dependency);
    }
    console.log(`Added ${componentName}: ${result.copied} file(s), ${result.skipped} skipped.`);
  }

  if (missing.length) {
    const available = installableComponents;
    throw new Error(`Unknown component(s): ${missing.join(', ')}.\nAvailable: ${available.join(', ')}`);
  }

  console.log(`Done. Copied ${totalCopied} file(s), skipped ${totalSkipped}.`);
  if (dependencySet.size) {
    console.log(`Install peer deps if missing:\n  npm install ${[...dependencySet].join(' ')}`);
  }
}

function main() {
  const cwd = process.cwd();
  const args = process.argv.slice(2);
  const command = args.shift();

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  const options = parseOptions(args);

  if (command === 'init') {
    runInit(cwd, options);
    return;
  }
  if (command === 'add') {
    runAdd(cwd, options);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

try {
  main();
} catch (error) {
  console.error(`[sng-ui] ${error.message}`);
  process.exit(1);
}
