import ReactMarkdown from 'react-markdown';

export function TermMarkdown({ children }: { children: string }) {
  return (
    <div className="term-prose">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
