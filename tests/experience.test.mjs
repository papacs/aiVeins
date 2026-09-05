import test from 'node:test';
import assert from 'node:assert/strict';
import { termMetaSchema } from '../lib/term-schema.ts';
import { filterTerms, getPathStep, statusLabels } from '../lib/experience.ts';
import { paths, comparisons, scenarios, radarItems } from '../lib/editorial.ts';
import { loadAndValidateContent } from '../scripts/validate-content.mjs';

const { terms } = loadAndValidateContent();

test('all three publication states have distinct reader labels', () => {
  assert.equal(statusLabels.outdated, '已过期');
  assert.equal(statusLabels.researching, '研究中');
  assert.equal(statusLabels.verified, '已核验');
});

test('search combines query and category, supports aliases and scenario questions', () => {
  assert.ok(
    filterTerms(terms, 'Retrieval-Augmented Generation').some(
      (t) => t.slug === 'rag',
    ),
  );
  assert.ok(
    filterTerms(terms, '公司文档回答不准').some((t) => t.slug === 'rag'),
  );
  assert.equal(filterTerms(terms, 'rag', '基础模型').length, 0);
  assert.equal(filterTerms(terms, '不存在的术语xyz').length, 0);
  assert.equal(filterTerms(terms, '   ').length, terms.length);
});

test('paths preserve order and safely reject unrelated or unknown context', () => {
  const path = paths[0];
  const first = getPathStep(path.id, path.terms[0][1]);
  assert.equal(first.previous, undefined);
  assert.equal(first.next[1], path.terms[1][1]);
  const last = getPathStep(path.id, path.terms.at(-1)[1]);
  assert.equal(last.next, undefined);
  assert.equal(getPathStep('unknown', 'llm'), undefined);
  assert.equal(getPathStep(path.id, 'not-in-path'), undefined);
});

test('editorial entries have unique destinations and only reference existing terms', () => {
  const slugs = new Set(terms.map((t) => t.slug));
  for (const collection of [paths, comparisons, scenarios, radarItems]) {
    assert.equal(
      new Set(collection.map((item) => item.id)).size,
      collection.length,
    );
  }
  for (const path of paths) {
    assert.ok(path.outcome && path.exercise);
    for (const [, slug] of path.terms) assert.ok(slugs.has(slug), slug);
  }
  for (const pair of comparisons) {
    assert.ok(slugs.has(pair.leftSlug) && slugs.has(pair.rightSlug));
    assert.ok(
      pair.relationship && pair.constraint && pair.validation && pair.caveat,
    );
  }
  for (const scenario of scenarios) {
    for (const slug of scenario.terms) assert.ok(slugs.has(slug), slug);
  }
  for (const item of radarItems) assert.ok(slugs.has(item.slug));
});

test('shared content contract rejects incomplete guidance and impossible dates', () => {
  const term = terms[0];
  assert.equal(termMetaSchema.safeParse(term).success, true);
  for (const invalid of [
    { pitfalls: ['only one'] },
    { sources: [] },
    { level: 'unknown' },
    { last_verified: '2026-02-30' },
    { summary: 'too short' },
    { sources: [{ name: 'invalid', url: 'http://example.com' }] },
  ])
    assert.equal(
      termMetaSchema.safeParse({ ...term, ...invalid }).success,
      false,
    );
});
