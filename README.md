# Ateliers Kersenboomgaard Website

A modern website for the Kersenboomgaard artist studios in Utrecht, showcasing artists, courses, and events.

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
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Homepage with all content
│   │   ├── layout.tsx         # Root layout with SEO
│   │   ├── globals.css        # Global styles
│   │   ├── components/        # Page-specific components
│   │   │   ├── agenda-list.tsx      # Agenda display component
│   │   │   ├── artist-card.tsx      # Artist display component
│   │   │   ├── course-list.tsx      # Course display component
│   │   │   └── exposition-list.tsx  # Exposition display component
│   │   └── helpers/           # Server-side helper functions
│   │       ├── generate-structured-data.ts  # SEO structured data
│   │       ├── get-agenda-items.ts          # Agenda content loader
│   │       ├── get-artist-images.ts         # Image management
│   │       ├── get-artists.ts               # Artist content loader
│   │       ├── get-courses.ts               # Course content loader
│   │       ├── get-expositions.ts           # Exposition content loader
│   │       └── get-seo-data.ts              # SEO metadata generator
│   ├── components/
│   │   ├── navigation.tsx     # Site navigation
│   │   └── ui/               # ShadCN UI components
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   │   ├── cn.ts             # Class name utility
│   │   └── generate-slug.ts  # Slug generation
│   └── types.ts              # TypeScript type definitions
├── content/                  # Content management (markdown files)
│   ├── artists/             # Artist profiles
│   ├── courses/             # Course information
│   ├── expositions/         # Exhibition listings
│   └── agenda/              # Event listings
├── public/
│   └── assets/              # Artist images organized by ID
└── package.json
```

## 🎨 Artist Content Management

### Adding a New Artist

1. **Create Artist Profile**: Add a new markdown file in `content/artists/`

   - Filename format: `{house_number}-{artist-name}.md` (recommended for organization)
   - Example: `42-jane-doe.md`
   - Note: Filename doesn't affect functionality - artists are sorted by `house_number` field

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

3. **Add Artist Images**: Create folder `public/assets/artists/jane-doe/`
   - Add any number of images with any names
   - Images are displayed in alphabetical order
   - All images cycle based on scroll position
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

   - Filename format: `{artist_house_number}-{course-name}.md` (recommended for organization)
   - Example: `42-pottery-workshop.md`
   - Note: Filename doesn't affect functionality - courses are sorted by linked artist's `house_number`

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
Course description goes here as plain text.
Multiple paragraphs are supported, but markdown formatting is not rendered.
```

### Course Features

- **Multiple Courses per Artist**: Artists can have multiple courses by creating separate course files with the same `artist_id`
- **Automatic Artist Linking**: Courses link to artist profiles automatically
- **Co-instructors**: Support for multiple instructors via `additional_artist_id`
- **Sorting**: Courses display in house number order of the linked artist
- **Plain Text Content**: Course descriptions are displayed as plain text (markdown is not rendered)

## 🎨 Exposition Management

### Adding Expositions

1. **Create Exposition File**: Add markdown file in `content/expositions/`

   - Filename format: `expo-YYYY-season.md` or descriptive name
   - Example: `expo-2024-spring.md`, `expo-winter-showcase.md`

2. **Exposition Frontmatter Structure**:

```yaml
---
title: Lente Expositie 2024 # Exhibition title
start_date: 2024-04-10 # Start date (YYYY-MM-DD)
start_time: h14m00 # Opening time (h{hour}m{minute})
end_date: 2024-06-10 # End date (YYYY-MM-DD)
end_time: h18m00 # Closing time (optional)
location: Galerie Kersenboomgaard # Venue name
address: Kersenlaan 12, 1234 AB Boomstad # Full address
curator: Anna de Kunst # Curator name
opening_event_time: h14m00 # Special opening event time
opening_event_description: Officiële opening met muziek en borrel # Opening details
artist_ids: thijs-koerselman,max-kisman # Featured artists (comma-separated, links to artist profiles)
link: https://www.galerie-kersenboomgaard.nl/exposities/lente-2024 # More info link
---
Exhibition description in plain text.
Multiple paragraphs supported.
```

### Exposition Features

- **Multiple Artist Linking**: Use `artist_ids` to link multiple featured artists (comma-separated, creates clickable links to artist profiles)
- **"Meer info" Links**: Use `link` to display a dedicated "Meer info" button (opens in new tab)
- **Dutch Date Formatting**: Automatic formatting like "10 april - 10 juni 2024"
- **Opening Events**: Special opening event time and description support
- **Location Details**: Full venue and address information
- **Curator Information**: Curator name and details
- **Automatic Sorting**: Expositions display by date (most recent first)
- **Flexible Artist Format**: Supports single artist, comma-separated string, or array format

### Time Format (Same as Agenda)

- Use format: `h{hour}m{minute}`
- Examples: `h09m30` (9:30), `h14m00` (14:00), `h20m15` (20:15)
- Times display in Dutch format with proper formatting

### Date Display Features

