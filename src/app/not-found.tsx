import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">🤔</h1>
        <h2 className="text-2xl font-semibold mb-2">Note Not Found</h2>
        <p className="text-text-secondary mb-6">
          This note doesn&apos;t exist yet. Maybe it&apos;s waiting to be written?
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          ← Back to your brain
        </Link>
      </div>
    </div>
  );
}
