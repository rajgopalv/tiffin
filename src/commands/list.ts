import { out, isJsonMode } from '../output';
import * as db from '../db';

export async function listCommand(course: string | undefined, options: { for?: string }) {
  const items = db.getAllItems({ course, occasion: options.for });

  if (items.length === 0) {
    const filterDesc = course || options.for ? ' matching filters' : '';
    out.info(`No items found${filterDesc}.`);
    out.json({ items: [] });
    return;
  }

  const title = course ? `Items › ${course}` : 'Items';
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
