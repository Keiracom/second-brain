import { NextResponse } from 'next/server';
import { searchDocuments } from '@/lib/documents';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query || query.trim().length < 2) {
    return NextResponse.json({
      results: [],
      query: query || '',
    });
  }
  
  try {
    const results = await searchDocuments(query);
    
    return NextResponse.json({
      results,
      query,
      total: results.length,
    });
  } catch (error) {
    console.error('Error searching documents:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
