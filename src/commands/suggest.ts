import { out, isJsonMode } from '../output';
import * as db from '../db';
import { parseTags } from '../utils';

export async function suggestCommand(courseRaw: string | undefined, options: { for?: string }) {
  const courseFilters = parseTags(courseRaw);
  const occasionFilters = parseTags(options.for);

  // TODO: Support multiple filters in the database layer (Step 15 in todo.md)
  if (courseFilters.length > 1 || occasionFilters.length > 1) {
    out.error('The "suggest" command currently only supports a single course and a single occasion filter.');
    out.jsonError({ error: 'Multiple filters not yet supported for suggest.' });
    process.exit(1);
  }

  const item = db.getRandomItem({ 
    course: courseFilters[0], 
    occasion: occasionFilters[0] 
  });

  if (!item) {
    const filterDesc = courseRaw || options.for ? ' matching filters' : '';
    out.info(`No items found${filterDesc}.`);
    out.json({ item: null });
    return;
  }

  if (!isJsonMode()) {
    const courses = item.courses.length > 0 ? ` [${item.courses.join(', ')}]` : '';
    const occasions = item.occasions.length > 0 ? ` → ${item.occasions.join(', ')}` : '';
    console.log(`\n🍽  ${item.name}${courses}${occasions}`);
  }

  out.json({ item });
}
