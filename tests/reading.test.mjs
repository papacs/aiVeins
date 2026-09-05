import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { getReadingSections, validateReading } from '../lib/reading.ts';
import { loadAndValidateContent } from '../scripts/validate-content.mjs';

test('reading navigation ignores code headings and gives repeated headings unique anchors', () => {
  assert.deepEqual(
    getReadingSections('## 开始\n```text\n## 不是标题\n```\n## 开始'),
    [
      { id: 'reading-1', title: '开始', line: 1 },
      { id: 'reading-2', title: '开始', line: 5 },
    ],
  );
});

test('deep reading rejects broken evidence links, incomplete metadata and missing self-checks', () => {
  const { terms } = loadAndValidateContent();
  const original = terms.find((term) => term.slug === 'structured-output');
  assert.deepEqual(validateReading(original), []);
  const invalid = structuredClone(original);
  invalid.body += '\n错误引用 [4](#source-missing)';
  invalid.sources[0].publisher = undefined;
  invalid.sources[0].accessed = '2099-01-01';
  invalid.exercise = undefined;
  const errors = validateReading(invalid).join('\n');
  assert.match(errors, /不存在的来源/);
  assert.match(errors, /完整的来源说明/);
  assert.match(errors, /不得晚于/);
  assert.match(errors, /需要自测/);
  const duplicate = structuredClone(original);
  duplicate.sources[1].id = duplicate.sources[0].id;
  assert.match(validateReading(duplicate).join('\n'), /不得重复/);
  assert.match(
    validateReading({ ...original, body: '## 无引用正文' }).join('\n'),
    /尚未在正文中引用/,
  );
});

test('authored glossary links resolve to existing terms', () => {
  const { terms } = loadAndValidateContent();
  const slugs = new Set(terms.map((term) => term.slug));
  for (const term of terms) {
    for (const match of term.body.matchAll(/\]\(\/glossary\/([a-z0-9-]+)\)/g)) {
      assert.ok(slugs.has(match[1]), `${term.slug}: missing ${match[1]}`);
    }
  }
});

test('the published structured-output example runs and distinguishes type checks from truth', () => {
  const { terms } = loadAndValidateContent();
  const term = terms.find((item) => item.slug === 'structured-output');
  const code = term.body.match(/```js\n([\s\S]*?)\n```/)?.[1];
  assert.ok(code, 'the article must contain its runnable example');
  const output = execFileSync(
    process.execPath,
    ['--input-type=module', '--eval', code],
    { encoding: 'utf8' },
  );
  assert.deepEqual(output.trim().split(/\r?\n/), [
    '样例 1: true',
    '样例 2: false',
    '样例 3: true',
  ]);
});
