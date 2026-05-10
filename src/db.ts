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
