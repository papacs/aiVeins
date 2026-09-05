import type { Metadata } from 'next';
import { SiteLink as Link } from '@/components/site-link';
import { ArrowRight, Radio, TrendingUp } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'AI 雷达',
  description: '不追逐每日新闻，只解释近期值得理解的 AI 工程概念变化。',
};

import { radarItems } from '@/lib/editorial';
import { getTerm } from '@/lib/content';

export default function RadarPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="page-intro radar-intro">
        <div>
          <p className="section-kicker">AI 雷达 · 2026 年 9 月</p>
          <h1>跟上变化，不被热词推着跑。</h1>
          <p>
            编辑观察：它和已有概念有什么关系、为什么值得理解、现在可以学到什么程度。
          </p>
        </div>
        <div className="radar-orbit" aria-hidden="true">
          <Radio size={28} />
          <i />
          <i />
          <i />
        </div>
      </section>
      <div className="radar-list">
        {radarItems.map((item, index) => (
          <article key={item.id} id={item.id} className="radar-item">
            <div className="radar-rank">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <small>编辑观察</small>
            </div>
            <div>
              <div className="term-title-line">
                <h2>{item.title}</h2>
                <span className={`trend-tag trend-${item.status}`}>
                  {item.status}
                </span>
              </div>
              <p>{item.summary}</p>
              <div className="learn-now">
                <TrendingUp size={17} />
                <span>
                  <b>现在学到什么程度：</b>
                  {item.learn}
                </span>
              </div>
              <Link href={`/glossary/${item.slug}`}>
                阅读 {getTerm(item.slug)?.title} 词条 <ArrowRight size={15} />
              </Link>
              <p className="editorial-note">
                以上为学习建议。相关词条核验日期：
                {getTerm(item.slug)?.last_verified}。
                {item.id === 'agent-harness' &&
                  'Agent Harness 专题仍在整理，这里提供上下文工程作为延伸阅读。'}
              </p>
              <Link href={`/glossary/${item.slug}#sources`}>
                查看相关来源与状态
              </Link>
            </div>
          </article>
        ))}
      </div>
      <section className="radar-principle">
        <b>雷达不是新闻榜</b>
        <p>
          这里是编辑整理的学习线索，不提供热度排名。趋势标签是编辑判断；相关词条的来源只支持其自身论述，不代表已核验整个观察主题。
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
