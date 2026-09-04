import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse as parseYaml } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const termDirectory = path.join(root, 'content', 'terms');
const requiredStrings = [
  'title',
  'slug',
  'category',
  'level',
  'status',
  'trend',
  'last_verified',
  'summary',
  'analogy',
];
const requiredArrays = [
  'aliases',
  'solves',
  'boundaries',
  'use_when',
  'avoid_when',
  'pitfalls',
  'related',
  'prerequisites',
  'sources',
];
const allowedCategories = new Set([
  '基础模型',
  '应用架构',
  'Agent 工程',
  '检索',
  '评测与安全',
]);
const allowedStatuses = new Set(['verified', 'researching', 'outdated']);
const allowedTrends = new Set(['基础概念', '当前热门', '快速演变', '存在争议']);

function parseMarkdownFile(raw) {
  const normalized = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n'))
    throw new Error('词条必须以 YAML frontmatter 开头');
  const end = normalized.indexOf('\n---\n', 4);
  if (end === -1) throw new Error('词条缺少 YAML frontmatter 结束标记');
  return {
    data: parseYaml(normalized.slice(4, end)),
    content: normalized.slice(end + 5),
  };
}

export function loadAndValidateContent() {
  const errors = [];
  const files = fs
    .readdirSync(termDirectory)
    .filter((file) => file.endsWith('.md'))
    .sort();
  const terms = files.map((file) => {
    const { data, content } = parseMarkdownFile(
      fs.readFileSync(path.join(termDirectory, file), 'utf8'),
    );
    for (const field of requiredStrings) {
      if (typeof data[field] !== 'string' || !data[field].trim())
        errors.push(`${file}: ${field} 必须是非空字符串`);
    }
    for (const field of requiredArrays) {
      if (!Array.isArray(data[field]))
        errors.push(`${file}: ${field} 必须是数组`);
    }
    if (!/^[a-z0-9-]+$/.test(data.slug ?? ''))
      errors.push(`${file}: slug 只能包含小写字母、数字和连字符`);
    if (data.slug && file !== `${data.slug}.md`)
      errors.push(`${file}: 文件名必须与 slug 一致`);
    if (!allowedCategories.has(data.category))
      errors.push(`${file}: category 不在允许范围内`);
    if (!allowedStatuses.has(data.status))
      errors.push(`${file}: status 不在允许范围内`);
    if (!allowedTrends.has(data.trend))
      errors.push(`${file}: trend 不在允许范围内`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.last_verified ?? ''))
      errors.push(`${file}: last_verified 必须为 YYYY-MM-DD`);
    if ((data.summary?.length ?? 0) < 24)
      errors.push(`${file}: summary 太短，至少 24 个字符`);
    if ((data.analogy?.length ?? 0) < 24)
      errors.push(`${file}: analogy 太短，至少 24 个字符`);
    if (!content.includes('## '))
      errors.push(`${file}: 正文至少需要一个二级标题`);
    for (const source of data.sources ?? []) {
      if (!source?.name || !(source?.url ?? '').startsWith('https://'))
        errors.push(`${file}: 每个来源都需要名称和 HTTPS URL`);
    }
    return { file, ...data, body: content.trim() };
  });

  const seen = new Set();
  for (const term of terms) {
    if (seen.has(term.slug))
      errors.push(`${term.file}: slug ${term.slug} 重复`);
    seen.add(term.slug);
  }
  for (const term of terms) {
    for (const ref of [
      ...(term.related ?? []),
      ...(term.prerequisites ?? []),
    ]) {
      if (!seen.has(ref))
        errors.push(`${term.file}: 引用了不存在的词条 ${ref}`);
      if (ref === term.slug) errors.push(`${term.file}: 不应关联自己`);
    }
  }
  return { files, terms, errors };
}

export function validateContent() {
  const result = loadAndValidateContent();
  if (result.errors.length)
    throw new Error(`内容校验失败：\n- ${result.errors.join('\n- ')}`);
  return result;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const result = validateContent();
    console.log(`✓ ${result.terms.length} 个词条通过结构、引用和来源校验`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
