# Second Brain 🧠

Dave's personal knowledge base. A beautiful, fast document viewer for markdown notes.

## Design Philosophy

- **Obsidian meets Linear**: Knowledge graph feel with clean, minimal aesthetics
- **Dark theme**: Easy on the eyes
- **Mobile-friendly**: Works great on any device

## Features

- 📄 Beautiful markdown rendering with syntax highlighting
- 🔗 Wiki-style links with automatic backlinks
- 🔍 Fast search across all documents
- 📁 Folder-based organization
- 🏷️ Tags and document types (journals, concepts, decisions, learnings)

## Document Types

- **Journals** (📅) - Daily entries and reflections
- **Concepts** (💡) - Deep dives on topics
- **Decisions** (⚖️) - Key decisions with context and outcomes
- **Learnings** (🎓) - Lessons learned

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS + @tailwindcss/typography
- react-markdown with remark-gfm
- gray-matter for frontmatter parsing

## Setup

The app reads markdown files from the `brain/` folder (configurable via `BRAIN_PATH` env var).

```bash
npm install
npm run dev
```

## Deployment

Deployed automatically to Vercel via GitHub integration.

---

*Knowledge is power* ⚡
