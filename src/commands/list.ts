import { out, isJsonMode } from '../output';
import * as db from '../db';
import { parseTags } from '../utils';

export async function listCommand(nounOrCourse: string | undefined, options: { for?: string }) {
  if (nounOrCourse === 'courses') {
    const courses = db.getCourses();
    if (!isJsonMode()) {
      console.log('\nCourses');
      console.log('───────');
      courses.forEach(c => console.log(` ${c}`));
    }
    out.json({ courses });
    return;
  }

  if (nounOrCourse === 'occasions') {
    const occasions = db.getOccasions();
    if (!isJsonMode()) {
      console.log('\nOccasions');
      console.log('─────────');
      occasions.forEach(o => console.log(` ${o}`));
    }
    out.json({ occasions });
    return;
  }

  const courseFilters = parseTags(nounOrCourse);
  const occasionFilters = parseTags(options.for);

  // TODO: Support multiple filters in the database layer (Step 15 in todo.md)
  if (courseFilters.length > 1 || occasionFilters.length > 1) {
    out.error('The "list" command currently only supports a single course and a single occasion filter.');
    out.jsonError({ error: 'Multiple filters not yet supported for list.' });
    process.exit(1);
  }

  const items = db.getItemsFiltered({ 
    course: courseFilters[0], 
    occasion: occasionFilters[0] 
  });

  if (items.length === 0) {
    const filterDesc = nounOrCourse || options.for ? ' matching filters' : '';
    out.info(`No items found${filterDesc}.`);
    out.json({ items: [] });
    return;
  }

  const title = nounOrCourse ? `Items › ${nounOrCourse}` : 'Items';
  const subtitle = options.for ? ` (Occasion: ${options.for})` : '';
  
  if (!isJsonMode()) {
    console.log(`\n${title}${subtitle}`);
    console.log('─'.repeat(50));
    
    items.forEach(item => {
      const courses = item.courses.length > 0 ? item.courses.join(', ') : '';
      const occasions = item.occasions.length > 0 ? ` → ${item.occasions.join(', ')}` : '';
      console.log(` ${item.name.padEnd(18)} ${courses.padEnd(18)}${occasions}`);
    });
  }

  out.json({ items });
}
