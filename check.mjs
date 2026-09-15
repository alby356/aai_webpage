import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { selectTools, getDestination } from './dist/catalog.mjs';

const html = readFileSync(new URL('./dist/index.html', import.meta.url), 'utf8');
const tools = [...html.matchAll(/<a class="project" data-subject="([^"]+)" data-name="([^"]+)"/g)]
  .map(([, subject, name]) => ({ subject, name }));
assert.equal(tools.length, 6);
assert.equal(selectTools(tools, 'chemistry', 'featured').length, 4);
assert.equal(selectTools(tools, 'english', 'featured').length, 2);
assert.deepEqual(selectTools(tools, 'math', 'featured'), []);
assert.deepEqual(selectTools(tools, 'apush', 'featured'), []);
assert.equal(selectTools(tools, 'all', 'name')[0].name, 'Equation &amp; Redox Practice');
assert.deepEqual(selectTools(tools, 'all', 'featured'), tools);
assert.equal(tools[0].name, 'Ion Nomenclature Practice', 'Sorting must not mutate the original order');
console.log('Passed: all six tools, subject filtering, empty subjects, alphabetical sort, and original order.');

const links = [...html.matchAll(/href="([^"]+)" data-tool="([^"]+)"/g)];
assert.equal(links.length, 6);
links.forEach(([, href, id]) => {
  assert.equal(new URL(href).protocol, 'https:');
  assert.equal(getDestination(id).url, href);
});
for (const invalid of [null, '', '__proto__', 'constructor', 'https://evil.example', '../chemions', 'javascript:alert(1)']) {
  assert.equal(getDestination(invalid), null);
}
assert.equal(getDestination('quotesearch').name, 'Quote Page Finder');
console.log('Passed: six allowed destinations, missing/unknown parameters, inherited keys, and unsafe input.');

// Exercise the actual redirect handler without launching external study tools.
const script = readFileSync(new URL('./dist/app.js', import.meta.url), 'utf8').replace(/^import .*;\n/, '');
for (const action of ['automatic', 'cancel', 'continue', 'invalid', 'reduced', 'delayed']) {
  const elements = new Map();
  let pending;
  let delay;
  let navigated;
  let animated = false;
  let now = 0;
  let animationDuration;
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      events: {},
      addEventListener(type, callback) { this.events[type] = callback; },
      animate(frames, options) { animated = true; animationDuration = options.duration; },
    });
    return elements.get(selector);
  };
  runInNewContext(script, {
    selectTools, getDestination, URL, URLSearchParams,
    performance: { now: () => now },
    document: { querySelector: selector => selector === '.directory-controls' ? null : element(selector), querySelectorAll: () => [] },
    location: { search: action === 'invalid' ? '?tool=evil' : '?tool=chemions', replace: url => { navigated = url; } },
    setTimeout: (callback, ms) => { pending = callback; delay = ms; return 1; },
    clearTimeout: () => { pending = undefined; },
    addEventListener() {},
    matchMedia: () => ({ matches: action === 'reduced' }),
  });
  if (action === 'invalid') {
    assert.equal(pending, undefined);
    assert.match(element('#handoff-title').textContent, /isn’t available/);
    continue;
  }
  assert.equal(delay, 1000);
  assert.equal(element('#handoff-countdown').textContent, 'Continuing in 5 seconds.');
  if (animated) assert.equal(animationDuration, 5000);
  assert.match(element('#handoff-detail').textContent, /chemions\.vercel\.app/);
  assert.equal(element('#continue-link').href, 'https://chemions.vercel.app/');
  if (action === 'cancel' || action === 'continue') {
    element(action === 'cancel' ? '#cancel-link' : '#continue-link').events.click();
    assert.equal(pending, undefined);
    assert.equal(navigated, undefined);
  } else {
    if (action === 'reduced') assert.equal(animated, false);
    if (action !== 'delayed') {
      for (const elapsed of [1000, 2000, 3000, 4000, 4999]) {
        now = elapsed;
        pending();
        const seconds = Math.ceil((5000 - elapsed) / 1000);
        assert.equal(element('#handoff-countdown').textContent, `Continuing in ${seconds} ${seconds === 1 ? 'second' : 'seconds'}.`);
        assert.equal(navigated, undefined, 'Do not redirect before five seconds');
      }
    }
    now = action === 'delayed' ? 6500 : 5000;
    pending();
    assert.equal(element('#handoff-countdown').textContent, 'Redirecting now…');
    assert.equal(navigated, 'https://chemions.vercel.app/');
  }
}
console.log('Passed: live five-second countdown, matching progress duration, delayed callbacks, cancellation, invalid destination, and reduced motion.');
