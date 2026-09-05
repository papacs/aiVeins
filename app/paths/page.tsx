import type { Metadata } from 'next';
import { SiteLink as Link } from '@/components/site-link';
import { ArrowRight, BookOpen, Braces, Database, Route } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: '学习路径',
  description: '按目标而不是按字母顺序，建立 AI 工程知识脉络。',
};

import { paths } from '@/lib/editorial';
import { pathTermHref } from '@/lib/experience';
const pathIcons = [BookOpen, Database, Braces];

export default function PathsPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="page-intro">
        <p className="section-kicker">学习路径</p>
        <h1>按问题学习，不按字母背词。</h1>
        <p>
          每条路径只保留理解目标所需的概念。读完一个词条，就能自然知道下一步该看什么。
        </p>
      </section>
      <div className="path-stack">
        {paths.map(
          (
            { id, audience, title, time, summary, terms, outcome, exercise },
            pathIndex,
          ) => (
            <article className="path-card" key={id} id={id}>
              <div className="path-intro">
                <span className="path-icon">
                  {(() => {
                    const Icon = pathIcons[pathIndex];
                    return <Icon size={22} />;
                  })()}
                </span>
                <p>
                  {audience} · {time}
                </p>
                <h2>{title}</h2>
                <span>{summary}</span>
                <p className="path-outcome">学完能做什么：{outcome}</p>
                <Link
                  className="text-link"
                  href={pathTermHref(id, terms[0][1])}
                >
                  开始这条路径 <ArrowRight size={16} />
                </Link>
              </div>
              <ol className="path-steps">
                {terms.map(([name, slug], index) => (
                  <li key={slug}>
                    <span>
                      {pathIndex + 1}.{index + 1}
                    </span>
                    <Link href={pathTermHref(id, slug)}>
                      {name}
                      <ArrowRight size={15} />
                    </Link>
                  </li>
                ))}
              </ol>
              <div className="path-exercise">
                <b>动手检验</b>
                <p>{exercise}</p>
              </div>
            </article>
          ),
        )}
      </div>
      <div className="path-note">
        <Route size={22} />
        <div>
          <b>路径不是课程表</b>
          <span>
            遇到实际问题时随时跳转；理解、实践、再回来看，往往比一次读完更有效。
          </span>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
