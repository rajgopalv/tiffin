import { out } from '../output';
import * as db from '../db';

export async function addCommand(name: string, courses: string[], options: { for?: string[] }) {
  const existing = db.findItemByName(name);
  
  if (existing) {
    out.info(`"${name}" already exists.`);
    out.json({ item: existing, created: false });
    return;
  }

  const item = db.createItem(name);
  
  if (courses && courses.length > 0) {
    for (const courseName of courses) {
      const courseId = db.findOrCreateCourse(courseName.toLowerCase());
      db.linkItemToCourse(item.id, courseId);
    }
  }

  if (options.for && options.for.length > 0) {
    for (const occasionName of options.for) {
      const occasionId = db.findOrCreateOccasion(occasionName.toLowerCase());
      db.linkItemToOccasion(item.id, occasionId);
    }
  }

  const courseList = courses.length > 0 ? ` [${courses.join(', ')}]` : '';
  const occasionList = options.for && options.for.length > 0 ? ` → ${options.for.join(', ')}` : '';
  
  out.success(`Added "${name}"${courseList}${occasionList}`);
  out.json({ item, created: true });
}
