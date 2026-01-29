import { notFound } from 'next/navigation';
import { getDocument, getAllDocuments } from '@/lib/documents';
import Sidebar from '@/components/Sidebar';
import DocumentViewer from '@/components/DocumentViewer';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const docs = await getAllDocuments();
  return docs.map((doc) => ({
    slug: doc.slug.split('/'),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const doc = await getDocument(slugPath);
  
  if (!doc) {
    return { title: 'Not Found' };
  }
  
  return {
    title: `${doc.title} | Second Brain`,
    description: doc.content.substring(0, 160),
  };
}

export default async function DocumentPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const doc = await getDocument(slugPath);
  
  if (!doc) {
    notFound();
  }
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <DocumentViewer doc={doc} />
        </div>
      </main>
    </div>
  );
}
