import type { TermMeta } from './term-schema.ts';

export function sourceAnchor(
  source: TermMeta['sources'][number],
  index: number,
) {
  return `source-${source.id ?? index + 1}`;
}

// Authored H2 headings use plain text. Ignore fenced examples when making the TOC.
export function getReadingSections(body: string) {
  const sections: { id: string; title: string; line: number }[] = [];
  let fence: string | undefined;
  for (const [index, line] of body.split('\n').entries()) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length)
        fence = undefined;
      continue;
    }
    if (fence) continue;
    const heading = line.match(/^##\s+(.+?)(?:\s+#+)?\s*$/);
    if (heading)
      sections.push({
        id: `reading-${sections.length + 1}`,
        title: heading[1],
        line: index + 1,
      });
  }
  return sections;
}

export function validateReading(term: TermMeta & { body: string }) {
  const errors: string[] = [];
  const ids = term.sources.map(sourceAnchor);
  if (new Set(ids).size !== ids.length)
    errors.push('sources: 来源 ID 不得重复');
  const citations = [...term.body.matchAll(/\]\(#(source-[a-z0-9-]+)\)/g)].map(
    (match) => match[1],
  );
  for (const id of citations)
    if (!ids.includes(id)) errors.push(`body: 引用了不存在的来源 ${id}`);
  if (term.learning_objectives) {
    if (!term.exercise) errors.push('exercise: 深读词条需要自测与参考答案');
    for (const source of term.sources) {
      if (
        !source.id ||
        !source.publisher ||
        !source.kind ||
        !source.accessed ||
        !source.supports ||
        !source.limitation
      )
        errors.push('sources: 深读词条需要完整的来源说明');
      if (source.accessed && source.accessed > term.last_verified)
        errors.push('sources.accessed: 不得晚于词条核验日期');
    }
    for (const id of ids)
      if (!citations.includes(id))
        errors.push(`body: 来源 ${id} 尚未在正文中引用`);
  }
  return errors;
}
