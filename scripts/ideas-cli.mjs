#!/usr/bin/env node
/** Fastify Motion Bro: local-only 500-idea exploration and Claude handoff. No model calls or paid APIs. */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const dataURL = new URL('../data/motion-ideas-500.json', import.meta.url);
export function readCatalog() {
  return JSON.parse(readFileSync(dataURL, 'utf8'));
}
export function validateCatalog(data = readCatalog()) {
  if (!data || !Array.isArray(data.ideas)) throw Error('Invalid catalog schema: ideas must be an array');
  if (data.count !== 500 || data.ideas.length !== 500) throw Error('Expected exactly 500 ideas');
  const ids = new Set(), titles = new Set();
  for (const [index, item] of data.ideas.entries()) {
    if (item.id !== 'MB-' + String(index + 1).padStart(3, '0')) throw Error('Nonsequential idea at index ' + index);
    if (typeof item.title !== 'string' || !item.title.trim() || typeof item.engineering_spec !== 'string' || !item.engineering_spec.trim()) throw Error('Missing idea fields: ' + item.id);
    if (item.status !== 'proposed-not-implemented') throw Error('Unsupported catalog status: ' + item.id);
    if (ids.has(item.id) || titles.has(item.title.toLowerCase())) throw Error('Duplicate idea: ' + item.id);
    ids.add(item.id); titles.add(item.title.toLowerCase());
  }
  return {count: data.ideas.length, categories: new Set(data.ideas.map(x => x.category)).size};
}
export function searchIdeas(query, {category = '', limit = 25} = {}, data = readCatalog()) {
  const q = String(query ?? '').trim().toLocaleLowerCase();
  const c = String(category).trim().toLocaleLowerCase();
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 500) throw Error('limit must be an integer from 1 to 500');
  return data.ideas.filter(x => (!c || x.category.toLowerCase().includes(c))
    && (!q || [x.id, x.title, x.category, x.engineering_spec].join(' ').toLocaleLowerCase().includes(q))).slice(0, limit);
}
export function getIdea(id, data = readCatalog()) {
  const key = String(id || '').trim().toUpperCase();
  const idea = data.ideas.find(x => x.id === key);
  if (!idea) throw Error('Unknown idea ID: ' + key);
  return idea;
}
export function makeHandoff(id, data = readCatalog()) {
  const x = getIdea(id, data);
  return [
    '# Claude Code — selected Motion Lab improvement',
    '',
    'Repository: https://github.com/kosif199022-jpg/fastify-motion-bro',
    'Read AGENTS.md, CLAUDE.md, docs/PROFILE_CATALOG.md and docs/MOTION_LAB_500.md.',
    'This is ONE proposal from a curated backlog, NOT an implemented feature or 500 independent expert outputs.',
    '',
    'ID: ' + x.id,
    'Category: ' + x.category,
    'Improvement: ' + x.title,
    'Implementation direction: ' + x.engineering_spec,
    '',
    'Implementation contract:',
    '1. Inspect the current code; establish a failing regression test or measurable baseline first.',
    '2. Propose a minimal, reversible plan with touched files and explicit acceptance criteria.',
    '3. Implement real editable time-driven behavior; a prompt alone does not count as implementation.',
    '4. Preserve Arabic text/RTL, 9:16 safe areas, profile stage gates and character continuity.',
    '5. Show a concrete preview/smoke render and run the test suite. Report exact passes and failures.',
    '6. Keep any Veo/Flow/Higgsfield/Claude API adapter disabled until actual credentials, scope and cost are explicitly approved.',
    '7. Do not claim assets, footage, model calls or visual inspections that did not happen.',
    '8. Request separate approval before final render, external upload, paid calls, or publishing.',
    '9. Preserve the unfiltered proposal catalog; do not confuse creative opinion collection with authorization to act.',
    '',
    'Return: code diff, new tests, preview instructions, QA receipt and a list of remaining gaps.'
  ].join('\n');
}
function format(ideas) {
  return ideas.map(x => x.id + ' [' + x.priority + '] ' + x.category + ': ' + x.title).join('\n') || '(no matches)';
}
export function run(args = process.argv.slice(2), data = readCatalog()) {
  validateCatalog(data);
  const [cmd, ...rest] = args;
  switch (cmd) {
    case 'validate': return 'OK: 500 distinct proposed ideas across ' + new Set(data.ideas.map(x => x.category)).size + ' domains; implemented=0';
    case 'list': {
      const counts = new Map();
      for (const x of data.ideas) counts.set(x.category, (counts.get(x.category) || 0) + 1);
      return '500 proposals; these are NOT implemented features.\n' + [...counts].map(([k,v]) => k + ' (' + v + ')').join('\n') + '\nUse: npm run ideas -- search arabic';
    }
    case 'search': {
      if (!rest.length) throw Error('Usage: npm run ideas -- search <text> [limit]');
      const maybeLimit = Number(rest.at(-1));
      const hasLimit = rest.length > 1 && Number.isSafeInteger(maybeLimit) && maybeLimit >= 1;
      const query = (hasLimit ? rest.slice(0, -1) : rest).join(' ');
      return format(searchIdeas(query, {limit: hasLimit ? maybeLimit : 25}, data));
    }
    case 'category': {
      if (!rest.length) throw Error('Usage: npm run ideas -- category <name>');
      return format(searchIdeas('', {category: rest.join(' '), limit: 500}, data));
    }
    case 'show': return JSON.stringify(getIdea(rest[0], data), null, 2);
    case 'handoff': return makeHandoff(rest[0], data);
    case 'help': case undefined:
      return 'Commands: list | validate | search <text> [limit] | category <name> | show MB-001 | handoff MB-001';
    default: throw Error('Unknown command: ' + cmd + ' (try help)');
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(run()); }
  catch (err) { console.error('ERROR: ' + err.message); process.exitCode = 1; }
}
