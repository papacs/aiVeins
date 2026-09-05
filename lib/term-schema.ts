import { z } from 'zod';

const sourceSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/)
    .optional(),
  name: z.string().min(1),
  url: z
    .url()
    .refine((value) => value.startsWith('https://'), '来源必须使用 HTTPS'),
  publisher: z.string().min(1).optional(),
  kind: z.enum(['原始论文', '官方文档', '一手工程实践', '标准规范']).optional(),
  accessed: z.iso.date().optional(),
  supports: z.string().min(12).optional(),
  limitation: z.string().min(12).optional(),
});

export const termMetaSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  aliases: z.array(z.string()).default([]),
  category: z.enum([
    '基础模型',
    '应用架构',
    'Agent 工程',
    '检索',
    '评测与安全',
  ]),
  level: z.enum(['入门', '进阶']),
  status: z.enum(['verified', 'researching', 'outdated']),
  trend: z.enum(['基础概念', '当前热门', '快速演变', '存在争议']),
  last_verified: z.iso.date(),
  summary: z.string().min(24),
  analogy: z.string().min(24),
  solves: z.array(z.string()).min(1),
  boundaries: z.array(z.string()).min(1),
  use_when: z.array(z.string()).min(1),
  avoid_when: z.array(z.string()).min(1),
  pitfalls: z.array(z.string().min(1)).min(3),
  related: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  learning_objectives: z.array(z.string().min(6)).min(1).max(4).optional(),
  exercise: z
    .object({
      question: z.string().min(12),
      answer: z.string().min(24),
    })
    .optional(),
  sources: z.array(sourceSchema).min(1),
});

export type TermMeta = z.infer<typeof termMetaSchema>;
