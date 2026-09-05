'use client';

import { SiteLink as Link } from '@/components/site-link';
import { usePathname } from 'next/navigation';

export function NavigationLinks() {
  const pathname = usePathname();
  return (
    <>
      {[
        ['术语库', '/glossary'],
        ['概念对比', '/compare'],
        ['学习路径', '/paths'],
        ['AI 雷达', '/radar'],
      ].map(([label, href]) => (
        <Link
          href={href}
          key={href}
          aria-current={
            pathname === href || pathname?.startsWith(href + '/')
              ? 'page'
              : undefined
          }
          onClick={(event) =>
            event.currentTarget.closest('details')?.removeAttribute('open')
          }
        >
          {label}
        </Link>
      ))}
    </>
  );
}
