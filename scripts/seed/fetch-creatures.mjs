// One-off seeding script. Builds creatures.json from the Harry Potter Fandom wiki.
// Potter DB has no creatures endpoint (verified: /v1/creatures returns 404), so the
// wiki's {{Creature infobox}} is the structured source. Text is CC-BY-SA; every
// record carries its source `wiki` URL.
import { writeFileSync } from 'node:fs';
import { clean, toList, scalar, parseTemplate, introParagraph, filePath, slugify } from './wikitext.mjs';

const API = 'https://harrypotter.fandom.com/api.php';
const UA = 'hogwarts-api-seed/1.0 (+https://github.com/ivopauly/hogwarts-api)';
const OUT = process.argv[2];
if (!OUT) { console.error('usage: node fetch-creatures.mjs <outDir>'); process.exit(1); }

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function api(params, attempt = 1) {
  const url = `${API}?${new URLSearchParams({ ...params, format: 'json', formatversion: '2' })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (res.status === 429 || res.status >= 500) {
    if (attempt > 4) throw new Error(`${res.status}: ${url}`);
    await sleep(1000 * attempt * attempt);
    return api(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function categoryMembers(category, type) {
  const out = [];
  let cont;
  do {
    const p = { action: 'query', list: 'categorymembers', cmtitle: `Category:${category}`, cmlimit: '500', cmtype: type };
    if (cont) p.cmcontinue = cont;
    const j = await api(p);
    out.push(...(j?.query?.categorymembers ?? []).map(m => m.title));
    cont = j?.continue?.cmcontinue;
    if (cont) await sleep(200);
  } while (cont);
  return out;
}

function singularise(name) {
  if (/ies$/.test(name)) return name.replace(/ies$/, 'y');
  if (/(ch|sh|ss|x|z)es$/.test(name)) return name.replace(/es$/, '');
  if (/i$/.test(name)) return name.replace(/i$/, 'us');
  if (/ae$/.test(name)) return name.replace(/ae$/, 'a');
  if (/s$/.test(name) && !/ss$/.test(name)) return name.replace(/s$/, '');
  return name;
}

/** Ministry of Magic classification: XXXXX (known wizard killer) down to X (boring). */
function classification(classField) {
  const c = clean(classField);
  if (!c) return null;
  const m = c.match(/\b(X{1,5})\b/);
  return m ? m[1] : null;
}

async function hydrate(titles) {
  const records = [];
  for (let i = 0; i < titles.length; i += 20) {
    const batch = titles.slice(i, i + 20);
    const j = await api({
      action: 'query', prop: 'revisions|info', rvprop: 'content', rvslots: 'main',
      inprop: 'url', redirects: '1', titles: batch.join('|'),
    });
    for (const page of j?.query?.pages ?? []) {
      if (page.missing) continue;
      const text = page.revisions?.[0]?.slots?.main?.content;
      if (!text) continue;
      const box = parseTemplate(text, /Creature infobox/i);
      if (!box) continue;                                    // not a creature article
      const summary = introParagraph(text);
      if (!summary) continue;
      records.push({
        id: slugify(page.title),
        slug: slugify(page.title),
        name: page.title,
        summary,
        classification: classification(box.class),
        native_to: scalar(box.native),
        skin_color: scalar(box.skin),
        eye_color: scalar(box.eyes),
        hair_color: scalar(box.hair),
        feathers: scalar(box.feathers),
        height: scalar(box.height),
        length: scalar(box.length),
        wingspan: scalar(box.wingspan),
        related_to: toList(box.related),
        distinctions: toList(box.distinction),
        affiliation: toList(box.affiliation),
        status: scalar(box.status),
        image: filePath(box.image),
        wiki: page.fullurl,
      });
    }
    process.stdout.write(`\r  parsed ${records.length} creatures from ${Math.min(i + 20, titles.length)}/${titles.length} pages`);
    await sleep(250);
  }
  process.stdout.write('\n');
  return records;
}

const subcats = (await categoryMembers('Beasts', 'subcat')).map(t => singularise(t.replace('Category:', '')));
const direct = [...await categoryMembers('Beasts', 'page'), ...await categoryMembers('Beings', 'page')];
const EXCLUDE = /^(Beast|Being|Creature|List of|Dark being|Spirit-being)$/i;
const candidates = [...new Set([...subcats, ...direct])].filter(t => !EXCLUDE.test(t)).sort();
console.log(`  ${subcats.length} species from subcategories + ${direct.length} direct pages = ${candidates.length} candidates`);

const records = await hydrate(candidates);
const seen = new Set();
const deduped = records.filter(r => !seen.has(r.slug) && seen.add(r.slug))
                       .sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(`${OUT}/creatures.json`, JSON.stringify(deduped, null, 2) + '\n');
console.log(`  wrote ${deduped.length} creatures (${Math.round(Buffer.byteLength(JSON.stringify(deduped, null, 2)) / 1024)} kb)`);
console.log(`  classified: ${deduped.filter(r => r.classification).length} | image: ${deduped.filter(r => r.image).length} | native_to: ${deduped.filter(r => r.native_to).length}`);
console.log('  sample:', deduped.slice(0, 8).map(r => r.name).join(', '));
