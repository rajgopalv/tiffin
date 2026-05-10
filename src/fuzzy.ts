import Fuse from 'fuse.js';
import * as db from './db';
import { out, isExactMode } from './output';

export interface MatchResult {
  item?: { id: number; name: string };
  candidates?: string[];
  exact: boolean;
}

export function resolveItem(query: string): { id: number; name: string } | null {
  // 1. Try exact match first (case-insensitive done by SQLite COLLATE NOCASE)
  const exactItem = db.findItemByName(query);
  if (exactItem) return exactItem;

  // 2. If --exact flag is set, don't do fuzzy
  if (isExactMode()) return null;

  // 3. Fuzzy match
  const allItems = db.getAllItems();
  const fuse = new Fuse(allItems, {
    keys: ['name'],
    threshold: 0.4,
    includeScore: true
  });

  const results = fuse.search(query);

  if (results.length === 0) return null;

  // If one strong match
  if (results.length === 1 || (results[0].score || 1) < (results[1]?.score || 1) * 0.8) {
    const matched = results[0].item;
    out.info(`Matched "${matched.name}"`);
    return matched;
  }

  // Multiple ambiguous matches
  const candidates = results.slice(0, 5).map(r => r.item.name);
  out.error(`Ambiguous match for "${query}". Candidates: ${candidates.join(', ')}`);
  out.jsonError({ 
    error: 'Ambiguous match', 
    candidates,
    suggestion: 'Use --exact with the full name'
  });
  process.exit(2);
}
