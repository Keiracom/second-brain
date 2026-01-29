import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

// Path to the brain folder
const BRAIN_PATH = process.env.BRAIN_PATH || path.join(process.env.HOME || '/home/elliotbot', 'clawd', 'brain');

export interface DocumentMeta {
  slug: string;
  title: string;
  date?: string;
  type?: 'journal' | 'concept' | 'decision' | 'learning' | 'project';
  status?: string;
  tags?: string[];
  folder: string;
  path: string;
}

export interface Document extends DocumentMeta {
  content: string;
  backlinks: DocumentMeta[];
}

// Get all markdown files
export async function getAllDocuments(): Promise<DocumentMeta[]> {
  const files = await glob('**/*.md', { cwd: BRAIN_PATH });
  
  const docs = files.map((file) => {
    const fullPath = path.join(BRAIN_PATH, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { data } = matter(content);
    
    const slug = file.replace(/\.md$/, '');
    const folder = path.dirname(file);
    
    return {
      slug,
      title: data.title || formatTitle(path.basename(file, '.md')),
      date: data.date ? String(data.date) : undefined,
      type: inferType(folder, data.type),
      status: data.status,
      tags: data.tags || [],
      folder: folder === '.' ? '' : folder,
      path: file,
    };
  });
  
  // Sort by date descending
  return docs.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Get a single document by slug
export async function getDocument(slug: string): Promise<Document | null> {
  const filePath = path.join(BRAIN_PATH, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: rawContent } = matter(content);
  
  const folder = path.dirname(slug);
  
  // Find backlinks
  const allDocs = await getAllDocuments();
  const backlinks: DocumentMeta[] = [];
  
  for (const doc of allDocs) {
    if (doc.slug === slug) continue;
    
    const docPath = path.join(BRAIN_PATH, `${doc.slug}.md`);
    const docContent = fs.readFileSync(docPath, 'utf-8');
    
    // Check for wiki-style links to this document
    const linkPatterns = [
      `[[${slug}]]`,
      `[[${slug}|`,
      `[[${path.basename(slug)}]]`,
      `[[${path.basename(slug)}|`,
    ];
    
    if (linkPatterns.some(pattern => docContent.includes(pattern))) {
      backlinks.push(doc);
    }
  }
  
  return {
    slug,
    title: data.title || formatTitle(path.basename(slug)),
    date: data.date ? String(data.date) : undefined,
    type: inferType(folder, data.type),
    status: data.status,
    tags: data.tags || [],
    folder: folder === '.' ? '' : folder,
    path: `${slug}.md`,
    content: rawContent,
    backlinks,
  };
}

// Search documents
export async function searchDocuments(query: string): Promise<DocumentMeta[]> {
  const allDocs = await getAllDocuments();
  const lowerQuery = query.toLowerCase();
  
  return allDocs.filter((doc) => {
    // Search in title
    if (doc.title.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in tags
    if (doc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
    
    // Search in content
    const filePath = path.join(BRAIN_PATH, `${doc.slug}.md`);
    const content = fs.readFileSync(filePath, 'utf-8').toLowerCase();
    return content.includes(lowerQuery);
  });
}

// Get documents by folder
export async function getDocumentsByFolder(folder: string): Promise<DocumentMeta[]> {
  const allDocs = await getAllDocuments();
  return allDocs.filter(doc => doc.folder === folder || doc.folder.startsWith(folder + '/'));
}

// Get recent documents
export async function getRecentDocuments(limit: number = 10): Promise<DocumentMeta[]> {
  const allDocs = await getAllDocuments();
  return allDocs.slice(0, limit);
}

// Get folder structure
export async function getFolderStructure(): Promise<Record<string, DocumentMeta[]>> {
  const allDocs = await getAllDocuments();
  const structure: Record<string, DocumentMeta[]> = {};
  
  for (const doc of allDocs) {
    const folder = doc.folder || 'root';
    if (!structure[folder]) {
      structure[folder] = [];
    }
    structure[folder].push(doc);
  }
  
  return structure;
}

// Helper: Format title from filename
function formatTitle(filename: string): string {
  return filename
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Helper: Infer document type from folder
function inferType(folder: string, explicitType?: string): DocumentMeta['type'] {
  if (explicitType) return explicitType as DocumentMeta['type'];
  
  if (folder.includes('journal')) return 'journal';
  if (folder.includes('concept')) return 'concept';
  if (folder.includes('decision')) return 'decision';
  if (folder.includes('learning')) return 'learning';
  if (folder.includes('project')) return 'project';
  
  return undefined;
}

// Transform wiki links in content
export function transformWikiLinks(content: string): string {
  // Match [[link]] or [[link|text]]
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  
  return content.replace(wikiLinkRegex, (match, link, text) => {
    const displayText = text || link.split('/').pop() || link;
    const href = `/doc/${link}`;
    return `[${displayText}](${href})`;
  });
}
