import Link from 'next/link';
import { Menu } from 'lucide-react';

const navigation = [
  ['术语库', '/glossary'],
  ['概念对比', '/compare'],
  ['学习路径', '/paths'],
  ['AI 雷达', '/radar'],
];

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="AI 脉络首页">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>AI 脉络</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="topbar">
      <Brand />
      <nav aria-label="主导航">
        {navigation.map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
      <a
        className="github-link"
        href="https://github.com/papacs/aiVeins"
        target="_blank"
        rel="noreferrer"
      >
        GitHub ↗
      </a>
      <details className="mobile-menu">
        <summary aria-label="打开导航">
          <Menu size={21} />
        </summary>
        <div>
          {navigation.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
          <Link href="/contribute">参与共建</Link>
          <a
            href="https://github.com/papacs/aiVeins"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </details>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Brand />
      <p>让第一次接触 AI 的人不害怕，让持续学习的人不掉队。</p>
      <div>
        <a
          href="https://github.com/papacs/aiVeins"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <Link href="/contribute">贡献指南</Link>
        <Link href="/glossary.json">JSON 数据</Link>
        <Link href="/llms.txt">llms.txt</Link>
        <span>MIT License</span>
      </div>
    </footer>
  );
}
