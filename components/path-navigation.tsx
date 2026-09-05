'use client';

import { SiteLink as Link } from '@/components/site-link';
import { useSyncExternalStore } from 'react';
import { getPathStep, pathTermHref } from '@/lib/experience';

function subscribe(listener: () => void) {
  window.addEventListener('popstate', listener);
  return () => window.removeEventListener('popstate', listener);
}
const getSnapshot = () => window.location.search;
const getServerSnapshot = () => '';

export function PathNavigation({ slug }: { slug: string }) {
  // Static export has no request query. Read the browser URL after hydration.
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const pathId = new URLSearchParams(search).get('path') ?? '';
  const step = getPathStep(pathId, slug);
  if (!step) return null;
  return (
    <nav className="path-context" aria-label="当前学习路径">
      <p>
        <Link href={`/paths#${step.path.id}`}>{step.path.title}</Link> · 第{' '}
        {step.index + 1}/{step.path.terms.length} 步
      </p>
      <div className="path-context-links">
        {step.previous && (
          <Link href={pathTermHref(pathId, step.previous[1])}>
            ← 上一节：{step.previous[0]}
          </Link>
        )}
        {step.next ? (
          <Link href={pathTermHref(pathId, step.next[1])}>
            下一节：{step.next[0]} →
          </Link>
        ) : (
          <Link href={`/paths#${step.path.id}`}>回到路径，完成动手检验 →</Link>
        )}
      </div>
    </nav>
  );
}
