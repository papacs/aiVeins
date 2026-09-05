import type { Metadata } from 'next';
import { SiteLink as Link } from '@/components/site-link';
import {
  ArrowRight,
  BookOpen,
  Braces,
  GitCompareArrows,
  Sparkles,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-header';
import { paths, comparisons, scenarios, radarItems } from '@/lib/editorial';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    siteName: 'AI 脉络',
    title: 'AI 脉络｜中文 AI 工程决策手册',
    description:
      '看懂 AI 工程概念的来龙去脉：它解决什么、何时该用，以及容易和什么混淆。',
  },
};

const starters = [
  {
    eyebrow: '完全不懂 AI',
    title: paths[0].title,
    href: '/paths#' + paths[0].id,
    detail: paths[0].terms.length + ' 个概念 · ' + paths[0].time,
    icon: BookOpen,
    accent: 'blue',
  },
  {
    eyebrow: '正在做应用',
    title: paths[2].title,
    href: '/paths#' + paths[2].id,
    detail: '工具调用、权限控制与评测',
    icon: Braces,
    accent: 'mint',
  },
  {
    eyebrow: '总被术语绕晕',
    title: '先看高频概念对比',
    href: '/compare',
    detail: comparisons.length + ' 组概念的关系与选择条件',
    icon: GitCompareArrows,
    accent: 'orange',
  },
];

const featuredComparisons = comparisons.filter((item) =>
  ['agent-workflow', 'rag-long-context', 'mcp-tool-calling'].includes(item.id),
);
const featuredRadar = radarItems[0];

export default function Home() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <section className="intro-grid" aria-labelledby="page-title">
        <div className="intro-copy">
          <p className="overline">
            <Sparkles size={14} /> 给中文 AI 学习者的决策手册
          </p>
          <h1 id="page-title">
            看懂概念之间的
            <br />
            来龙去脉。
          </h1>
          <p className="lede">
            不背黑话。弄清它解决什么、何时该用，以及为什么容易和另一个概念混淆。
          </p>
        </div>

        <form className="search-panel" action="/glossary">
          <label htmlFor="q">今天想弄懂什么？</label>
          <div className="search-box">
            <span className="search-glyph" aria-hidden="true">
              ⌕
            </span>
            <input
              id="q"
              name="q"
              placeholder="搜索 RAG、Agent、MCP……"
              autoComplete="off"
              maxLength={80}
              type="search"
            />
            <button type="submit" className="search-submit">
              搜索
            </button>
          </div>
          <div className="quick-links" aria-label="推荐词条">
            <span>推荐先看</span>
            <Link href="/glossary/agent">Agent</Link>
            <Link href="/glossary/rag">RAG</Link>
            <Link href="/glossary/context-engineering">上下文工程</Link>
          </div>
        </form>
      </section>

      <section className="section-block" aria-labelledby="start-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">从你的问题出发</p>
            <h2 id="start-title">不用先知道该学什么</h2>
          </div>
          <Link href="/paths" className="text-link">
            查看全部路径 <ArrowRight size={16} />
          </Link>
        </div>
        <div className="starter-grid">
          {starters.map(
            ({ eyebrow, title, detail, href, icon: Icon, accent }) => (
              <Link
                href={href}
                className={`starter-card ${accent}`}
                key={title}
              >
                <span className="card-icon">
                  <Icon size={21} />
                </span>
                <p>{eyebrow}</p>
                <h3>{title}</h3>
                <span>{detail}</span>
                <ArrowRight className="card-arrow" size={19} />
              </Link>
            ),
          )}
        </div>
      </section>

      <section
        className="section-block scenario-section"
        aria-labelledby="scenario-title"
      >
        <div className="section-heading">
          <div>
            <p className="section-kicker">带着问题来</p>
            <h2 id="scenario-title">先定位问题，再选择技术</h2>
          </div>
        </div>
        <div className="scenario-grid">
          {scenarios.map((item) => (
            <Link
              className="scenario-card"
              key={item.id}
              href={`/glossary?q=${encodeURIComponent(item.question)}`}
            >
              <h3>{item.question}</h3>
              <p>{item.hint}</p>
              <span>查看相关概念与判断方法 →</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="split-section">
        <div className="comparison-board">
          <div className="section-heading compact">
            <div>
              <p className="section-kicker">容易混淆</p>
              <h2>真正影响选择的区别</h2>
            </div>
          </div>
          <div className="comparison-list">
            {featuredComparisons.map(({ id, left, right, question }) => (
              <Link href={`/compare#${id}`} key={id} className="comparison-row">
                <span className="concept-pair">
                  <b>{left}</b>
                  <em>与</em>
                  <b>{right}</b>
                </span>
                <span className="comparison-note">{question}</span>
                <ArrowRight size={17} />
              </Link>
            ))}
          </div>
        </div>

        <aside className="radar-card" aria-labelledby="radar-title">
          <p className="section-kicker">本期 AI 雷达 · 2026.09</p>
          <h2 id="radar-title">{featuredRadar.title}</h2>
          <p>{featuredRadar.summary}</p>
          <div className="radar-meta">
            <span className="status-dot" />
            <span>
              <b>{featuredRadar.status}</b> · 编辑观察
            </span>
          </div>
          <Link href={`/radar#${featuredRadar.id}`}>
            查看观察与延伸阅读 <ArrowRight size={16} />
          </Link>
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}
