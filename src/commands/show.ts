import { out, isJsonMode } from '../output';
import * as db from '../db';
import { resolveItem } from '../fuzzy';

export async function showCommand(name: string) {
  const resolved = resolveItem(name);

  if (!resolved) {
    out.error(`No match found for "${name}".`);
    out.jsonError({ error: `No match found for "${name}".` });
    process.exit(2);
  }

  const item = db.getItemDetail(resolved.name);
  if (!item) { // Should not happen if resolveItem returned it
    out.error(`Failed to fetch details for "${resolved.name}".`);
    process.exit(1);
  }

  if (!isJsonMode()) {
    console.log(`\nMatched "${item.name}"`);
    console.log('─'.repeat(25));
    console.log(`Courses:   ${item.courses.join(', ') || 'none'}`);
    console.log(`Occasions: ${item.occasions.join(', ') || 'none'}`);
  }

  out.json({ item });
}
