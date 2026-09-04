import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Braces,
  GitCompareArrows,
  Sparkles,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-header';

const starters = [
  {
    eyebrow: '完全不懂 AI',
    title: '从 LLM 到 Agent',
    detail: '6 个概念 · 约 45 分钟',
    icon: BookOpen,
    accent: 'blue',
  },
  {
    eyebrow: '正在做应用',
    title: '把模型接进产品',
    detail: '结构化输出、工具调用与评测',
    icon: Braces,
    accent: 'mint',
  },
  {
    eyebrow: '总被术语绕晕',
    title: '先看高频概念对比',
    detail: '6 组最容易选错的技术',
    icon: GitCompareArrows,
    accent: 'orange',
  },
];

const comparisons = [
  ['Agent', 'Workflow', '自主决策，还是预先编排？'],
  ['RAG', '长上下文', '检索资料，还是一次全部装入？'],
  ['MCP', '工具调用', '开放协议，还是模型能力？'],
];

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
            />
            <kbd>⌘ K</kbd>
          </div>
          <div className="quick-links" aria-label="热门搜索">
            <span>大家正在看</span>
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
          {starters.map(({ eyebrow, title, detail, icon: Icon, accent }) => (
            <Link
              href="/paths"
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
            {comparisons.map(([left, right, note]) => (
              <Link href="/compare" key={left} className="comparison-row">
                <span className="concept-pair">
                  <b>{left}</b>
                  <em>vs</em>
                  <b>{right}</b>
                </span>
                <span className="comparison-note">{note}</span>
                <ArrowRight size={17} />
              </Link>
            ))}
          </div>
        </div>

        <aside className="radar-card" aria-labelledby="radar-title">
          <p className="section-kicker">本期 AI 雷达 · 2026.09</p>
          <h2 id="radar-title">Agent Harness</h2>
          <p>它不是又一个 Agent 框架，而是让模型可靠工作的整套运行环境。</p>
          <div className="radar-meta">
            <span className="status-dot" />
            <span>
              <b>快速演变</b> · 建议理解到工作原理
            </span>
          </div>
          <Link href="/radar">
            读 5 分钟解读 <ArrowRight size={16} />
          </Link>
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}
