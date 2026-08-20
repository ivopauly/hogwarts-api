// Shared loading, searching and pagination for the Hogwarts API datasets.
// Files in server/utils are auto-imported by Nitro, so route handlers use these
// helpers directly without an import statement.
//
// The datasets are imported statically so Nitro bundles them into the server
// build. Do not switch to reading them with `fs` at runtime — that works in dev
// and breaks in the deployed Netlify function.
import books from '../data/books.json';
import characters from '../data/characters.json';
import creatures from '../data/creatures.json';
import movies from '../data/movies.json';
import potions from '../data/potions.json';
import spells from '../data/spells.json';

export interface CollectionRecord {
  id: string;
  slug: string;
  name?: string;
  title?: string;
  [key: string]: unknown;
}

// Keep the literal keys so CollectionName is a union of the six names rather
// than `string`; a bare Record index would also be `| undefined` under
// noUncheckedIndexedAccess.
const collections = {
  books: books as CollectionRecord[],
  characters: characters as CollectionRecord[],
  creatures: creatures as CollectionRecord[],
  movies: movies as CollectionRecord[],
  potions: potions as CollectionRecord[],
  spells: spells as CollectionRecord[],
};

export type CollectionName = keyof typeof collections;

export const collectionNames = Object.keys(collections) as CollectionName[];

export function getCollection(name: CollectionName): CollectionRecord[] {
  return collections[name];
}

/** Books and movies carry `title`; everything else carries `name`. */
function label(record: CollectionRecord): string {
  return String(record.title ?? record.name ?? '');
}

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

function toPositiveInt(value: unknown, fallback: number): number {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * List a collection with `?search=`, `?page=` and `?page_size=`.
 * page_size is clamped to MAX_PAGE_SIZE so a single request can never be asked
 * to serialise all 5,410 characters.
 */
export function listCollection(event: import('h3').H3Event, name: CollectionName) {
  const query = getQuery(event);
  const all = getCollection(name);

  const search = String(query.search ?? '').trim().toLowerCase();
  const filtered = search
    ? all.filter(record => label(record).toLowerCase().includes(search))
    : all;

  const pageSize = Math.min(toPositiveInt(query.page_size, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(toPositiveInt(query.page, 1), totalPages);
  const start = (page - 1) * pageSize;

  return {
    data: filtered.slice(start, start + pageSize),
    meta: {
      page,
      page_size: pageSize,
      total_pages: totalPages,
      total_records: filtered.length,
      search: search || null,
    },
  };
}

/** "Hermione Granger" -> "hermione-granger", matching how slugs are generated. */
function toSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Fetch one record by its slug. Also accepts a human-readable name, either
 * exactly ("Hermione Jean Granger") or in a form that slugifies to a known slug
 * ("Hermione Granger" -> hermione-granger), so callers do not have to know which
 * identifier a record uses.
 */
export function findInCollection(event: import('h3').H3Event, name: CollectionName) {
  const identifier = String(getRouterParam(event, 'name') ?? '').trim();
  if (!identifier) {
    throw createError({ statusCode: 400, statusMessage: 'A slug or name is required' });
  }

  const wanted = identifier.toLowerCase();
  const wantedSlug = toSlug(identifier);
  const all = getCollection(name);
  const record =
    all.find(item => item.slug?.toLowerCase() === wanted)
    ?? all.find(item => label(item).toLowerCase() === wanted)
    ?? all.find(item => item.slug?.toLowerCase() === wantedSlug);

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: `No ${name.replace(/s$/, '')} found for "${identifier}"`,
    });
  }

  return { data: record };
}
