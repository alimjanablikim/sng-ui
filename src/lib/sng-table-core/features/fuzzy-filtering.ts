/**
 * @fileoverview Fuzzy filtering feature for sng-table-core
 *
 * Provides fuzzy string matching for more flexible search.
 * Uses a simple ranking algorithm to score matches.
 */

import { Row, FilterFn, FilterMeta } from '../core/types';

// ============================================================================
// FUZZY MATCHING ALGORITHM
// ============================================================================

/**
 * Ranking info for a fuzzy match
 */
export interface RankingInfo {
  /** Whether the item passed the filter */
  passed: boolean;
  /** Ranking score (higher is better match) */
  rank: number;
}

/**
 * Rank ranges for different match qualities
 */
export const rankItem = {
  CASE_SENSITIVE_EQUAL: 7,
  EQUAL: 6,
  STARTS_WITH: 5,
  WORD_STARTS_WITH: 4,
  CONTAINS: 3,
  ACRONYM: 2,
  MATCHES: 1,
  NO_MATCH: 0,
} as const;

/**
 * Rank a value against a search string
 */
export function rankString(
  value: string,
  search: string
): RankingInfo {
  // Empty search matches everything
  if (!search || search.length === 0) {
    return { passed: true, rank: rankItem.MATCHES };
  }

  // Prepare values
  const valueLower = value.toLowerCase();
  const searchLower = search.toLowerCase();

  // Case-sensitive exact match
  if (value === search) {
    return { passed: true, rank: rankItem.CASE_SENSITIVE_EQUAL };
  }

  // Case-insensitive exact match
  if (valueLower === searchLower) {
    return { passed: true, rank: rankItem.EQUAL };
  }

  // Starts with
  if (valueLower.startsWith(searchLower)) {
    return { passed: true, rank: rankItem.STARTS_WITH };
  }

  // Word starts with (search matches start of any word)
  const words = valueLower.split(/\s+/);
  if (words.some((word) => word.startsWith(searchLower))) {
    return { passed: true, rank: rankItem.WORD_STARTS_WITH };
  }

  // Contains
  if (valueLower.includes(searchLower)) {
    return { passed: true, rank: rankItem.CONTAINS };
  }

  // Acronym match (first letters of words)
  const acronym = words.map((word) => word[0]).join('');
  if (acronym.includes(searchLower)) {
    return { passed: true, rank: rankItem.ACRONYM };
  }

  // Fuzzy character match
  if (fuzzyMatch(valueLower, searchLower)) {
    return { passed: true, rank: rankItem.MATCHES };
  }

  return { passed: false, rank: rankItem.NO_MATCH };
}

/**
 * Simple fuzzy match - all search characters appear in value in order
 */
function fuzzyMatch(value: string, search: string): boolean {
  let searchIndex = 0;

  for (let i = 0; i < value.length && searchIndex < search.length; i++) {
    if (value[i] === search[searchIndex]) {
      searchIndex++;
    }
  }

  return searchIndex === search.length;
}

// ============================================================================
// FUZZY FILTER FUNCTION
// ============================================================================

/**
 * Fuzzy filter function for use with column or global filtering
 *
 * @example
 * ```typescript
 * const columns = [
 *   {
 *     accessorKey: 'name',
 *     filterFn: fuzzyFilter,
 *   },
 * ];
 * ```
 */
export const fuzzyFilter: FilterFn<unknown> = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown,
  addMeta: (meta: FilterMeta) => void
): boolean => {
  const value = row.getValue<unknown>(columnId);
  const search = String(filterValue);

  // Rank the value
  const ranking = rankString(String(value), search);

  // Store ranking in meta for potential use in sorting
  addMeta({ ranking });

  return ranking.passed;
};

/**
 * Fuzzy filter with minimum rank threshold
 */
export function createFuzzyFilter(
  minRank: number = rankItem.MATCHES
): FilterFn<unknown> {
  return <TData>(
    row: Row<TData>,
    columnId: string,
    filterValue: unknown,
    addMeta: (meta: FilterMeta) => void
  ): boolean => {
    const value = row.getValue<unknown>(columnId);
    const search = String(filterValue);

    const ranking = rankString(String(value), search);
    addMeta({ ranking });

    return ranking.passed && ranking.rank >= minRank;
  };
}

// ============================================================================
// FUZZY SORT HELPER
// ============================================================================

/**
 * Sort rows by fuzzy ranking (for use after fuzzy filtering)
 * Rows with better fuzzy match rank appear first
 */
export function fuzzySort<TData>(
  rowA: Row<TData>,
  rowB: Row<TData>,
  _columnId: string
): number {
  // Get ranking from filter meta if available
  // This assumes the fuzzy filter stored ranking in meta
  const rankA = (rowA as unknown as { filterMeta?: { ranking?: RankingInfo } })
    .filterMeta?.ranking?.rank ?? 0;
  const rankB = (rowB as unknown as { filterMeta?: { ranking?: RankingInfo } })
    .filterMeta?.ranking?.rank ?? 0;

  // Higher rank = better match = should come first
  return rankB - rankA;
}
