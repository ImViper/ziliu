import type { Config } from 'drizzle-kit';

// For D1 development, we'll use a local sqlite file for migrations
export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:./dev.db',
  },
} satisfies Config;
