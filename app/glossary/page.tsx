import type { Metadata } from 'next';
import { GlossaryExplorer } from '@/components/glossary-explorer';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { terms } from '@/lib/content';

export const metadata: Metadata = {
  title: '术语库',
  description: '搜索并理解 AI 工程中的核心概念、边界与选择依据。',
};

export default function GlossaryPage() {
  const searchable = terms.map(
    ({
      body: _body,
      sources: _sources,
      solves: _solves,
      boundaries: _boundaries,
      use_when: _use,
      avoid_when: _avoid,
      pitfalls: _pitfalls,
      related: _related,
      prerequisites: _prerequisites,
      analogy: _analogy,
      ...term
    }) => term,
  );
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="page-intro">
        <p className="section-kicker">术语库 · {terms.length} 个已收录概念</p>
        <h1>先找到，再真正弄懂。</h1>
        <p>
          每个词条都标明边界、适用条件、常见失败方式和可信来源，不用在十篇文章之间拼答案。
        </p>
      </section>
      <GlossaryExplorer terms={searchable} />
      <SiteFooter />
    </main>
  );
}
