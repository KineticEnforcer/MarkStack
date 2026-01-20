---
title: Content Model
description: Complete explanation of how MarkStack organizes documentation into categories and pages, generates URLs from titles, and builds navigation from your folder structure.
---

# Content Model

The content model defines how MarkStack transforms your markdown files into a structured documentation website. Understanding this model helps you organize content effectively and predict how changes will appear on your site.

## Core Concepts

MarkStack uses a simple but powerful organizational model:

| Concept | Definition | Example |
|---------|------------|---------|
| **Category** | A folder in `content/` that groups related pages | `content/guides/` |
| **Page** | A markdown file that becomes a documentation page | `content/guides/setup.md` |
| **Landing Page** | The `_index.md` file that introduces a category | `content/guides/_index.md` |
| **Slug** | The URL-safe version of a title | "Getting Started" becomes `getting-started` |

## Categories

Categories are folders inside the `content/` directory. They serve two purposes:

1. **Organization**: Group related documentation together
2. **Navigation**: Appear as expandable sections in the sidebar

### Creating a Category

To create a category, make a folder inside `content/` and add an `_index.md` file:

```
content/
└── guides/
    └── _index.md
```

The `_index.md` file is the category landing page. It provides the category title and optional description:

```markdown
---
title: Guides
description: Step-by-step tutorials for common tasks.
---

# Guides

Welcome to the guides section. These tutorials walk you through 
common tasks from start to finish.
```

When someone clicks the "Guides" section in the sidebar, they see this landing page.

### Category Behavior

Without an `_index.md` file, MarkStack still creates a category from the folder, but:

- The title comes from the folder name (with formatting applied)
- There is no landing page content
- The description uses the site default

For example, a folder named `getting-started/` without an `_index.md` would appear in navigation as "Getting Started" but would have an empty landing page.

> [!TIP]
> Always create an `_index.md` for each category. It gives you control over the title and provides a place to introduce the section and guide readers to the right pages.

### Nested Categories

Categories can nest to any depth. Each level needs its own `_index.md`:

```
content/
└── api/
    ├── _index.md           # API landing page
    ├── authentication.md   # API > Authentication page
    └── endpoints/
        ├── _index.md       # API > Endpoints landing page
        ├── users.md        # API > Endpoints > Users page
        └── orders.md       # API > Endpoints > Orders page
```

The sidebar shows this as an expandable tree. Breadcrumbs show the full path (Home / API / Endpoints / Users).

## Pages

Pages are markdown files inside categories. Every `.md` file except `_index.md` becomes a documentation page.

### Creating a Page

Create a markdown file inside a category folder:

```
content/
└── guides/
    ├── _index.md
    └── installation.md
```

The page content follows the standard structure:

```markdown
---
title: Installation Guide
description: How to install and configure the software.
---

# Installation Guide

This guide walks through the installation process step by step.

## Prerequisites

Before you begin, make sure you have:

- Operating system: Windows 10+, macOS 10.14+, or Ubuntu 18.04+
- Disk space: At least 500 MB free
- Administrator access to your machine

## Step 1: Download

Download the installer from our releases page...
```

### Page Titles

Page titles come from two possible sources, in order of priority:

1. **Frontmatter `title` field** (recommended)
2. **Filename** (fallback)

If you have a file named `quick-start.md` with this frontmatter:

```yaml
---
title: Quick Start Guide
---
```

The page title is "Quick Start Guide" (from frontmatter), not "Quick Start" (from filename).

If the same file had no frontmatter:

```markdown
# Quick Start

Content here...
```

The title would be "Quick Start" (derived from the filename `quick-start.md`).

> [!IMPORTANT]
> Always set the `title` in frontmatter. This gives you full control over the navigation label, page title, and URL generation.

### Page Descriptions

The `description` frontmatter field serves multiple purposes:

- Appears in the HTML `<meta name="description">` tag for SEO
- Used in search result snippets
- Can appear in Open Graph tags for social sharing

Write descriptions that:

- Summarize what the page covers in 150 to 160 characters
- Include relevant keywords naturally
- Help readers decide if this page answers their question

## URLs and Slugs

MarkStack generates URLs from titles using a process called "slugification."

### How Slugification Works

The `slugify` function transforms titles into URL-safe strings:

1. Convert to lowercase
2. Replace spaces with hyphens
3. Remove special characters (except hyphens)
4. Collapse multiple hyphens into one
5. Remove leading and trailing hyphens

| Original Title | Resulting Slug |
|----------------|----------------|
| Getting Started | `getting-started` |
| Installation Guide | `installation-guide` |
| API Reference | `api-reference` |
| Quick Start! | `quick-start` |
| The "Best" Practices | `the-best-practices` |
| C++ Programming | `c-programming` |

