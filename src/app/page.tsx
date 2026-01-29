import { redirect } from 'next/navigation';
import { getRecentDocuments } from '@/lib/documents';

export default async function Home() {
  const recent = await getRecentDocuments(1);
  
  if (recent.length > 0) {
    redirect(`/doc/${recent[0].slug}`);
  }
  
  redirect('/doc/journals/2026-01-29');
}
