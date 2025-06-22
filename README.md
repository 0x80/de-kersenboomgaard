# Ateliers Kersenboomgaard Website

A modern website for the Kersenboomgaard artist studios in Utrecht, showcasing artists, courses, and events. Built with Next.js, React, Tailwind CSS, and ShadCN UI components.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd de-kersenboomgaard

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The development server will start at [http://localhost:3000](http://localhost:3000) with Turbopack for fast hot reloading.

### Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🛠 Tech Stack

### Core Framework

- **Next.js 15.3.4** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type safety and better developer experience

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **ShadCN UI** - High-quality component library
  - Style: New York
  - Base color: Stone
  - Icons: Lucide React
- **CSS Variables** - For consistent theming

### Content Management

- **Gray Matter** - Frontmatter parsing for markdown files
- **Glob** - File pattern matching for content discovery
- **File-based CMS** - All content stored in markdown files

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting with Tailwind plugin
- **pnpm** - Fast, disk space efficient package manager

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage with all content
│   │   ├── layout.tsx         # Root layout
│   │   ├── artist-card.tsx    # Artist display component
│   │   └── course-card.tsx    # Course display component
│   ├── components/
│   │   ├── navigation.tsx     # Site navigation
│   │   └── ui/               # ShadCN UI components
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility functions
├── content/                  # Content management (markdown files)
│   ├── artists/             # Artist profiles
│   ├── courses/             # Course information
│   └── agenda/              # Event listings
├── public/
│   └── assets/              # Artist images organized by ID
└── package.json
```

## 🎨 Artist Content Management

### Adding a New Artist

1. **Create Artist Profile**: Add a new markdown file in `content/artists/`

   - Filename format: `{house_number}-{artist-name}.md`
   - Example: `42-jane-doe.md`

2. **Artist Frontmatter Structure**:

```yaml
---
id: jane-doe # Unique identifier (used for images)
name: Jane Doe # Display name
profession: Painter & Sculptor # What they do
link: https://www.janedoe.com # Website (fully qualified URL)
building_number: 2 # Building number (1, 2, or 3)
house_number: 42 # House number (determines display order)
---
```

3. **Add Artist Images**: Create folder `public/assets/jane-doe/`
   - Main image: `jane-doe.jpg` (first alphabetically)
   - Hover image: `jane-doe_flip.jpg` (optional, second alphabetically)
   - Supported formats: `.jpg`, `.jpeg`, `.png`

### Editing via GitHub UI

1. Navigate to `content/artists/` in the GitHub repository
2. Click "Add file" → "Create new file" or edit existing file
3. Use the frontmatter structure above
4. Commit changes directly to main branch
5. Website updates automatically via deployment

## 📚 Course Content Management

### Adding a Course

1. **Create Course File**: Add markdown file in `content/courses/`

   - Filename: `{artist_house_number}-{course-name}.md`
   - Example: `42-pottery-workshop.md`

2. **Course Frontmatter Structure**:

```yaml
---
artist_id: jane-doe # Must match artist ID
name: Pottery Workshop # Course title
start_month: 3 # Start month (1-12)
end_month: 6 # End month (1-12)
link: https://www.janedoe.com/courses # Registration/info link
additional_artist_id: john-smith # Optional co-instructor
---
Course description goes here in markdown format.
You can use **bold**, *italic*, and other markdown formatting.

Multiple paragraphs are supported.
```

### Course Features

- **Automatic Artist Linking**: Courses link to artist profiles automatically
- **Co-instructors**: Support for multiple instructors via `additional_artist_id`
- **Sorting**: Courses display in house number order
- **Rich Content**: Full markdown support in course descriptions

## 📅 Agenda Management

### Adding Events

1. **Create Event File**: Add markdown file in `content/agenda/`

   - Filename format: `MMDD-event-name.md`
   - Example: `0529-jubileum-15-jaar.md`

2. **Event Frontmatter Structure**:

```yaml
---
title: Jubileum Kersenboomgaard 15 jaar # Event title
start_date: 2026-05-29 # Start date (YYYY-MM-DD)
start_time: h12m00 # Start time (h{hour}m{minute})
end_date: 2026-05-31 # End date (optional)
end_time: h22m00 # End time (optional)
event_link: https://example.com # More info link
---
Event description in markdown format.
```

### Time Format

- Use format: `h{hour}m{minute}`
- Examples: `h09m30` (9:30), `h14m00` (14:00), `h20m15` (20:15)
- Times display in Dutch format with proper formatting

### Date Display Features

- **Single Day**: "29 mei 2026 • 12:00 - 22:00"
- **Multiple Days**: "29 - 31 mei 2026 • 12:00 - 22:00"
- **Cross-month**: "29 mei - 2 juni 2026"
- **Dutch Months**: Automatic translation to Dutch month names

## 🖼 Image Management

### Image Organization

```
public/assets/
├── artist-id/
│   ├── artist-id.jpg          # Main image (first alphabetically)
│   ├── artist-id_flip.jpg     # Hover image (optional)
│   └── other-images.jpg       # Additional images (ignored)
```

### Image Guidelines

- **Naming**: Use artist ID as folder name (matches `id` in artist frontmatter)
- **Formats**: JPG, JPEG, PNG supported
- **Main Image**: First image alphabetically becomes the main image
- **Hover Effect**: Second image (often with `_flip` suffix) used for hover
- **Fallbacks**: Missing images handled gracefully with placeholders

### Adding Images via GitHub

1. Navigate to `public/assets/` in repository
2. Create new folder with artist ID name
3. Upload images using GitHub's file upload
4. Ensure proper naming convention

## 🎨 Design System & v0.dev Integration

This project uses the same tech stack as [v0.dev](https://v0.dev), making it perfect for AI-aided design and rapid prototyping:

### v0.dev Compatibility

- **Framework**: Next.js with App Router ✅
- **Styling**: Tailwind CSS ✅
- **Components**: ShadCN UI (New York style) ✅
- **Icons**: Lucide React ✅
- **TypeScript**: Full support ✅

### Using v0.dev for Development

1. Visit [v0.dev](https://v0.dev)
2. Describe the component or page you want to create
3. Copy the generated code directly into this project
4. Components will work seamlessly with existing design system

### Design Tokens

- **Base Color**: Stone (neutral grays)
- **CSS Variables**: Enabled for consistent theming
- **Component Style**: New York (clean, minimal aesthetic)

## 🔧 Development Guidelines

### Code Style

- **Prettier**: Automatic formatting with Tailwind class sorting
- **ESLint**: Code quality and consistency
- **TypeScript**: Strict type checking enabled

### Component Patterns

- **Server Components**: Used by default for better performance
- **Client Components**: Only when interactivity needed
- **File-based Routing**: Leverage Next.js App Router conventions

### Content Updates

- **Automatic Builds**: Changes to content trigger automatic deployments
- **No Cache Issues**: Content changes reflect immediately after build
- **Type Safety**: TypeScript interfaces ensure content structure consistency

## 🚀 Deployment

The site is configured for automatic deployment. Any changes to the main branch will trigger a new build and deployment.

### Build Process

1. Content files are processed at build time
2. Images are optimized automatically
3. Static generation for optimal performance
4. Automatic sitemap and SEO optimization

## 📝 Content Editing Tips

### For Non-Technical Users

1. **GitHub Web Interface**: Edit files directly in browser
2. **Markdown Preview**: Use GitHub's preview tab to check formatting
3. **Commit Messages**: Use descriptive messages like "Add new artist: Jane Doe"
4. **File Naming**: Follow the naming conventions exactly
5. **Frontmatter**: Copy existing files as templates to avoid syntax errors

### Common Tasks

- **Add Artist**: Copy existing artist file, update all fields, add images
- **Update Course**: Edit course file, changes reflect immediately after deployment
- **Schedule Event**: Add to agenda folder with proper date formatting
- **Update Images**: Replace files in artist folders, keep same names

## 🆘 Troubleshooting

### Common Issues

- **Images not showing**: Check file paths and naming conventions
- **Content not updating**: Verify frontmatter syntax (YAML format)
- **Build errors**: Check for missing required fields in frontmatter
- **Dates not formatting**: Ensure date format is YYYY-MM-DD

### Getting Help

- Check existing files as examples
- Verify frontmatter syntax matches exactly
- Ensure all required fields are present
- Test changes in development before committing

---
