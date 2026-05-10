import { out } from '../output';
import * as db from '../db';
import { parseTags } from '../utils';

export async function addCommand(name: string, coursesRaw: string[], options: { for?: string }) {
  const courses = parseTags(coursesRaw);
  const occasions = parseTags(options.for);

  const existing = db.findItemByName(name);
  
  if (existing) {
    out.info(`"${name}" already exists.`);
    out.json({ item: existing, created: false });
    return;
  }

  const item = db.createItem(name);
  
  for (const courseName of courses) {
    const courseId = db.findOrCreateCourse(courseName);
    db.linkItemToCourse(item.id, courseId);
  }

  for (const occasionName of occasions) {
    const occasionId = db.findOrCreateOccasion(occasionName);
    db.linkItemToOccasion(item.id, occasionId);
  }

  const courseList = courses.length > 0 ? ` [${courses.join(', ')}]` : '';
  const occasionList = occasions.length > 0 ? ` → ${occasions.join(', ')}` : '';
  
  out.success(`Added "${name}"${courseList}${occasionList}`);
  out.json({ item, created: true });
}
