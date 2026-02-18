/**
 * @fileoverview Utility functions for sng-table-core
 */

import { Updater, functionalUpdate } from './types';

// ============================================================================
// MEMO UTILITIES
// ============================================================================

/**
 * Simple memoization for functions with no arguments
 * Returns a function that caches its result and only recomputes when deps change
 */
export function memo<T>(
  getDeps: () => unknown[],
  fn: () => T,
  opts?: {
    onChange?: (result: T) => void;
    debug?: boolean;
    debugLabel?: string;
  }
): () => T {
  let deps: unknown[] = [];
  let result: T | undefined;

  return () => {
    const newDeps = getDeps();
    const depsChanged = !shallowEqualArrays(deps, newDeps);

    if (depsChanged || result === undefined) {
      if (opts?.debug) {
        console.warn(opts.debugLabel ?? 'memo', 'deps changed', { deps, newDeps });
      }
      deps = newDeps;
      result = fn();
      opts?.onChange?.(result);
    }

    return result;
  };
}

/**
 * Shallow compare two arrays
 */
function shallowEqualArrays(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false;
  }
  return true;
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Check if a value is a plain object
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Deep merge two objects (target wins on conflicts)
 */
export function mergeObjects<T extends Record<string, unknown>>(
  base: Partial<T>,
  override: Partial<T>
): T {
  const result = { ...base } as T;

  for (const key of Object.keys(override) as (keyof T)[]) {
    const baseValue = base[key];
    const overrideValue = override[key];

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = mergeObjects(
        baseValue as Record<string, unknown>,
        overrideValue as Record<string, unknown>
      ) as T[keyof T];
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue as T[keyof T];
    }
  }

  return result;
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Flatten a nested array structure
 */
export function flattenBy<T>(
  items: T[],
  getChildren: (item: T) => T[] | undefined
): T[] {
  const result: T[] = [];

  function flatten(arr: T[]) {
    for (const item of arr) {
      result.push(item);
      const children = getChildren(item);
      if (children?.length) {
        flatten(children);
      }
    }
  }

  flatten(items);
  return result;
}

/**
 * Get unique values from array
 */
export function uniqueBy<T, K>(items: T[], getKey: (item: T) => K): T[] {
  const seen = new Set<K>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Create a lookup object from array
 */
export function keyBy<T, K extends string | number>(
  items: T[],
  getKey: (item: T) => K
): Record<K, T> {
  const result = {} as Record<K, T>;
  for (const item of items) {
    result[getKey(item)] = item;
  }
  return result;
}

/**
 * Group array items by key
 */
export function groupBy<T, K extends string | number>(
  items: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  const result = {} as Record<K, T[]>;
  for (const item of items) {
    const key = getKey(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}

// ============================================================================
// STATE UTILITIES
// ============================================================================

/**
 * Make a state updater function
 */
export function makeStateUpdater<K extends PropertyKey, V>(
  key: K,
  setState: (updater: Updater<Record<K, V>>) => void
): (updater: Updater<V>) => void {
  return (updater: Updater<V>) => {
    setState((prev) => ({
      ...prev,
      [key]: functionalUpdate(updater, prev[key]),
    }));
  };
}

// ============================================================================
// VALUE ACCESS UTILITIES
// ============================================================================

/**
 * Get value at path from object (e.g., 'user.profile.name')
 */
export function getValueAtPath<T = unknown>(
  obj: Record<string, unknown>,
  path: string
): T {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined as T;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current as T;
}

/**
 * Safely convert value to string
 */
export function toString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(toString).join(', ');
  }
  return JSON.stringify(value);
}

// ============================================================================
// SORTING UTILITIES
// ============================================================================

/**
 * Compare two values for sorting (handles nullish, strings, numbers, dates)
 */
export function compareBasic(a: unknown, b: unknown): number {
  // Handle null/undefined - push to end
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  // Handle booleans
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return a === b ? 0 : a ? -1 : 1;
  }

  // Handle numbers
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // Default to string comparison
  return String(a).localeCompare(String(b));
}

/**
 * Compare alphanumeric strings (handles numbers in strings)
 */
export function compareAlphanumeric(a: string, b: string): number {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

// ============================================================================
// ID UTILITIES
// ============================================================================

let idCounter = 0;

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'sng'): string {
  return `${prefix}_${++idCounter}`;
}

/**
 * Create a row ID from index
 */
export function defaultGetRowId<TData>(
  _row: TData,
  index: number,
  parent?: { id: string }
): string {
  return parent ? `${parent.id}.${index}` : String(index);
}

// ============================================================================
// DEBUG UTILITIES
// ============================================================================

/**
 * Console log with optional debug flag
 */
export function debugLog(
  debug: boolean | undefined,
  label: string,
  ...args: unknown[]
): void {
  if (debug) {
    console.warn(`[sng-table] ${label}:`, ...args);
  }
}
