import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, X } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: '概念对比',
  description: '用真实选择条件分清最容易混淆的 AI 工程概念。',
};

const comparisons = [
  {
    left: 'Agent',
    leftSlug: 'agent',
    right: 'Workflow',
    rightSlug: 'workflow',
    question: '任务路径是否能预先写清？',
    verdict:
      '能写清就先用 Workflow；只有中间结果持续改变下一步时，再把控制权交给 Agent。',
    leftGood: '开放目标、动态环境、需要自主选择工具',
    rightGood: '固定步骤、稳定分支、强调可预测性',
  },
  {
    left: 'RAG',
    leftSlug: 'rag',
    right: '长上下文',
    rightSlug: 'long-context',
    question: '资料应该先筛选，还是一次全读？',
    verdict:
      '资料持续增长或需要引用时优先 RAG；材料有限且整体关系重要时可直接用长上下文，也可以组合。',
    leftGood: '大规模、常更新、需追溯的资料库',
    rightGood: '单份长文档、代码库、整体综合任务',
  },
  {
    left: 'RAG',
    leftSlug: 'rag',
    right: 'Fine-tuning',
    rightSlug: 'fine-tuning',
    question: '需要新知识，还是稳定行为？',
    verdict:
      '更新事实用 RAG；改变风格、格式或专项能力才考虑微调。没有评测集时不要急着微调。',
    leftGood: '外部事实、私有资料、最新内容',
    rightGood: '行为模式、输出风格、专项能力',
  },
  {
    left: 'MCP',
    leftSlug: 'mcp',
    right: 'Tool Calling',
    rightSlug: 'tool-calling',
    question: '是连接协议，还是模型发起动作？',
    verdict:
      'Tool Calling 是模型提出结构化调用；MCP 规范了应用如何发现并连接可复用的工具、资源与提示。',
    leftGood: '跨客户端复用、标准化连接',
    rightGood: '单个应用内让模型选择函数',
  },
  {
    left: 'Prompt Engineering',
    leftSlug: 'prompt-engineering',
    right: 'Context Engineering',
    rightSlug: 'context-engineering',
    question: '是在写指令，还是组织整个信息环境？',
    verdict:
      'Prompt Engineering 改善任务表达；Context Engineering 还管理资料、工具、历史、记忆与中间状态。',
    leftGood: '单次任务、指令与示例优化',
    rightGood: '多步系统、动态资料与状态管理',
  },
  {
    left: 'Memory',
    leftSlug: 'memory',
    right: 'Knowledge Base',
    rightSlug: 'knowledge-base',
    question: '保存的是经历，还是可维护事实？',
    verdict:
      'Memory 面向某个用户或 Agent 的历史与状态；知识库面向可治理、可共享、可更新的事实来源。',
    leftGood: '偏好、任务进展、经验摘要',
    rightGood: '文档、政策、产品资料、组织知识',
  },
];

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
          <article className="compare-card" key={item.left + item.right}>
            <div className="compare-number">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="compare-content">
              <p>{item.question}</p>
              <h2>
                <Link href={`/glossary/${item.leftSlug}`}>{item.left}</Link>
                <em>vs</em>
                <Link href={`/glossary/${item.rightSlug}`}>{item.right}</Link>
              </h2>
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
                <X size={17} />
                <span>{item.verdict}</span>
              </div>
            </div>
            <ArrowRight className="compare-arrow" size={19} />
          </article>
        ))}
      </div>
      <SiteFooter />
    </main>
  );
}
