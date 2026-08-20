// Minimal wikitext helpers, shared by the creature and enrichment seed scripts.

/** Strip wiki markup down to plain text. */
export function clean(raw) {
  if (!raw) return null;
  let s = String(raw);
  s = s.replace(/<ref[^>]*\/>/gi, '');                       // self-closing refs
  s = s.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');          // paired refs
  s = s.replace(/\{\{[^{}]*\}\}/g, '');                      // simple templates
  s = s.replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1');         // [[Target|Label]] -> Label
  s = s.replace(/\[\[([^\]]*)\]\]/g, '$1');                  // [[Target]] -> Target
  s = s.replace(/'''([^']*)'''/g, '$1').replace(/''([^']*)''/g, '$1');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<[^>]+>/g, '');                             // any remaining html
  s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  s = s.split('\n').map(l => l.trim()).filter(Boolean).join('\n').trim();
  return s || null;
}

/** Split a cleaned multi-line / bulleted value into an array. */
export function toList(raw) {
  const c = clean(raw);
  if (!c) return [];
  return c.split('\n')
    .map(l => l.replace(/^\*+\s*/, '').trim())
    .filter(Boolean);
}

/**
 * Clean a value that is conceptually a single field but may be authored as a
 * bulleted list (eye colour, hair colour...). Joins the values into one string
 * so the field's type stays string|null rather than sometimes-array.
 */
export function scalar(raw) {
  const list = toList(raw);
  if (!list.length) return null;
  return list.join(', ');
}

/**
 * Pull a named template's parameters out of wikitext.
 * Brace-aware so nested {{...}} and [[...]] inside values survive.
 */
export function parseTemplate(text, nameRegex) {
  const start = text.search(nameRegex);
  if (start === -1) return null;
  let i = text.indexOf('{{', start === 0 ? 0 : start - 2);
  if (i === -1) return null;
  let depth = 0, end = -1;
  for (let k = i; k < text.length - 1; k++) {
    if (text[k] === '{' && text[k + 1] === '{') { depth++; k++; }
    else if (text[k] === '}' && text[k + 1] === '}') { depth--; k++; if (depth === 0) { end = k + 1; break; } }
  }
  if (end === -1) return null;
  const body = text.slice(i + 2, end - 2);

  // Split on top-level pipes only.
  const parts = [];
  let buf = '', bd = 0, bk = 0;
  for (let k = 0; k < body.length; k++) {
    const two = body.slice(k, k + 2);
    if (two === '{{') { bd++; buf += two; k++; continue; }
    if (two === '}}') { bd--; buf += two; k++; continue; }
    if (two === '[[') { bk++; buf += two; k++; continue; }
    if (two === ']]') { bk--; buf += two; k++; continue; }
    if (body[k] === '|' && bd === 0 && bk === 0) { parts.push(buf); buf = ''; continue; }
    buf += body[k];
  }
  parts.push(buf);

  const fields = {};
  for (const p of parts.slice(1)) {
    const eq = p.indexOf('=');
    if (eq === -1) continue;
    fields[p.slice(0, eq).trim().toLowerCase()] = p.slice(eq + 1).trim();
  }
  return fields;
}

/** First real prose paragraph: skips templates, quotes, files and headings. */
export function introParagraph(text) {
  let s = text;
  // Drop leading template blocks (infobox, spoiler, quote) brace-aware.
  let guard = 0;
  while (s.trimStart().startsWith('{{') && guard++ < 20) {
    s = s.trimStart();
    let depth = 0, end = -1;
    for (let k = 0; k < s.length - 1; k++) {
      if (s[k] === '{' && s[k + 1] === '{') { depth++; k++; }
      else if (s[k] === '}' && s[k + 1] === '}') { depth--; k++; if (depth === 0) { end = k + 1; break; } }
    }
    if (end === -1) break;
    s = s.slice(end);
  }
  for (const line of s.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('=') || t.startsWith('[[File:') || t.startsWith('{{') || t.startsWith('*')) continue;
    const c = clean(t);
    if (c && c.length > 60) return c;
  }
  return null;
}

/** Stable, URL-safe id from a page title. */
export const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Fandom serves originals through Special:FilePath — no extra API round-trip. */
export function filePath(file) {
  if (!file) return null;
  const name = String(file).replace(/^\s*(\[\[)?\s*(File|Image):/i, '').replace(/\]\].*$/, '').split('|')[0].trim();
  if (!name) return null;
  return `https://harrypotter.fandom.com/wiki/Special:FilePath/${encodeURIComponent(name.replace(/ /g, '_'))}`;
}
