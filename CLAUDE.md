# De Kersenboomgaard

## Architecture Decisions

- **Kebab-case filenames** — all files use kebab-case (e.g. `card.astro`, not `Card.astro`).
- **Astro-first** — use Astro components for everything static. Only use React (`client:load`) for interactive islands (image carousel).
- **Content Collections** — all content (artists, courses, agenda, expositions) is managed via Astro Content Collections with Zod schemas.
- **Vanilla JS for simple interactivity** — navigation scroll-hide, smooth scrolling, etc. use `<script>` tags, not React.

## Tech Stack

- Astro 6, TypeScript, Tailwind CSS 4, React (selective islands), Vercel
- oxlint + oxfmt for linting/formatting
- pnpm as package manager

## Content Structure

- `content/artists/` — artist profiles (markdown with frontmatter)
- `content/courses/` — course listings
- `content/agenda/` — calendar events
- `content/expositions/` — exhibition info
- `public/assets/artists/{artist-id}/` — artist images (sorted alphabetically)
