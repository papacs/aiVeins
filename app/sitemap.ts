import type { MetadataRoute } from 'next';
import { terms } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aiveins.heyluckyme.com';
  const pages = [
    '',
    '/glossary',
    '/compare',
    '/paths',
    '/radar',
    '/contribute',
  ];
  return [
    ...pages.map((path) => ({
      url: `${base}${path}`,
      lastModified: '2026-09-04',
    })),
    ...terms.map((term) => ({
      url: `${base}/glossary/${term.slug}`,
      lastModified: term.last_verified,
    })),
  ];
}
