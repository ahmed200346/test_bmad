import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'optitask.db');
const db = new Database(DB_PATH);

export function migrate() {
  // Create schema version table if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const currentVersion = db.prepare('SELECT MAX(version) as version FROM schema_version').get() as { version: number | null };
  const version = currentVersion?.version || 0;

  const migrationsDir = path.join(process.cwd(), 'lib/migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const fileVersion = parseInt(file.split('_')[0]);
    if (fileVersion > version) {
      console.log(`Applying migration ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      db.transaction(() => {
        db.exec(sql);
        db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(fileVersion);
      })();
    }
  }
}

export function initDb() {
  migrate();
}

export default db;
