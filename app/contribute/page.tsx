import type { Metadata } from 'next';
import {
  CheckCircle2,
  FileText,
  GitPullRequest,
  SearchCheck,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: '参与共建',
  description: '为 AI 脉络贡献可靠、清楚、对技术选择真正有帮助的中文词条。',
};

const steps = [
  [
    SearchCheck,
    '先确认问题',
    '新增词条前先说明：读者在哪个真实场景里会遇到它？最容易和什么混淆？',
  ],
  [
    FileText,
    '按模板写一词一文件',
    '补齐人话解释、边界、使用条件、失败方式、相关概念和至少一个可信来源。',
  ],
  [
    CheckCircle2,
    '在本地验证',
    '内容校验会检查必填字段、日期、重复 slug、失效引用和不存在的关联词条。',
  ],
  [
    GitPullRequest,
    '提交审阅',
    'PR 里说明新增或更正了什么，以及结论依据。研究中内容不要伪装成已核验。',
  ],
];

export default function ContributePage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="page-intro">
        <p className="section-kicker">参与共建</p>
        <h1>贡献的不是词条数量，而是清晰度。</h1>
        <p>
          项目把学习记录与正式词条分开：允许探索，但公开结论必须可核验、讲边界，并能帮助读者做选择。
        </p>
      </section>
      <div className="contribute-grid">
        <section>
          <h2>一次可靠贡献怎样完成</h2>
          <ol>
            {steps.map(([Icon, title, detail], index) => {
              const StepIcon = Icon as typeof SearchCheck;
              return (
                <li key={String(title)}>
                  <span className="step-number">{index + 1}</span>
                  <StepIcon size={21} />
                  <div>
                    <b>{String(title)}</b>
                    <p>{String(detail)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
        <aside>
          <p className="section-kicker">内容底线</p>
          <h2>每个结论都经得起追问</h2>
          <ul>
            <li>优先引用论文、规范与官方文档</li>
            <li>明确“它不解决什么”</li>
            <li>不把营销说法写成行业共识</li>
            <li>变化快的概念必须标核验日期</li>
            <li>不靠 AI 批量生成未经检查的词条</li>
          </ul>
          <div className="repo-hint">
            <b>本地仓库已包含</b>
            <span>
              CONTRIBUTING.md、词条模板、Issue / PR 模板、MIT 许可证与自动校验。
            </span>
          </div>
        </aside>
      </div>
      <SiteFooter />
    </main>
  );
}
