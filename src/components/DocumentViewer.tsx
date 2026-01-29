'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';

interface DocumentMeta {
  slug: string;
  title: string;
  date?: string;
  type?: string;
  folder: string;
}

interface Document extends DocumentMeta {
  content: string;
  backlinks: DocumentMeta[];
  tags?: string[];
  status?: string;
}

const typeConfig: Record<string, { icon: string; label: string; color: string }> = {
  journal: { icon: '📅', label: 'Journal', color: 'bg-journal/20 text-journal' },
  concept: { icon: '💡', label: 'Concept', color: 'bg-concept/20 text-concept' },
  decision: { icon: '⚖️', label: 'Decision', color: 'bg-decision/20 text-decision' },
  learning: { icon: '🎓', label: 'Learning', color: 'bg-learning/20 text-learning' },
  project: { icon: '📁', label: 'Project', color: 'bg-accent/20 text-accent' },
};

export default function DocumentViewer({ doc }: { doc: Document }) {
  const typeInfo = doc.type ? typeConfig[doc.type] : null;

  // Transform wiki links in content
  const transformedContent = doc.content.replace(
    /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (match, link, text) => {
      const displayText = text || link.split('/').pop() || link;
      return `[${displayText}](/doc/${link})`;
    }
  );

  return (
    <article className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        {/* Breadcrumb */}
        {doc.folder && (
          <div className="flex items-center gap-2 text-sm text-text-tertiary mb-4">
            <Link href="/" className="hover:text-text-secondary">🏠</Link>
            <span>/</span>
            <span className="capitalize">{doc.folder}</span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{doc.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {typeInfo && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${typeInfo.color}`}>
              <span>{typeInfo.icon}</span>
              <span>{typeInfo.label}</span>
            </span>
          )}

          {doc.date && (
            <span className="text-text-tertiary">
              {new Date(doc.date).toLocaleDateString('en-AU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}

          {doc.status && (
            <span className="px-2 py-0.5 bg-bg-tertiary border border-border rounded text-text-secondary">
              {doc.status}
            </span>
          )}
        </div>

        {/* Tags */}
        {doc.tags && doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {doc.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-bg-tertiary text-text-secondary text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            a: ({ href, children, ...props }) => {
              const isInternal = href?.startsWith('/');
              if (isInternal) {
                return (
                  <Link href={href || '#'} className="wiki-link" {...props}>
                    {children}
                  </Link>
                );
              }
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              );
            },
          }}
        >
          {transformedContent}
        </ReactMarkdown>
      </div>

      {/* Backlinks */}
      {doc.backlinks && doc.backlinks.length > 0 && (
        <div className="backlinks mt-12">
          <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wide mb-4 flex items-center gap-2">
            <span>🔗</span>
            <span>Linked from {doc.backlinks.length} note{doc.backlinks.length !== 1 ? 's' : ''}</span>
          </h2>
          <ul className="space-y-2">
            {doc.backlinks.map(link => {
              const linkType = link.type ? typeConfig[link.type] : null;
              return (
                <li key={link.slug}>
                  <Link
                    href={`/doc/${link.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary border border-border hover:border-border-hover transition-colors group"
                  >
                    <span className="text-lg">{linkType?.icon || '📄'}</span>
                    <div>
                      <p className="font-medium group-hover:text-accent transition-colors">
                        {link.title}
                      </p>
                      {link.date && (
                        <p className="text-xs text-text-tertiary mt-0.5">
                          {new Date(link.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </article>
  );
}
