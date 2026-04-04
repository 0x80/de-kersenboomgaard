# De Kersenboomgaard

## Architecture Decisions

- **Kebab-case filenames** — all files use kebab-case (e.g. `card.astro`, not `Card.astro`).
- **Pure Astro** — no React or other UI frameworks. All interactivity uses vanilla JS in `<script>` tags.
- **Content Collections** — all content (artists, courses, agenda, expositions) is managed via Astro Content Collections with Zod schemas.
- **Native browser APIs** — uses `<dialog>` for modals, CSS `scroll-snap` for carousels, vanilla JS for scroll-based image rotation.

## Tech Stack

- Astro 6, TypeScript, Tailwind CSS 4, Vercel
- oxlint + oxfmt for linting/formatting
- pnpm as package manager

## Content Structure

- `content/artists/` — artist profiles (markdown with frontmatter)
- `content/courses/` — course listings
- `content/agenda/` — calendar events
- `content/expositions/` — exhibition info
- `public/assets/artists/{artist-id}/` — artist images (sorted alphabetically)
