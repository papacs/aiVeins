'use client';

import { SiteLink as Link } from '@/components/site-link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { filterTerms, matchingScenarios, statusLabels } from '@/lib/experience';

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
  status: keyof typeof statusLabels;
};

export function GlossaryExplorer({ terms }: { terms: SearchTerm[] }) {
  const categories = useMemo(
    () => ['全部', ...new Set(terms.map((term) => term.category))],
    [terms],
  );
  const [category, setCategory] = useState('全部');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(window.location.search);
      setSearch((params.get('q') ?? '').slice(0, 80));
      const value = params.get('category') ?? '全部';
      setCategory(categories.includes(value) ? value : '全部');
    };
    restore();
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, [categories]);

  function update(query: string, nextCategory: string) {
    setSearch(query);
    setCategory(nextCategory);
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    if (nextCategory !== '全部') url.searchParams.set('category', nextCategory);
    else url.searchParams.delete('category');
    window.history.replaceState(window.history.state, '', url);
  }

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
            '按名称、别名、解释或已整理的场景问题搜索，并同步页面结果。',
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
              typeof input === 'object' &&
              input !== null &&
              'query' in input &&
              typeof input.query === 'string'
                ? input.query.trim()
                : '';
            if (!query || query.length > 80)
              throw new Error('query 必须是 1–80 个字符的字符串');
            update(query, '全部');
            const matches = filterTerms(terms, query);
            return {
              query,
              count: matches.length,
              results: matches
                .slice(0, 8)
                .map(
                  ({
                    title,
                    slug,
                    summary,
                    category,
                    status,
                    last_verified,
                  }) => ({
                    title,
                    slug,
                    summary,
                    category,
                    status,
                    last_verified,
                    url: `/glossary/${slug}`,
                  }),
                ),
            };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    return () => lifecycle.abort();
  }, [terms]);

  const visible = filterTerms(terms, search, category);
  const suggestions = matchingScenarios(search);
  return (
    <div className="glossary-explorer">
      <div className="filter-row" aria-label="按分类筛选">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => update(search, item)}
            aria-pressed={category === item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="command-search-wrap">
        <Search size={20} aria-hidden="true" />
        <input
          className="glossary-input"
          type="search"
          value={search}
          maxLength={80}
          onChange={(event) => update(event.target.value, category)}
          placeholder="搜索术语、别名或场景问题"
          aria-label="搜索术语"
        />
        <button
          type="button"
          className="text-link"
          onClick={() => update('', '全部')}
        >
          重置
        </button>
      </div>
      <output className="search-count" aria-live="polite">
        匹配 {visible.length} 条 · 共收录 {terms.length} 个概念
      </output>
      {suggestions.length > 0 && (
        <div className="scenario-suggestions" aria-label="相关场景建议">
          {suggestions.map((item) => (
            <Link key={item.id} href={`/compare#${item.comparison}`}>
              <b>{item.question}</b>
              <span>{item.hint} 查看选择条件 →</span>
            </Link>
          ))}
        </div>
      )}
      {visible.length === 0 ? (
        <div className="empty-state">
          <b>没有匹配的词条</b>
          <span>可以换个中英文名称，或重置分类后再找。</span>
          <button type="button" onClick={() => update('', '全部')}>
            查看全部词条
          </button>
          <Link href="/contribute">建议新词条</Link>
        </div>
      ) : (
        <div className="term-results">
          {visible.map((term) => (
            <article key={term.slug} className="term-result-item">
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
                  <span className={`content-status status-${term.status}`}>
                    {statusLabels[term.status]}
                  </span>
                  <span>
                    {term.status === 'verified' ? '核验于' : '最近核验记录'}{' '}
                    {term.last_verified}
                  </span>
                </div>
                <ArrowRight
                  className="term-arrow"
                  size={19}
                  aria-hidden="true"
                />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