- **Single Day**: "10 april 2024 • 14:00 - 18:00"
- **Multiple Days**: "10 - 15 april 2024 • 14:00 - 18:00"
- **Cross-month**: "29 april - 2 mei 2024"
- **Dutch Months**: Automatic translation to Dutch month names

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
public/assets/artists/
├── artist-id/
│   ├── image1.jpg             # Any filename works
│   ├── image2.png             # Images sorted alphabetically
│   ├── image3.jpeg            # All images used in scroll cycle
│   └── any-name.jpg           # Filename doesn't matter
```

### Image Guidelines

- **Folder Naming**: Use artist ID as folder name (matches `id` in artist frontmatter)
- **File Naming**: Image filenames don't matter - any name works
- **Formats**: JPG, JPEG, PNG supported
- **Display Order**: Images are sorted alphabetically by filename
- **Scroll-Based Display**: All images cycle equally based on scroll position
- **Fallbacks**: Missing images handled gracefully with placeholders

### Adding Images via GitHub

1. Navigate to `public/assets/artists/` in repository
2. Create new folder with artist ID name
3. Upload images with any filenames
4. Images will automatically display in alphabetical order during scroll

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

## 🔍 SEO & Search Engine Optimization

The website features an advanced, automated SEO system that dynamically generates search engine optimization data from your content files. This ensures maximum discoverability for both the artist community and individual artists.

### How It Works

The SEO system automatically extracts information from your artist and course markdown files to generate:

- **Dynamic Page Titles**: "De Kersenboomgaard - Kunstenaars & Ateliers Utrecht | 30+ Creatievelingen"
- **Rich Descriptions**: Mentions specific artists like "Max Kisman, Raafat Ballan, Jesse van Boheemen"
- **Comprehensive Keywords**: All artist names, professions, and course titles
- **Structured Data**: Schema.org markup for enhanced search results

### What Gets Generated Automatically

#### Keywords & Metadata

- **Base Keywords**: "De Kersenboomgaard", "kunstenaars Utrecht", "ateliers Utrecht"
- **Artist-Specific**: Each artist name + "Utrecht" (e.g., "Max Kisman Utrecht")
- **Profession-Based**: "beeldhouwer Utrecht", "schilder Utrecht", etc.
- **Course-Based**: "cursus [course name]", "workshop [course name]"

#### Structured Data (JSON-LD)

- **Organization Schema**: De Kersenboomgaard as kunstenaarscommunity
- **LocalBusiness Schema**: Address, location, and business details
- **Person Schemas**: Individual artist profiles with professions and websites
- **Course Schemas**: Workshop listings with instructors and locations

#### Social Media Optimization

- **Open Graph Tags**: Optimized Facebook sharing
- **Twitter Cards**: Enhanced Twitter sharing
- **Image Metadata**: Proper social media image handling

### Search Engine Benefits

The automated system ensures your site ranks for searches like:

- **"Max Kisman Utrecht"** → Direct artist match
- **"kunstenaars Utrecht"** → Primary community result
- **"cursussen beeldende kunst Utrecht"** → Course matches
- **"ateliers Utrecht"** → High ranking for the community

### Technical Implementation

- **Build-Time Generation**: All SEO data generated during build for optimal performance
- **Automatic Updates**: Adding new artists or courses automatically updates SEO
- **Dutch Optimization**: Focused on Dutch keywords and local Utrecht searches
- **Schema.org Compliance**: Rich snippets for enhanced search results

### Files Involved

- `src/app/helpers/get-seo-data.ts` - Extracts SEO data from content
- `src/app/helpers/generate-structured-data.ts` - Creates JSON-LD markup
- `src/app/layout.tsx` - Implements metadata and social tags
- `src/app/page.tsx` - Includes structured data scripts

The system requires no manual SEO work - simply add artists and courses using the content management system, and search optimization happens automatically.

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

## 🔍 Pull Requests & Preview Deployments

This project is hosted on Vercel with automatic preview deployments for every pull request. This allows you to safely test changes before they go live and share previews with stakeholders for approval.

### Creating a Pull Request

#### For Content Changes (Non-Technical Users)

1. **Fork the Repository**

   - Go to the GitHub repository page
   - Click the "Fork" button in the top-right corner
   - This creates your own copy of the repository

2. **Make Your Changes**

   - Navigate to your forked repository
   - Edit files directly in the GitHub web interface
   - Add new artists, update courses, or modify content as needed

3. **Create the Pull Request**
   - After making changes, GitHub will show a "Compare & pull request" button
   - Click it and add a descriptive title like "Add new artist: Jane Doe"
   - Provide details about what you've changed in the description
   - Click "Create pull request"

#### For Code Changes (Developers)

```bash
# Create a new branch for your changes
git checkout -b feature/your-feature-name

# Make your changes
# ... edit files ...

# Commit your changes
git add .
git commit -m "Add new feature: description"

# Push to your fork or branch
git push origin feature/your-feature-name

