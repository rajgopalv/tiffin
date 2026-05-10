import { out, isJsonMode } from '../output';
import * as db from '../db';

export async function showCommand(name: string) {
  const item = db.getItemDetail(name);

  if (!item) {
    out.error(`No match found for "${name}".`);
    out.jsonError({ error: `No match found for "${name}".` });
    process.exit(2);
  }

  if (!isJsonMode()) {
    console.log(`\nMatched "${item.name}"`);
    console.log('─'.repeat(25));
    console.log(`Courses:   ${item.courses.join(', ') || 'none'}`);
    console.log(`Occasions: ${item.occasions.join(', ') || 'none'}`);
  }

  out.json({ item });
}
