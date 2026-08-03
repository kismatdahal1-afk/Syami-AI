import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@syami/ui';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const components: Components = {
  h1: ({ children }) => <h1 className="mb-2 mt-4 text-lg font-semibold tracking-tight first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 mt-4 text-base font-semibold tracking-tight first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-1.5 mt-3 text-sm font-semibold">{children}</h3>,
  p: ({ children }) => <p className="my-2 leading-relaxed first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-primary/40 pl-3 italic text-muted-foreground">{children}</blockquote>
  ),
  hr: () => <hr className="my-4 border-border" />,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  pre: ({ children }) => (
    <pre className="my-3 overflow-hidden rounded-lg border border-border bg-muted/40">{children}</pre>
  ),
  code: ({ className, children, ...rest }) => {
    const isBlock = className?.includes('language-') ?? false;
    if (isBlock) {
      return (
        <code
          className={cn('block overflow-x-auto px-4 py-3 text-[13px] leading-relaxed', className)}
          {...rest}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className={cn('rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground', className)}
        {...rest}
      >
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border bg-muted/40 px-3 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-border/60 px-3 py-2">{children}</td>,
};

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps): React.JSX.Element => (
  <div className={cn('text-sm text-foreground', className)}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
      {content}
    </ReactMarkdown>
  </div>
);