# Create pull request via GitHub interface
```

### Automatic Preview Deployments

When you create a pull request, Vercel automatically:

1. **Builds Your Changes** - Creates a complete build with your modifications
2. **Deploys to Preview URL** - Generates a unique preview URL for testing
3. **Updates on Changes** - Rebuilds and updates the preview for each new commit
4. **Cleans Up** - Removes the preview deployment when the PR is merged or closed

### Accessing Preview Deployments

#### Finding Your Preview URL

1. **GitHub PR Page** - Look for the Vercel bot comment with the preview link
2. **GitHub Checks** - Click "Details" next to the Vercel deployment check
3. **Vercel Dashboard** - View all deployments in your Vercel project dashboard

#### Preview URL Format

```
https://de-kersenboomgaard-git-[branch-name]-[username].vercel.app
```

### Benefits of Preview Deployments

#### Safe Testing Environment

- **No Risk to Live Site** - Test changes without affecting the production website
- **Full Functionality** - Preview deployments include all features and content
- **Real Environment** - Test with actual domain behavior and performance

#### Stakeholder Review

- **Share with Artists** - Send preview links to artists for content approval
- **Client Feedback** - Get feedback from stakeholders before changes go live
- **Visual Confirmation** - See exactly how changes will look on the live site

#### Development Workflow

- **Feature Testing** - Test new features in isolation
- **Content Validation** - Verify content formatting and display
- **SEO Testing** - Check meta tags and structured data in preview environment

### Recommended Workflow

#### For Content Updates

1. **Create PR** with your content changes
2. **Share Preview Link** with relevant artists or stakeholders
3. **Gather Feedback** and make any necessary adjustments
4. **Merge PR** once approved - changes automatically deploy to live site

#### For Code Changes

1. **Develop in Branch** with proper testing
2. **Create PR** with detailed description of changes
3. **Test Preview Deployment** thoroughly
4. **Code Review** by team members
5. **Merge** after approval and testing

### Preview Deployment Features

#### Automatic Updates

- **Live Sync** - Every commit to the PR branch updates the preview
- **Build Status** - GitHub shows build success/failure status
- **Comment Updates** - Vercel bot updates the PR comment with new preview links

#### Full Feature Parity

- **Complete Build** - Includes all optimizations and features
- **Real Data** - Uses actual content and images
- **Performance Testing** - Test loading speeds and optimization

#### Easy Cleanup

- **Automatic Removal** - Previews are automatically deleted when PR is closed
- **No Manual Cleanup** - No need to manually manage preview deployments
- **Resource Efficient** - Vercel handles all deployment lifecycle management

### Troubleshooting Preview Deployments

#### Common Issues

- **Build Failures** - Check the Vercel build logs for syntax errors
- **Missing Content** - Verify file paths and frontmatter syntax
- **Slow Loading** - Large images may need optimization
- **404 Errors** - Check that new content files follow naming conventions

#### Getting Help

- **Build Logs** - Check Vercel deployment logs for detailed error messages
- **GitHub Checks** - Review failed checks for specific issues
- **Local Testing** - Run `pnpm dev` locally to test changes before pushing

### Best Practices

#### Content Changes

- **Test Locally First** - Use `pnpm dev` to verify changes work correctly
- **Descriptive PR Titles** - Use clear titles like "Add artist: Name" or "Update course: Title"
- **Include Screenshots** - Add screenshots to PR description for visual changes

#### Code Changes

- **Small, Focused PRs** - Keep changes focused on a single feature or fix
- **Test All Scenarios** - Verify changes work across different content types

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
- **Update Images**: Add/replace files in artist folders with any filenames (they'll sort alphabetically)

## 📄 License and Copyright

This project uses a **dual licensing structure** to protect artist content while keeping the code open source:

### 🔓 Open Source Code (MIT License)

The source code, configuration files, and technical components are licensed under the MIT License. You are free to:

- Use the code as a template for your own projects
- Modify and distribute the code
- Create derivative works
- Use commercially

### 🔒 Protected Artist Content (All Rights Reserved)

All artist-related content is protected by copyright and **NOT** covered by the MIT license:

- **Artist images and artwork** (`public/assets/artists/`)
- **Artist profiles and information** (`content/artists/`)
- **Course descriptions** (`content/courses/`)
- **Event materials** (`content/agenda/`)

#### ❌ You MAY NOT:

- Copy, download, or reproduce artist images or artwork
- Use artist profiles or information in other projects
- Redistribute any artist content
- Use artist content commercially

#### ✅ You MAY:

- View content on the official website
- Link to the official website
- Reference artists with proper attribution

### Using This Code for Your Own Project

If you want to create your own artist community website:

1. **Fork or download** the source code (MIT licensed)
2. **Remove ALL existing artist content** before deployment
3. **Add your own content** with proper permissions from your artists
4. **Maintain this dual licensing structure** to protect your artists' rights

### Getting Permission for Artist Content

To use any artist content, you must:

1. Contact the individual artist directly (links in their profiles)
2. Obtain explicit written permission
3. Respect any terms set by the artist

For full details, see [`LICENSE`](LICENSE) and [`CONTENT_LICENSE`](CONTENT_LICENSE).

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
