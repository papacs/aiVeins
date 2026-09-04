import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Braces, Database, Route } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: '学习路径',
  description: '按目标而不是按字母顺序，建立 AI 工程知识脉络。',
};

const paths = [
  {
    icon: BookOpen,
    audience: '零基础',
    title: '从模型到能做事的 Agent',
    time: '约 45 分钟',
    summary:
      '先建立模型、上下文与工具的基本直觉，再理解 Agent 为什么需要工作流、评测和护栏。',
    terms: [
      ['LLM', 'llm'],
      ['提示工程', 'prompt-engineering'],
      ['上下文工程', 'context-engineering'],
      ['工具调用', 'tool-calling'],
      ['Agent', 'agent'],
      ['评测', 'evaluation'],
    ],
  },
  {
    icon: Database,
    audience: '知识库实践者',
    title: '做一个靠谱的 RAG 系统',
    time: '约 35 分钟',
    summary:
      '从内容如何表示开始，分清检索、知识库、长上下文和微调各自负责什么。',
    terms: [
      ['Embedding', 'embedding'],
      ['向量检索', 'vector-search'],
      ['知识库', 'knowledge-base'],
      ['RAG', 'rag'],
      ['长上下文', 'long-context'],
      ['微调', 'fine-tuning'],
    ],
  },
  {
    icon: Braces,
    audience: '应用开发者',
    title: '把模型安全接进产品',
    time: '约 40 分钟',
    summary: '从固定工作流起步，再逐步加入工具、开放协议、自主决策和安全控制。',
    terms: [
      ['Workflow', 'workflow'],
      ['Tool Calling', 'tool-calling'],
      ['MCP', 'mcp'],
      ['Agent', 'agent'],
      ['Guardrail', 'guardrail'],
      ['Evaluation', 'evaluation'],
    ],
  },
];

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
            { icon: Icon, audience, title, time, summary, terms },
            pathIndex,
          ) => (
            <article className="path-card" key={title}>
              <div className="path-intro">
                <span className="path-icon">
                  <Icon size={22} />
                </span>
                <p>
                  {audience} · {time}
                </p>
                <h2>{title}</h2>
                <span>{summary}</span>
              </div>
              <ol className="path-steps">
                {terms.map(([name, slug], index) => (
                  <li key={slug}>
                    <span>
                      {pathIndex + 1}.{index + 1}
                    </span>
                    <Link href={`/glossary/${slug}`}>
                      {name}
                      <ArrowRight size={15} />
                    </Link>
                  </li>
                ))}
              </ol>
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
