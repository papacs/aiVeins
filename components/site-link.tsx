import type { AnchorHTMLAttributes } from 'react';

// Pages serves pre-rendered documents. Native links preserve query strings,
// fragments, browser history and navigation without an RSC server.
export function SiteLink({
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props}>{children}</a>;
}
