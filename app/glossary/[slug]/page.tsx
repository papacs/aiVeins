import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PathNavigation } from '@/components/path-navigation';
import { statusLabels, statusNotes } from '@/lib/experience';
import { SiteLink as Link } from '@/components/site-link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  ExternalLink,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { TermMarkdown } from '@/components/term-markdown';
import { getTerm, terms } from '@/lib/content';

export function generateStaticParams() {
  return terms.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) return {};
  return {
    title: term.title,
    description: term.summary,
    alternates: { canonical: '/glossary/' + slug },
  };
}

function ListCard({
  title,
  items,
  tone = 'plain',
}: {
  title: string;
  items: string[];
  tone?: 'plain' | 'good' | 'warn';
}) {
  return (
    <section className={`decision-card ${tone}`}>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function TermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) notFound();
  const related = term.related.map(getTerm).filter(Boolean);
  const prerequisites = term.prerequisites.map(getTerm).filter(Boolean);

  return (
    <main className="site-shell">
      <SiteHeader />
      <article className="term-layout">
        <aside className="term-sidebar">
          <Link href="/glossary" className="back-link">
            <ArrowLeft size={15} /> 返回术语库
          </Link>
          <details className="term-toc" open>
            <summary>本页目录</summary>
            <nav aria-label="本页目录">
              <a href="#quick">30 秒看懂</a>
              <a href="#decision">怎么选择</a>
              <a href="#detail">深入理解</a>
              <a href="#sources">来源</a>
            </nav>
          </details>
        </aside>
        <div className="term-main">
          <Suspense fallback={null}>
            <PathNavigation slug={slug} />
          </Suspense>
          <header className="term-hero">
            <div className="term-labels">
              <span>{term.category}</span>
              <span>{term.level}</span>
              <span className={`trend-tag trend-${term.trend}`}>
                {term.trend}
              </span>
            </div>
            <h1>{term.title}</h1>
            <p className="term-aliases">{term.aliases.join(' · ')}</p>
            <p className="term-summary">{term.summary}</p>
            <div className="verified-line">
              <CalendarCheck size={16} /> 最后核验 {term.last_verified} ·{' '}
              <span className={`content-status status-${term.status}`}>
                {statusLabels[term.status]}
              </span>
            </div>
          </header>
          {term.status !== 'verified' && (
            <p className={`status-notice status-${term.status}`}>
              {statusNotes[term.status]}
            </p>
          )}

          <section id="quick" className="analogy-box">
            <Lightbulb size={22} />
            <div>
              <p>用一个类比理解</p>
              <strong>{term.analogy}</strong>
            </div>
          </section>

          {prerequisites.length > 0 && (
            <div className="prerequisite-line">
              <BookOpenCheck size={17} />
              <span>建议先看：</span>
              {prerequisites.map(
                (item) =>
                  item && (
                    <Link key={item.slug} href={`/glossary/${item.slug}`}>
                      {item.title}
                    </Link>
                  ),
              )}
            </div>
          )}

          <section id="decision" className="decision-section">
            <div className="decision-grid">
              <ListCard title="它解决什么" items={term.solves} tone="good" />
              <ListCard title="它不是什么" items={term.boundaries} />
            </div>
            <div className="decision-grid">
              <ListCard title="适合使用" items={term.use_when} tone="good" />
              <ListCard title="暂时别用" items={term.avoid_when} tone="warn" />
            </div>
            <div className="failure-card">
              <ShieldAlert size={22} />
              <div>
                <h2>常见失败方式</h2>
                <ul>
                  {term.pitfalls.map((pitfall) => (
                    <li key={pitfall}>{pitfall}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="detail">
            <TermMarkdown>{term.body}</TermMarkdown>
          </section>

          <section className="related-section">
            <p className="section-kicker">继续建立关联</p>
            <h2>相关概念</h2>
            <div>
              {related.map(
                (item) =>
                  item && (
                    <Link key={item.slug} href={`/glossary/${item.slug}`}>
                      <span>{item.title}</span>
                      <small>{item.summary}</small>
                      <ArrowRight size={16} />
                    </Link>
                  ),
              )}
            </div>
          </section>

          <Suspense fallback={null}>
            <PathNavigation slug={slug} />
          </Suspense>
          <section id="sources" className="source-section">
            <p className="section-kicker">可信来源</p>
            <h2>进一步阅读</h2>
            {term.sources.map((source) => (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                key={source.url}
              >
                <span>{source.name}</span>
                <ExternalLink size={15} />
              </a>
            ))}
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
