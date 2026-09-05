/// <reference types="vite/client" />

import { parse as parseYaml } from 'yaml';
import { termMetaSchema } from './term-schema';
import { validateReading } from './reading';
import type { TermMeta } from './term-schema';
export type { TermMeta } from './term-schema';

export type Term = TermMeta & { body: string };

const termFiles = import.meta.glob('../content/terms/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function parseMarkdownFile(raw: string) {
  const normalized = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n'))
    throw new Error('词条必须以 YAML frontmatter 开头');
  const end = normalized.indexOf('\n---\n', 4);
  if (end === -1) throw new Error('词条缺少 YAML frontmatter 结束标记');
  return {
    data: parseYaml(normalized.slice(4, end)),
    content: normalized.slice(end + 5),
  };
}

function parseTerms(): Term[] {
  const terms = Object.entries(termFiles).map(([file, raw]) => {
    const parsed = parseMarkdownFile(raw);
    const result = termMetaSchema.safeParse(parsed.data);

    if (!result.success) {
      throw new Error(`词条格式不正确：${file}\n${result.error.message}`);
    }

    const term = { ...result.data, body: parsed.content.trim() };
    const errors = validateReading(term);
    if (errors.length)
      throw new Error(`词条引用不正确：${file}\n${errors.join('\n')}`);
    return term;
  });

  const slugs = new Set<string>();
  for (const term of terms) {
    if (slugs.has(term.slug)) throw new Error(`重复的词条 slug：${term.slug}`);
    slugs.add(term.slug);
  }
  for (const term of terms) {
    for (const related of [...term.related, ...term.prerequisites]) {
      if (!slugs.has(related))
        throw new Error(`${term.slug} 引用了不存在的词条：${related}`);
    }
  }

  return terms.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
}

export const terms = parseTerms();

export function getTerm(slug: string) {
  return terms.find((term) => term.slug === slug);
}

export const categoryOrder: TermMeta['category'][] = [
  '基础模型',
  '应用架构',
  'Agent 工程',
  '检索',
  '评测与安全',
];
