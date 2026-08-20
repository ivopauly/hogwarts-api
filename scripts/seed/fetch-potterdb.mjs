// One-off seeding script. Not part of the app build.
// Pages every Potter DB collection and writes flat snake_case JSON to server/data/.
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = 'https://api.potterdb.com/v1';
const UA = 'hogwarts-api-seed/1.0 (+https://github.com/ivopauly/hogwarts-api)';
const OUT = process.argv[2];
if (!OUT) { console.error('usage: node fetch-potterdb.mjs <outDir>'); process.exit(1); }
mkdirSync(OUT, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJson(url, attempt = 1) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (res.status === 429 || res.status >= 500) {
    if (attempt > 4) throw new Error(`${res.status} after ${attempt} attempts: ${url}`);
    await sleep(1000 * attempt * attempt);
    return getJson(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchAll(collection) {
  const out = [];
  let page = 1, last = 1;
  do {
    const url = `${BASE}/${collection}?page%5Bnumber%5D=${page}&page%5Bsize%5D=100`;
    const json = await getJson(url);
    last = json.meta?.pagination?.last ?? 1;
    for (const rec of json.data ?? []) {
      // Flatten JSON:API. `slug` is already in attributes and is the stable public id.
      const { slug, ...rest } = rec.attributes ?? {};
      out.push({ id: slug, slug, ...rest });
    }
    process.stdout.write(`\r  ${collection}: page ${page}/${last} (${out.length} records)`);
    page += 1;
    if (page <= last) await sleep(250); // be a good citizen
  } while (page <= last);
  process.stdout.write('\n');
  return out;
}

const collections = ['books', 'movies', 'characters', 'spells', 'potions'];
const summary = [];
for (const c of collections) {
  const rows = await fetchAll(c);
  const file = `${OUT}/${c}.json`;
  writeFileSync(file, JSON.stringify(rows, null, 2) + '\n');
  const bytes = Buffer.byteLength(JSON.stringify(rows, null, 2));
  summary.push({ collection: c, records: rows.length, kb: Math.round(bytes / 1024) });
}
console.table(summary);
