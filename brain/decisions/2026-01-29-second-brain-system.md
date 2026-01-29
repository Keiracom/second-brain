# Decision: Implement Second Brain System

**Date:** 2026-01-29
**Status:** Implemented
**Decided by:** Dave

## Context
Dave wanted a way to visualize and explore the knowledge we build together over time. Static markdown files in the workspace work for storage but aren't great for browsing and discovery.

## Decision
Build a "Second Brain" app - a Next.js document viewer that:
- Reads from ~/clawd/brain/ folder
- Renders markdown beautifully
- Has Obsidian + Linear aesthetic
- Supports daily journals and concept documents

## Structure
```
brain/
├── journals/    # Daily summaries of our work
├── concepts/    # Deep dives on important topics
├── decisions/   # Key decisions with context
├── learnings/   # Lessons learned
└── projects/    # Project-specific documentation
```

## My Commitment
As we work together, I will:
1. Create a daily journal entry summarizing our discussions
2. Write concept documents when we explore important ideas
3. Log key decisions with context and reasoning
4. Capture learnings that might be useful later

## Outcome
- App deployed to Vercel (pending)
- Initial folder structure created
- First journal entry written
- First concept documents created

## Related
- [[working-with-dave]]
