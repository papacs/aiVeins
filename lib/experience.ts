import { paths, scenarios } from './editorial.ts';

export const statusLabels = {
  verified: '已核验',
  researching: '研究中',
  outdated: '已过期',
} as const;

export const statusNotes = {
  verified: '关键事实、边界与来源已核验。',
  researching: '定义或依据仍在整理，请结合来源判断，不宜当作确定结论引用。',
  outdated: '内容已确认过期，等待修订。请先查阅官方来源再做决策。',
};

type Searchable = {
  title: string;
  slug: string;
  aliases: string[];
  category: string;
  summary: string;
};

export function matchingScenarios(query: string) {
  const normalized = query.trim().toLocaleLowerCase('zh-CN');
  if (!normalized) return [];
  return scenarios.filter(
    (item) =>
      item.question.toLocaleLowerCase('zh-CN').includes(normalized) ||
      item.keywords.some((word) => normalized.includes(word)),
  );
}

export function filterTerms<T extends Searchable>(
  terms: T[],
  query: string,
  category = '全部',
): T[] {
  const normalized = query.trim().toLocaleLowerCase('zh-CN');
  const suggested = new Set(
    matchingScenarios(query).flatMap((item) => item.terms),
  );
  return terms.filter(
    (term) =>
      (category === '全部' || term.category === category) &&
      (!normalized ||
        suggested.has(term.slug) ||
        `${term.title} ${term.aliases.join(' ')} ${term.category} ${term.summary}`
          .toLocaleLowerCase('zh-CN')
          .includes(normalized)),
  );
}

export function pathTermHref(pathId: string, slug: string) {
  return `/glossary/${slug}?path=${encodeURIComponent(pathId)}`;
}

export function getPathStep(pathId: string, slug: string) {
  const path = paths.find((item) => item.id === pathId);
  const index = path?.terms.findIndex((item) => item[1] === slug) ?? -1;
  if (!path || index < 0) return undefined;
  return {
    path,
    index,
    previous: path.terms[index - 1],
    next: path.terms[index + 1],
  };
}
