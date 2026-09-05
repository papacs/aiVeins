import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { termMetaSchema } from '../lib/term-schema.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const termDirectory = path.join(root, 'content', 'terms');
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
  const terms = files
    .map((file) => {
      let data, content;
      try {
        ({ data, content } = parseMarkdownFile(
          fs.readFileSync(path.join(termDirectory, file), 'utf8'),
        ));
      } catch (error) {
        errors.push(file + ': ' + error.message);
        return null;
      }
      const parsed = termMetaSchema.safeParse(data);
      if (!parsed.success) {
        for (const issue of parsed.error.issues)
          errors.push(file + ': ' + issue.path.join('.') + ' ' + issue.message);
        return null;
      }
      data = parsed.data;
      if (file !== data.slug + '.md')
        errors.push(file + ': 文件名必须与 slug 一致');
      if (!content.includes('## '))
        errors.push(file + ': 正文至少需要一个二级标题');
      return { file, ...data, body: content.trim() };
    })
    .filter(Boolean);

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
