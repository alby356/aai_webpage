import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { selectTools, getDestination } from './dist/catalog.mjs';

const html = readFileSync(new URL('./dist/index.html', import.meta.url), 'utf8');
const tools = [...html.matchAll(/<article class="project" data-subject="([^"]+)" data-name="([^"]+)">/g)]
  .map(([, subject, name]) => ({ subject, name }));
assert.equal(tools.length, 6);
assert.equal(selectTools(tools, 'chemistry', 'featured').length, 4);
assert.equal(selectTools(tools, 'english', 'featured').length, 2);
assert.deepEqual(selectTools(tools, 'math', 'featured'), []);
assert.deepEqual(selectTools(tools, 'apush', 'featured'), []);
assert.equal(selectTools(tools, 'all', 'name')[0].name, 'Chem Balancing');
assert.deepEqual(selectTools(tools, 'all', 'featured'), tools);
assert.equal(tools[0].name, 'Chem Ions', 'Sorting must not mutate the original order');
console.log('Passed: all six tools, subject filtering, empty subjects, alphabetical sort, and original order.');

const links = [...html.matchAll(/class="button tool-link" href="([^"]+)" data-tool="([^"]+)"/g)];
assert.equal(links.length, 6);
links.forEach(([, href, id]) => {
  assert.equal(new URL(href).protocol, 'https:');
  assert.equal(getDestination(id).url, href);
});
for (const invalid of [null, '', '__proto__', 'constructor', 'https://evil.example', '../chemions', 'javascript:alert(1)']) {
  assert.equal(getDestination(invalid), null);
}
assert.equal(getDestination('quotesearch').name, 'QuoteSearch');
console.log('Passed: six allowed destinations, missing/unknown parameters, inherited keys, and unsafe input.');