### URL Structure

URLs follow the category hierarchy with the page slug at the end:

```
/category-slug/page-slug/
```

For nested categories:

```
/category-slug/subcategory-slug/page-slug/
```

### Complete URL Examples

Given this content structure:

```
content/
├── _index.md                        → /
├── getting-started/
│   ├── _index.md (title: Getting Started)  → /getting-started/
│   ├── installation.md (title: Installation)  → /installation/
│   └── quickstart.md (title: Quick Start)     → /quick-start/
└── guides/
    ├── _index.md (title: Guides)              → /guides/
    └── advanced/
        ├── _index.md (title: Advanced Topics) → /advanced-topics/
        └── performance.md (title: Performance Tuning) → /performance-tuning/
```

Notice that URLs are based on the title slug, not the file path. The file `getting-started/quickstart.md` with `title: Quick Start` generates the URL `/quick-start/`, not `/getting-started/quickstart/`.

### URL Stability

Because URLs derive from titles, changing a title changes the URL. This can break links from:

- Other pages in your documentation
- External websites
- Search engine results
- Bookmarks

> [!WARNING]
> Changing a page title changes its URL. If the page has been published, add a redirect at your hosting provider to avoid broken links.

## Navigation

MarkStack generates two navigation elements from your content structure: the sidebar and breadcrumbs.

### Sidebar

The sidebar shows the complete content tree. It displays:

- All categories as expandable folders
- All pages as clickable links
- The current page highlighted
- Parent folders of the current page automatically expanded

Sidebar items sort alphabetically by title at each level. A structure like:

```
content/
├── architecture/
│   └── _index.md (title: Architecture)
├── authoring/
│   └── _index.md (title: Authoring Content)
├── build-deploy/
│   └── _index.md (title: Build & Deploy)
└── getting-started/
    └── _index.md (title: Getting Started)
```

Appears in the sidebar as:

1. Architecture
2. Authoring Content
3. Build & Deploy
4. Getting Started

### Controlling Sort Order

If you need pages in a specific order, you have several options:

**Option 1: Number prefixes in titles**

```yaml
---
title: 1. Introduction
---
```

This approach keeps numbers visible in navigation.

**Option 2: Descriptive names that sort naturally**

Choose titles that alphabetically sort in your desired order:

- "A. Overview" comes before "B. Configuration"
- "First Steps" comes before "Next Steps"

**Option 3: Accept alphabetical order**

For many documentation sites, alphabetical order works fine. Readers can scan for the topic they need.

### Breadcrumbs

Breadcrumbs show the path from the homepage to the current page. They help readers understand where they are in the documentation hierarchy and navigate upward.

For a page at `content/guides/advanced/performance.md`:

```
Home / Guides / Advanced Topics / Performance Tuning
```

Each breadcrumb segment is clickable, linking to:

- Home: The homepage (`/`)
- Guides: The category landing page (`/guides/`)
- Advanced Topics: The subcategory landing (`/advanced-topics/`)
- Performance Tuning: The current page (not clickable)

## Practical Organization Tips

### Small Documentation Projects

For projects with fewer than 20 pages, a flat structure works well:

```
content/
├── _index.md
├── getting-started/
│   ├── _index.md
│   ├── installation.md
│   └── configuration.md
├── usage/
│   ├── _index.md
│   ├── basic-usage.md
│   └── advanced-usage.md
└── reference/
    ├── _index.md
    └── api.md
```

### Large Documentation Projects

For projects with many pages, use subcategories and clear naming:

```
content/
├── getting-started/
│   ├── _index.md
│   └── ... (beginner content)
├── guides/
│   ├── _index.md
│   ├── tutorials/
│   │   ├── _index.md
│   │   └── ... (tutorials)
│   └── how-to/
│       ├── _index.md
│       └── ... (how-to guides)
├── reference/
│   ├── _index.md
│   ├── api/
│   │   ├── _index.md
│   │   └── ... (API docs)
│   └── configuration/
│       ├── _index.md
│       └── ... (config reference)
└── troubleshooting/
    ├── _index.md
    └── ... (troubleshooting)
```

### Draft Content

MarkStack does not have built-in draft support, but you can implement it with a simple pattern:

**Option 1: Separate folder**

Keep drafts outside `content/` in a `drafts/` folder. Move files to `content/` when ready to publish.

**Option 2: Underscore prefix**

Name draft files with a leading underscore (`_draft-page.md`). The build includes them, but you can use `.gitignore` to exclude them from version control until ready.

**Option 3: Separate branch**

Work on draft content in a Git branch. Merge to main when ready to publish.

> [!TIP]
> For most projects, the separate folder approach is simplest. Keep `drafts/` at the project root, work on content there, and move files to `content/` when they are ready.
