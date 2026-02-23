import { getD1 } from './index';

// Ensure the `style` column exists on `articles` table at runtime for backward compatibility
export async function ensureArticleStyleColumn() {
  try {
    const d1 = getD1();
    if (!d1) {
      console.warn('[DB] D1 not available, skipping column check');
      return;
    }

    // Check existing columns
    const res = await d1.prepare(`PRAGMA table_info(articles);`).all();
    const hasStyle = res.results.some((row: any) => row && (row.name === 'style' || row.column === 'style'));

    if (!hasStyle) {
      await d1.prepare(`ALTER TABLE articles ADD COLUMN style TEXT DEFAULT 'default';`).run();
    }
  } catch (e) {
    // Do not block if the database is not accessible or command fails
    console.warn('[DB] ensureArticleStyleColumn skipped:', (e as Error).message);
  }
}

