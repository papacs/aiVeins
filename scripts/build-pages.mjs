import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadAndValidateContent } from './validate-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(root, 'dist', 'client');
const siteOrigin = 'https://aiveins.heyluckyme.com';
const vinextCli = path.join(root, 'node_modules', 'vinext', 'dist', 'cli.js');

const build = spawnSync(process.execPath, [vinextCli, 'build'], {
  cwd: root,
  env: { ...process.env, AI_VEINS_STATIC_EXPORT: '1' },
  stdio: 'inherit',
});

if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);
if (!fs.existsSync(path.join(outputDirectory, 'index.html'))) {
  throw new Error('Pages 构建未生成 dist/client/index.html');
}

const { terms, errors } = loadAndValidateContent();
if (errors.length) {
  throw new Error(`内容校验失败：\n- ${errors.join('\n- ')}`);
}

const publicTerms = terms.map(({ file: _file, ...term }) => term);
const generatedAt = new Date().toISOString();

fs.writeFileSync(
  path.join(outputDirectory, 'glossary.json'),
  `${JSON.stringify(
    {
      name: 'AI 脉络',
      description: '中文 AI 工程决策与反黑话手册',
      generated_at: generatedAt,
      count: publicTerms.length,
      terms: publicTerms,
    },
    null,
    2,
  )}\n`,
);

const llms = [
  '# AI 脉络',
  '',
  '> 给中文 AI 学习者的工程决策与反黑话手册。',
  '',
  '## 导航',
  `- [术语库](${siteOrigin}/glossary)`,
  `- [概念对比](${siteOrigin}/compare)`,
  `- [学习路径](${siteOrigin}/paths)`,
  `- [AI 雷达](${siteOrigin}/radar)`,
  `- [JSON 数据](${siteOrigin}/glossary.json)`,
  '',
  '## 词条',
  ...publicTerms.map(
    (term) =>
      `- [${term.title}](${siteOrigin}/glossary/${term.slug}): ${term.summary}`,
  ),
  '',
  '所有词条均标注状态、核验日期与来源；快速变化内容请以官方资料为准。',
  '',
];
fs.writeFileSync(path.join(outputDirectory, 'llms.txt'), llms.join('\n'));

fs.writeFileSync(
  path.join(outputDirectory, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`,
);

const staticPages = [
  '',
  '/glossary',
  '/compare',
  '/paths',
  '/radar',
  '/contribute',
];
const sitemapEntries = [
  ...staticPages.map((url) => ({ url, lastModified: '2026-09-04' })),
  ...publicTerms.map((term) => ({
    url: `/glossary/${term.slug}`,
    lastModified: term.last_verified,
  })),
];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapEntries.map(
    ({ url, lastModified }) =>
      `  <url><loc>${siteOrigin}${url}</loc><lastmod>${lastModified}</lastmod></url>`,
  ),
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync(path.join(outputDirectory, 'sitemap.xml'), sitemap);

console.log(
  `✓ Cloudflare Pages 静态产物已生成：${publicTerms.length} 个词条，输出到 dist/client`,
);
