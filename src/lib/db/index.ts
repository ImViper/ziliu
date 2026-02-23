/// <reference types="@cloudflare/workers-types" />

import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

/**
 * Get the D1 database binding.
 * In Cloudflare Workers/Pages runtime, this uses getCloudflareContext().
 * Returns null during build or when not in CF environment.
 */
function getD1(): D1Database | null {
  try {
    // @opennextjs/cloudflare injects this
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const { env } = getCloudflareContext();
    return env.DB ?? null;
  } catch {
    // Not in CF environment (build time, dev, etc.)
    return null;
  }
}

/**
 * Get D1 or throw — for use in API routes that require DB access.
 */
function requireD1(): D1Database {
  const d1 = getD1();
  if (!d1) throw new Error('D1 database not available');
  return d1;
}

// Create drizzle instance with D1
const d1 = getD1();
export const db = d1 ? drizzle(d1, { schema }) : (null as any);

// Export helper functions
export { getD1, requireD1 };

// 导出schema以便在其他地方使用
export * from './schema';
