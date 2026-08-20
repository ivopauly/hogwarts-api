// One-off seeding script. Enriches the Potter DB base data:
//   books  <- chapter lists preserved from this repo's existing server/data/books/*.json
//             (Potter DB has no chapters), normalised to a consistent shape
//   movies <- release dates repaired ONLY where Potter DB is demonstrably wrong
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { parseTemplate, clean } from './wikitext.mjs';

const [OUT, REPO] = process.argv.slice(2);
if (!OUT || !REPO) { console.error('usage: node enrich.mjs <outDir> <repoRoot>'); process.exit(1); }
if (!existsSync(`${REPO}/server/data`)) { console.error(`not a repo root: ${REPO}`); process.exit(1); }

const UA = 'hogwarts-api-seed/1.0 (+https://github.com/ivopauly/hogwarts-api)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const read = f => JSON.parse(readFileSync(f, 'utf8'));

// ---------------------------------------------------------------- books
const books = read(`${OUT}/books.json`);
const legacyDir = `${REPO}/server/data/books`;
const legacy = existsSync(legacyDir)
  ? readdirSync(legacyDir).filter(f => f.endsWith('.json')).map(f => read(`${legacyDir}/${f}`))
  : [];

const norm = t => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
let merged = 0, chapterCount = 0, withSummary = 0;
for (const book of books) {
  const match = legacy.find(l => norm(l.title) === norm(book.title));
  if (!match?.chapters) { book.chapters = []; continue; }
  // Legacy chapters are inconsistent: most carry {title, summary}, but the Chamber
  // of Secrets entries carry {title, order}, one `order` being a number not a string.
  // Normalise every chapter to {order, title, summary}.
  book.chapters = match.chapters.map((c, i) => ({
    order: i + 1,
    title: c.title ?? null,
    summary: typeof c.summary === 'string' && c.summary.trim() ? c.summary.trim() : null,
  }));
  chapterCount += book.chapters.length;
  withSummary += book.chapters.filter(c => c.summary).length;
  merged += 1;
}
writeFileSync(`${OUT}/books.json`, JSON.stringify(books, null, 2) + '\n');
console.log(`books   : merged chapters into ${merged}/${books.length} books — ${chapterCount} chapters, ${withSummary} with summaries`);
if (merged !== books.length) console.warn(`  WARNING: ${books.length - merged} book(s) got no chapters`);

// ---------------------------------------------------------------- movies
const movies = read(`${OUT}/movies.json`);
const MONTHS = { january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11 };

/** Parse "31 May 2004" / "May 31, 2004" to an ISO date WITHOUT timezone drift. */
function isoDate(text) {
  let m = text.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (m && MONTHS[m[2].toLowerCase()] !== undefined)
    return new Date(Date.UTC(+m[3], MONTHS[m[2].toLowerCase()], +m[1])).toISOString().slice(0, 10);
  m = text.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (m && MONTHS[m[1].toLowerCase()] !== undefined)
    return new Date(Date.UTC(+m[3], MONTHS[m[1].toLowerCase()], +m[2])).toISOString().slice(0, 10);
  return null;
}

async function fandomRelease(wikiUrl) {
  const title = decodeURIComponent((wikiUrl || '').split('/wiki/')[1] || '').replace(/_/g, ' ');
  if (!title) return null;
  const url = `https://harrypotter.fandom.com/api.php?${new URLSearchParams({
    action: 'query', prop: 'revisions', rvprop: 'content', rvslots: 'main',
    redirects: '1', titles: title, format: 'json', formatversion: '2',
  })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const text = (await res.json())?.query?.pages?.[0]?.revisions?.[0]?.slots?.main?.content;
  if (!text) return null;
  const box = parseTemplate(text, /Film infobox|Movie infobox/i);
  const raw = clean(box?.release || box?.released || box?.releasedate);
  return raw ? isoDate(raw) : null;
}

// Only repair records Potter DB clearly got wrong. Fandom and Potter DB legitimately
// disagree on premiere-vs-wide-release for several films, so a blanket overwrite would
// churn correct data. A release_date shared by two different films cannot be right.
const byDate = new Map();
for (const m of movies) byDate.set(m.release_date, [...(byDate.get(m.release_date) ?? []), m]);
const suspect = [...byDate.values()].filter(g => g.length > 1).flat();

const repaired = [], unchanged = [];
for (const movie of movies) {
  const found = await fandomRelease(movie.wiki);
  if (found && found !== movie.release_date) {
    if (suspect.includes(movie)) {
      repaired.push({ title: movie.title, was: movie.release_date, now: found });
      movie.release_date = found;
    } else {
      unchanged.push({ title: movie.title, potterdb: movie.release_date, fandom: found });
    }
  }
  await sleep(250);
}
writeFileSync(`${OUT}/movies.json`, JSON.stringify(movies, null, 2) + '\n');
console.log(`movies  : ${movies.length} release dates cross-checked against Fandom`);
if (repaired.length) { console.log('  REPAIRED (duplicate dates — impossible):'); console.table(repaired); }
if (unchanged.length) { console.log(`  ${unchanged.length} left as-is (premiere vs wide-release disagreement, both defensible):`); console.table(unchanged); }
