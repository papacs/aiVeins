import ReactMarkdown from 'react-markdown';
import { getReadingSections } from '@/lib/reading';

export function TermMarkdown({ children }: { children: string }) {
  const sections = getReadingSections(children);
  return (
    <div className="term-prose">
      <ReactMarkdown
        components={{
          h2({ node, children: heading }) {
            const section = sections.find(
              (item) => item.line === node?.position?.start.line,
            );
            return (
              <h2 id={section?.id}>
                {heading}
                {section && (
                  <a
                    className="heading-permalink"
                    href={`#${section.id}`}
                    aria-label={`链接到${section.title}`}
                  >
                    #
                  </a>
                )}
              </h2>
            );
          },
          a({ href, children: label }) {
            const citation = href?.startsWith('#source-');
            const external = href?.startsWith('https://');
            return (
              <a
                href={href}
                className={citation ? 'source-citation' : undefined}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
              >
                {label}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
