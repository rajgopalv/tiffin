import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { out } from './output';

let db: Database.Database;

export const initDb = (dbPath: string) => {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');

    createSchema();
  } catch (error: any) {
    out.jsonError({ error: `Failed to initialize database: ${error.message}` });
    process.exit(1);
  }
};

function createSchema() {
  const schema = `
    CREATE TABLE IF NOT EXISTS items (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL UNIQUE COLLATE NOCASE,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS courses (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE COLLATE NOCASE
    );

    CREATE TABLE IF NOT EXISTS occasions (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE COLLATE NOCASE
    );

    CREATE TABLE IF NOT EXISTS item_courses (
      item_id   INTEGER REFERENCES items(id) ON DELETE CASCADE,
      course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
      PRIMARY KEY (item_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS item_occasions (
      item_id     INTEGER REFERENCES items(id) ON DELETE CASCADE,
      occasion_id INTEGER REFERENCES occasions(id) ON DELETE CASCADE,
      PRIMARY KEY (item_id, occasion_id)
    );
  `;
  db.exec(schema);
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

export function findItemByName(name: string) {
  return getDb().prepare('SELECT * FROM items WHERE name = ?').get(name) as { id: number; name: string } | undefined;
}

export function createItem(name: string) {
  const info = getDb().prepare('INSERT INTO items (name) VALUES (?)').run(name);
  return { id: info.lastInsertRowid as number, name };
}

export function findOrCreateCourse(name: string) {
  const existing = getDb().prepare('SELECT id FROM courses WHERE name = ?').get(name) as { id: number } | undefined;
  if (existing) return existing.id;
  const info = getDb().prepare('INSERT INTO courses (name) VALUES (?)').run(name);
  return info.lastInsertRowid as number;
}

export function findOrCreateOccasion(name: string) {
  const existing = getDb().prepare('SELECT id FROM occasions WHERE name = ?').get(name) as { id: number } | undefined;
  if (existing) return existing.id;
  const info = getDb().prepare('INSERT INTO occasions (name) VALUES (?)').run(name);
  return info.lastInsertRowid as number;
}

export function linkItemToCourse(itemId: number, courseId: number) {
  getDb().prepare('INSERT OR IGNORE INTO item_courses (item_id, course_id) VALUES (?, ?)').run(itemId, courseId);
}

export function linkItemToOccasion(itemId: number, occasionId: number) {
  getDb().prepare('INSERT OR IGNORE INTO item_occasions (item_id, occasion_id) VALUES (?, ?)').run(itemId, occasionId);
}

export interface ItemDetail {
  id: number;
  name: string;
  courses: string[];
  occasions: string[];
}

export function getAllItems(filters: { course?: string; occasion?: string } = {}): ItemDetail[] {
  let query = `
    SELECT i.id, i.name, 
           GROUP_CONCAT(DISTINCT c.name) as courses, 
           GROUP_CONCAT(DISTINCT o.name) as occasions
    FROM items i
    LEFT JOIN item_courses ic ON i.id = ic.item_id
    LEFT JOIN courses c ON ic.course_id = c.id
    LEFT JOIN item_occasions io ON i.id = io.item_id
    LEFT JOIN occasions o ON io.occasion_id = o.id
  `;

  const params: string[] = [];
  const whereClauses: string[] = [];

  if (filters.course) {
    whereClauses.push(`i.id IN (SELECT item_id FROM item_courses WHERE course_id = (SELECT id FROM courses WHERE name = ?))`);
    params.push(filters.course.toLowerCase());
  }

  if (filters.occasion) {
    whereClauses.push(`i.id IN (SELECT item_id FROM item_occasions WHERE occasion_id = (SELECT id FROM occasions WHERE name = ?))`);
    params.push(filters.occasion.toLowerCase());
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ` + whereClauses.join(' AND ');
  }

  query += ` GROUP BY i.id ORDER BY i.name ASC`;

  const rows = getDb().prepare(query).all(...params) as any[];
  
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    courses: row.courses ? row.courses.split(',') : [],
    occasions: row.occasions ? row.occasions.split(',') : []
  }));
}

export function getItemDetail(name: string): ItemDetail | undefined {
  const query = `
    SELECT i.id, i.name, 
           GROUP_CONCAT(DISTINCT c.name) as courses, 
           GROUP_CONCAT(DISTINCT o.name) as occasions
    FROM items i
    LEFT JOIN item_courses ic ON i.id = ic.item_id
    LEFT JOIN courses c ON ic.course_id = c.id
    LEFT JOIN item_occasions io ON i.id = io.item_id
    LEFT JOIN occasions o ON io.occasion_id = o.id
    WHERE i.name = ?
    GROUP BY i.id
  `;

  const row = getDb().prepare(query).get(name) as any;
  if (!row) return undefined;

  return {
    id: row.id,
    name: row.name,
    courses: row.courses ? row.courses.split(',') : [],
    occasions: row.occasions ? row.occasions.split(',') : []
  };
}
