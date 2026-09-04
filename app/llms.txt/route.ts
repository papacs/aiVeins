import { terms } from '@/lib/content';

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const lines = [
    '# AI 脉络',
    '',
    '> 给中文 AI 学习者的工程决策与反黑话手册。',
    '',
    '## 导航',
    `- [术语库](${origin}/glossary)`,
    `- [概念对比](${origin}/compare)`,
    `- [学习路径](${origin}/paths)`,
    `- [AI 雷达](${origin}/radar)`,
    `- [JSON 数据](${origin}/glossary.json)`,
    '',
    '## 词条',
    ...terms.map(
      (term) =>
        `- [${term.title}](${origin}/glossary/${term.slug}): ${term.summary}`,
    ),
    '',
    '所有词条均标注状态、核验日期与来源；快速变化内容请以官方资料为准。',
  ];
  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
