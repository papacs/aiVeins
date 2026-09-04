import { terms } from '@/lib/content';

export function GET() {
  return Response.json(
    {
      name: 'AI 脉络',
      description: '中文 AI 工程决策与反黑话手册',
      generated_at: new Date().toISOString(),
      count: terms.length,
      terms,
    },
    {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    },
  );
}
