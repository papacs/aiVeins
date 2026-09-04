/// <reference types="vite/client" />

import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const sourceSchema = z.object({
  name: z.string().min(1),
  url: z.url(),
});

const termMetaSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  aliases: z.array(z.string()).default([]),
  category: z.enum([
    '基础模型',
    '应用架构',
    'Agent 工程',
    '检索',
    '评测与安全',
  ]),
  level: z.enum(['入门', '进阶']),
  status: z.enum(['verified', 'researching', 'outdated']),
  trend: z.enum(['基础概念', '当前热门', '快速演变', '存在争议']),
  last_verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  summary: z.string().min(12),
  analogy: z.string().min(12),
  solves: z.array(z.string()).min(1),
  boundaries: z.array(z.string()).min(1),
  use_when: z.array(z.string()).min(1),
  avoid_when: z.array(z.string()).min(1),
  pitfalls: z.array(z.string()).min(1),
  related: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  sources: z.array(sourceSchema).min(1),
});

export type TermMeta = z.infer<typeof termMetaSchema>;
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

    return { ...result.data, body: parsed.content.trim() };
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
