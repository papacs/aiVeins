import test from 'node:test';
import assert from 'node:assert/strict';
import { loadAndValidateContent } from '../scripts/validate-content.mjs';

test('all term files pass the content contract', () => {
  const { terms, errors } = loadAndValidateContent();
  assert.deepEqual(errors, []);
  assert.ok(
    terms.length >= 12,
    'the first release should include a useful foundation',
  );
});

test('verified terms include a source and decision guidance', () => {
  const { terms } = loadAndValidateContent();
  for (const term of terms.filter((item) => item.status === 'verified')) {
    assert.ok(term.sources.length > 0, `${term.slug} needs a source`);
    assert.ok(term.use_when.length > 0, `${term.slug} needs use_when`);
    assert.ok(term.avoid_when.length > 0, `${term.slug} needs avoid_when`);
  }
});
