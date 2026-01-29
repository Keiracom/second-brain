'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DocumentMeta {
  slug: string;
  title: string;
  date?: string;
  type?: string;
  folder: string;
}

interface FolderStructure {
  [key: string]: DocumentMeta[];
}

const folderConfig: Record<string, { icon: string; label: string; color: string }> = {
  journals: { icon: '📅', label: 'Daily Journals', color: 'text-journal' },
  concepts: { icon: '💡', label: 'Concepts', color: 'text-concept' },
  decisions: { icon: '⚖️', label: 'Decisions', color: 'text-decision' },
  learnings: { icon: '🎓', label: 'Learnings', color: 'text-learning' },
  projects: { icon: '📁', label: 'Projects', color: 'text-accent' },
};

export default function Sidebar() {
  const pathname = usePathname();
  const [structure, setStructure] = useState<FolderStructure>({});
  const [recent, setRecent] = useState<DocumentMeta[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentMeta[] | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['journals', 'concepts', 'decisions', 'learnings', 'projects']));
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        setStructure(data.structure);
        setRecent(data.recent);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setSearchResults(data.results));
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const isActive = (slug: string) => pathname === `/doc/${slug}`;

  const renderDocList = (docs: DocumentMeta[]) => (
    <ul className="space-y-0.5">
      {docs.map(doc => (
        <li key={doc.slug}>
          <Link
            href={`/doc/${doc.slug}`}
            onClick={() => setIsMobileOpen(false)}
            className={`block px-3 py-1.5 rounded-lg text-sm transition-all ${
              isActive(doc.slug)
                ? 'bg-accent-muted text-accent font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
            }`}
          >
            {doc.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <span className="font-semibold text-lg">Second Brain</span>
        </Link>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {searchResults ? (
          // Search results
          <div>
            <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2 px-3">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </h3>
            {renderDocList(searchResults)}
          </div>
        ) : (
          <>
            {/* Recent */}
            {recent.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2 px-3 flex items-center gap-2">
                  <span>🕐</span> Recent
                </h3>
                {renderDocList(recent.slice(0, 5))}
              </div>
            )}

            {/* Folders */}
            {Object.entries(folderConfig).map(([folder, config]) => {
              const docs = structure[folder] || [];
              if (docs.length === 0) return null;

              return (
                <div key={folder} className="mb-4">
                  <button
                    onClick={() => toggleFolder(folder)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <span className={`transform transition-transform ${expandedFolders.has(folder) ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                    <span>{config.icon}</span>
                    <span className={config.color}>{config.label}</span>
                    <span className="ml-auto text-xs text-text-tertiary">{docs.length}</span>
                  </button>
                  {expandedFolders.has(folder) && (
                    <div className="mt-1 ml-4">
                      {renderDocList(docs)}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-text-tertiary">
        <p>Knowledge is power</p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-bg-secondary border border-border rounded-lg p-2 hover:bg-bg-hover transition-colors"
      >
        <span className="text-xl">{isMobileOpen ? '✕' : '☰'}</span>
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-72 bg-bg-secondary border-r border-border flex flex-col z-40 transform transition-transform lg:transform-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
