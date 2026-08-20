# Attribution

Hogwarts API is an unofficial fan project. Harry Potter, Fantastic Beasts and Hogwarts
Legacy are trademarks of Warner Bros. Entertainment Inc. This project is not affiliated
with, endorsed by, or sponsored by Warner Bros. or J.K. Rowling.

If you see a broken link or have an issue with any attributed material,
[please let us know](https://github.com/ivopauly/hogwarts-api/issues/new/choose).

## Data

The datasets in [`server/data/`](server/data) are compiled from two sources by the
scripts in [`scripts/seed/`](scripts/seed).

- **[Potter DB](https://potterdb.com)** ([API docs](https://docs.potterdb.com/apis/rest))
  — books, movies, characters, spells and potions. Potter DB is itself derived from the
  Harry Potter Fandom wiki.
- **[Harry Potter Fandom wiki](https://harrypotter.fandom.com)** — creatures, parsed
  from each article's `{{Creature infobox}}`, plus release-date verification for the
  films.

Fandom content is licensed under
[CC BY-SA 3.0](https://www.fandom.com/licensing). Text derived from it therefore
remains CC BY-SA, and every record carries a `wiki` field linking to the source
article so attribution travels with the data.

Images referenced by the `image`, `cover` and `poster` fields are **hot-linked URLs**,
not copies. They are hosted by Wizarding World and Fandom and remain the property of
their respective rights holders.

## Images

- ["Hogwarts API Logo and Icon"](public/logo.png) by
  [Ivo Pauly-Koelewijn](https://github.com/ivopauly), used under the
  [MIT License](LICENSE), as a contribution to the Hogwarts API project.

## Software

- [shadcn-docs-nuxt](https://github.com/ZTL-UwU/shadcn-docs-nuxt) by ZTL-UwU — the
  documentation theme, used under the MIT License.
