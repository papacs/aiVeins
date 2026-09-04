'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CircleCheck, Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

declare global {
  interface Document {
    modelContext?: {
      registerTool: (
        tool: {
          name: string;
          title: string;
          description: string;
          inputSchema: Record<string, unknown>;
          annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
          execute: (input: unknown) => unknown;
        },
        options?: { signal?: AbortSignal },
      ) => void | Promise<void>;
    };
  }
}

type SearchTerm = {
  title: string;
  slug: string;
  aliases: string[];
  category: string;
  level: string;
  trend: string;
  summary: string;
  last_verified: string;
};

export function GlossaryExplorer({
  terms,
  initialQuery = '',
}: {
  terms: SearchTerm[];
  initialQuery?: string;
}) {
  const categories = useMemo(
    () => ['全部', ...new Set(terms.map((term) => term.category))],
    [terms],
  );
  const [category, setCategory] = useState('全部');
  const [search, setSearch] = useState(initialQuery);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    void Promise.resolve(
      context.registerTool(
        {
          name: 'search_ai_terms',
          title: '搜索 AI 术语',
          description:
            '在 AI 脉络中按中英文名称、别名、分类或解释搜索词条，并同步更新页面上的搜索结果。',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', minLength: 1, maxLength: 80 },
            },
            required: ['query'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          execute(input) {
            const query =
              typeof input === 'object' && input !== null && 'query' in input
                ? String((input as { query: unknown }).query).trim()
                : '';
            if (!query || query.length > 80)
              throw new Error('query 必须是 1–80 个字符的字符串');
            setCategory('全部');
            setSearch(query);
            const normalized = query.toLocaleLowerCase('zh-CN');
            const matches = terms.filter((term) =>
              `${term.title} ${term.aliases.join(' ')} ${term.category} ${term.summary}`
                .toLocaleLowerCase('zh-CN')
                .includes(normalized),
            );
            return {
              query,
              count: matches.length,
              results: matches
                .slice(0, 8)
                .map(({ title, slug, summary, category }) => ({
                  title,
                  slug,
                  summary,
                  category,
                  url: `/glossary/${slug}`,
                })),
            };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);

    return () => lifecycle.abort();
  }, [terms]);

  const visible =
    category === '全部'
      ? terms
      : terms.filter((term) => term.category === category);

  return (
    <div className="glossary-explorer">
      <div className="filter-row" aria-label="按分类筛选">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
          >
            {item}
          </button>
        ))}
      </div>
      <Command
        className="term-command"
        shouldFilter
        value={search}
        onValueChange={setSearch}
      >
        <div className="command-search-wrap">
          <Search size={20} aria-hidden="true" />
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="输入术语、别名或你遇到的问题"
            aria-label="搜索术语"
          />
          <span>{visible.length} 个词条</span>
        </div>
        <CommandList className="term-results">
          <CommandEmpty>
            <div className="empty-state">
              <b>还没有找到这个词</b>
              <span>可以换个中文或英文叫法，也欢迎提交词条建议。</span>
              <Link href="/contribute">建议新词条</Link>
            </div>
          </CommandEmpty>
          {visible.map((term) => (
            <CommandItem
              key={term.slug}
              value={`${term.title} ${term.aliases.join(' ')} ${term.category} ${term.summary}`}
              className="term-result-item"
              onSelect={() => {
                window.location.href = `/glossary/${term.slug}`;
              }}
            >
              <Link
                href={`/glossary/${term.slug}`}
                className="term-card-content"
              >
                <div className="term-title-line">
                  <h2>{term.title}</h2>
                  <span className={`trend-tag trend-${term.trend}`}>
                    {term.trend}
                  </span>
                </div>
                <p>{term.summary}</p>
                <div className="term-card-meta">
                  <span>{term.category}</span>
                  <span>{term.level}</span>
                  <span>
                    <CircleCheck size={13} /> 核验于 {term.last_verified}
                  </span>
                </div>
                <ArrowRight className="term-arrow" size={19} />
              </Link>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  );
}
