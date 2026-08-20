# Seed scripts

One-off scripts that regenerate the JSON datasets in `server/data/`. They are **not**
part of the app build — nothing in `server/` or `nuxt.config.ts` imports them.

Run them only when you want to refresh the data from source.

## Usage

```bash
# 1. Pull the base collections from Potter DB
node scripts/seed/fetch-potterdb.mjs server/data

# 2. Build creatures from the Fandom wiki (Potter DB has no creatures endpoint)
node scripts/seed/fetch-creatures.mjs server/data

# 3. Enrich: merge chapter lists, repair broken release dates
node scripts/seed/enrich.mjs server/data .
```

Step 3 must run after step 1. It reads the existing `server/data/books.json`, so
re-running step 1 alone will drop chapter data until step 3 runs again.

## Sources

- **[Potter DB](https://potterdb.com)** — books, movies, characters, spells, potions.
  Already `snake_case`; the scripts flatten the JSON:API envelope and use `slug` as `id`.
- **[Harry Potter Fandom wiki](https://harrypotter.fandom.com)** — creatures, parsed
  from the `{{Creature infobox}}` template, plus release-date verification.
  Content is CC-BY-SA; every record keeps a `wiki` link to its source article.

Both are hit with a descriptive `User-Agent` and a 250 ms delay between requests.

## Notes

- `enrich.mjs` deliberately does **not** blanket-overwrite release dates. Potter DB and
  Fandom legitimately disagree on premiere vs wide release for four films. It only
  repairs dates that are provably wrong — currently one case, where two different films
  shared a release date.
- Dates are built with `Date.UTC` rather than `new Date(string)`. Parsing a bare date
  string yields local midnight, and `toISOString()` then shifts it back a day in any
  positive-offset timezone.
