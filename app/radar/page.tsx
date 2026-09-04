import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Radio, TrendingUp } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'AI 雷达',
  description: '不追逐每日新闻，只解释近期值得理解的 AI 工程概念变化。',
};

const radarItems = [
  {
    status: '快速演变',
    title: 'Agent Harness',
    slug: 'context-engineering',
    summary:
      '从“选哪个 Agent 框架”转向“怎样组织上下文、工具、权限、循环和执行环境”。',
    learn:
      '先理解它是一组系统能力，而不是某个单独库。重点看上下文管理、权限边界与可观测性。',
    signal: '高',
  },
  {
    status: '当前热门',
    title: 'Context Engineering',
    slug: 'context-engineering',
    summary:
      '关注点从写一段好 Prompt，扩展到让模型在每一步看到恰好需要的信息。',
    learn:
      '理解 Prompt 只是上下文的一部分，并学会在资料、工具、历史和成本之间取舍。',
    signal: '高',
  },
  {
    status: '快速演变',
    title: 'MCP',
    slug: 'mcp',
    summary: '协议生态快速扩张，同时规范、授权方式与能力模型仍在变化。',
    learn:
      '先掌握 Host / Client / Server 与资源、提示、工具三类原语；实现时固定协议版本。',
    signal: '高',
  },
  {
    status: '存在争议',
    title: 'Agent Memory',
    slug: 'memory',
    summary:
      '“记忆”常被混用于聊天历史、用户偏好、任务状态、经验总结和外部知识。',
    learn:
      '不要先选数据库。先明确要记什么、为什么记、保存多久、谁能查看和纠正。',
    signal: '中',
  },
];

export default function RadarPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="page-intro radar-intro">
        <div>
          <p className="section-kicker">AI 雷达 · 2026 年 9 月</p>
          <h1>跟上变化，不被热词推着跑。</h1>
          <p>
            每期只回答三件事：什么在升温、它和已有概念有什么关系、现在需要学到什么程度。
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
          <article key={item.title} className="radar-item">
            <div className="radar-rank">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <small>信号 {item.signal}</small>
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
                进入相关词条 <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <section className="radar-principle">
        <b>雷达不是新闻榜</b>
        <p>
          热度来自发布频率、工程采用与术语变化的综合观察，不代表技术优劣。标记为“快速演变”的内容应查看核验日期和官方版本。
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
