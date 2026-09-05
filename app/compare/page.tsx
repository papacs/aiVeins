import type { Metadata } from 'next';
import { SiteLink as Link } from '@/components/site-link';
import { Check, Lightbulb } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: '概念对比',
  description: '用真实选择条件分清最容易混淆的 AI 工程概念。',
};

import { comparisons } from '@/lib/editorial';
import { getTerm } from '@/lib/content';

export default function ComparePage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="page-intro">
        <p className="section-kicker">概念对比</p>
        <h1>别问谁更先进，先问谁更适合。</h1>
        <p>
          把争论还原成具体条件。每组对比都给出选择问题、适用场景和一句可执行的结论。
        </p>
      </section>
      <div className="compare-stack">
        {comparisons.map((item, index) => (
          <article className="compare-card" id={item.id} key={item.id}>
            <div className="compare-number">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="compare-content">
              <p>{item.question}</p>
              <h2>
                <Link href={`/glossary/${item.leftSlug}`}>{item.left}</Link>
                <em>与</em>
                <Link href={`/glossary/${item.rightSlug}`}>{item.right}</Link>
              </h2>
              <p className="relationship-label">{item.relationship}</p>
              <div className="compare-columns">
                <div>
                  <Check size={17} />
                  <span>
                    <b>{item.left}</b>
                    <small>{item.leftGood}</small>
                  </span>
                </div>
                <div>
                  <Check size={17} />
                  <span>
                    <b>{item.right}</b>
                    <small>{item.rightGood}</small>
                  </span>
                </div>
              </div>
              <div className="compare-verdict">
                <Lightbulb size={17} />
                <span>
                  <b>选择建议：</b>
                  {item.verdict}
                </span>
              </div>
              <dl className="decision-details">
                <dt>先确认约束</dt>
                <dd>{item.constraint}</dd>
                <dt>最小验证</dt>
                <dd>{item.validation}</dd>
                <dt>边界与反例</dt>
                <dd>{item.caveat}</dd>
              </dl>
              <div className="editorial-sources">
                <b>编辑建议 · 事实依据见词条</b>
                {[item.leftSlug, item.rightSlug].map((slug) => {
                  const term = getTerm(slug)!;
                  return (
                    <Link key={slug} href={`/glossary/${slug}#sources`}>
                      {term.title} · 来源与核验记录
                    </Link>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </div>
      <SiteFooter />
    </main>
  );
}
