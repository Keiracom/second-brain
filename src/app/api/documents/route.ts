import { NextResponse } from 'next/server';
import { getAllDocuments, getRecentDocuments, getFolderStructure } from '@/lib/documents';

export async function GET() {
  try {
    const [all, recent, structure] = await Promise.all([
      getAllDocuments(),
      getRecentDocuments(10),
      getFolderStructure(),
    ]);
    
    return NextResponse.json({
      documents: all,
      recent,
      structure,
      total: all.length,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
