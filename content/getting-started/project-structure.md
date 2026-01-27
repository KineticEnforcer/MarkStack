---
title: Project Structure
description: Complete guide to the MarkStack folder structure, explaining what each directory contains, which files you should edit, and how content transforms into your documentation site.
---

# Project Structure

Understanding the MarkStack folder structure helps you work confidently with the project. This guide explains every folder and key file, shows you what you should edit versus what is generated, and describes how files transform from source to output.

## Directory Overview

Here is the complete structure of a MarkStack project with explanations:

```
markstack/
├── build.js              # The static site generator (single file)
├── editor-server.js      # Visual editor server
├── editor.html           # Visual editor interface
├── siteconfig.json       # Site-wide configuration
├── package.json          # npm scripts and dependencies
├── package-lock.json     # Locked dependency versions
├── README.md             # Project documentation
├── LICENSE               # License file
│
├── content/              # YOUR CONTENT LIVES HERE
│   ├── _index.md         # Homepage content (optional)
│   ├── getting-started/  # A category folder
│   │   ├── _index.md     # Category landing page
│   │   ├── installation.md
│   │   ├── quickstart.md
│   │   └── project-structure.md
│   ├── authoring/        # Another category
│   │   ├── _index.md
│   │   ├── content-model.md
│   │   └── ... more pages
│   └── ... more categories
│
├── templates/
│   └── base.html         # HTML template with placeholders
│
├── static/               # Static assets (copied to dist/)
│   ├── css/
│   │   ├── main.css      # Main stylesheet
│   │   └── hljs-theme.css # Code syntax highlighting
│   ├── js/
│   │   └── app.js        # Client-side JavaScript
│   └── svg/
│       └── logo.svg      # Site logo
│
├── dist/                 # GENERATED OUTPUT (do not edit)
│   ├── index.html
│   ├── 404.html
│   ├── search-index.json
│   ├── css/
│   ├── js/
│   ├── svg/
│   └── ... generated pages
│
└── node_modules/         # npm packages (do not edit)
```

## What You Should Edit

These folders and files are your working areas. Changes you make here become your documentation site.

### content/

This is where all your documentation lives. Every markdown file you create here becomes a page on your site.

The folder structure directly determines your site's navigation:

```
content/
├── getting-started/      → Sidebar section: "Getting Started"
│   ├── _index.md         → Category landing page
│   ├── installation.md   → Page: "Installation"
│   └── quickstart.md     → Page: "Quickstart"
└── guides/               → Sidebar section: "Guides"
    ├── _index.md         → Category landing page
    └── advanced.md       → Page: "Advanced"
```

**Key files in content:**

| File | Purpose |
|------|---------|
| `_index.md` | Category landing page with title and description |
| `*.md` | Individual documentation pages |

### siteconfig.json

Controls site-wide settings like the title, description, and homepage behavior. Edit this file to brand your site:

```json
{
  "siteTitle": "My Documentation Site",
  "headerTitle": "MyDocs",
  "siteSubtitle": "Complete guides and references",
  "siteUrl": "https://docs.example.com",
  "defaultDescription": "Official documentation",
  "showHero": true,
  "copyrightText": "© 2024 Your Company"
}
```

### static/

Files here copy directly to `dist/` without processing. This is where you put:

- **CSS files** for styling (`static/css/`)
- **JavaScript files** for client-side behavior (`static/js/`)
- **Images** for content and branding (`static/images/` or `static/svg/`)
- **Downloadable files** like PDFs (`static/files/`)

When you reference these in markdown, use absolute paths:

```markdown
![Diagram](/images/architecture.png)
[Download PDF](/files/guide.pdf)
```

### templates/base.html

The HTML template that wraps every page. It contains placeholders that the build script replaces:

| Placeholder | Replaced With |
|-------------|--------------|
| `{{title}}` | Page title from frontmatter |
| `{{description}}` | Page description from frontmatter |
| `{{content}}` | Rendered markdown HTML |
| `{{sidebar}}` | Generated navigation tree |
| `{{breadcrumbs}}` | Generated breadcrumb links |
| `{{siteTitle}}` | Site title from siteconfig.json |
| `{{copyrightText}}` | Copyright from siteconfig.json |

Edit this file to:

- Add analytics scripts
- Include additional meta tags
- Modify the page layout
- Add custom header or footer elements

## What You Should Not Edit

These folders are generated or managed automatically. Editing them directly will cause your changes to be lost or create conflicts.

### dist/

This folder contains the generated website. Every time you run `npm run build`, the build script:

1. Deletes the previous contents
2. Generates fresh HTML from your content
3. Copies static assets

Any manual changes to `dist/` disappear on the next build. To change something in `dist/`, edit the source files in `content/`, `static/`, or `templates/` instead.

> [!IMPORTANT]
> Never edit files in `dist/` directly. Your changes will be overwritten on the next build.

### node_modules/

Contains npm packages installed by `npm install`. This folder is managed by npm and excluded from version control. If you need different packages, edit `package.json` and run `npm install`, but do not modify `node_modules/` directly.

## Understanding the Core Files

### build.js

The `build.js` file is the complete static site generator in a single file. You generally do not need to modify it for normal documentation work, but understanding what it does helps when troubleshooting:

| Section | Purpose |
|---------|---------|
| Dependencies | Loads required npm packages |
| Markdown configuration | Sets up markdown-it with extensions |
| Site configuration | Reads siteconfig.json |
| URL mapping | Creates title-based URLs from file paths |
| Navigation generation | Builds sidebar and breadcrumbs |
| Page rendering | Combines content with templates |
| Search indexing | Extracts plain text for client search |
| Build process | Orchestrates the complete pipeline |

Advanced users modify `build.js` to:

- Add new frontmatter fields
- Create new template placeholders
- Implement custom markdown extensions
- Change URL generation rules

### editor-server.js

The visual editor server that provides a browser-based markdown editing environment. It runs on port 3001 and offers:

- Real-time file management API
- Live markdown preview
- File tree navigation
- Save and build functionality

Start it with `npm run editor`. See [Visual Editor](/authoring/visual-editor/) for complete documentation.

### editor.html

The single-page application that provides the visual editor interface. It includes:

- Split-panel layout (file tree, editor, preview)
- Syntax highlighting for markdown
- Live preview with site styling
- Scroll synchronization between panels

## How Content Becomes Pages

Understanding the transformation from source to output helps you troubleshoot when things do not appear as expected.

### Step 1: You Create a Markdown File

You create `content/guides/setup.md`:

```markdown
---
title: Initial Setup
description: Configure your environment for first use.
---

# Initial Setup

Follow these steps to configure your environment.
```

### Step 2: Build Scans and Parses

When you run `npm run build`, the build script:

1. Finds `content/guides/setup.md`
2. Reads the frontmatter (`title: Initial Setup`)
3. Slugifies the title: "Initial Setup" becomes "initial-setup"
4. Records the URL: `/initial-setup/`

### Step 3: Markdown Converts to HTML

The markdown content transforms:

- Headers become `<h1>`, `<h2>`, etc. with anchor links
- Paragraphs become `<p>` tags
- Code blocks get syntax highlighting
- Alerts become styled callout boxes

### Step 4: Template Applies

The rendered HTML injects into `base.html`:

- `{{title}}` becomes "Initial Setup"
- `{{description}}` becomes "Configure your environment..."
- `{{content}}` becomes the rendered HTML
- `{{sidebar}}` becomes the navigation tree
- `{{breadcrumbs}}` becomes the breadcrumb links

### Step 5: Output Writes

The complete page writes to:

```
dist/initial-setup/index.html
```

The folder name comes from the slugified title. The `index.html` filename enables clean URLs where `/initial-setup/` loads the page without needing to specify `.html`.

## Content Model Summary

Understanding the content model helps you organize your documentation effectively.

### Categories

Categories are folders in `content/` that group related pages. Each category can have:

- `_index.md`: A landing page with a title and optional description
- Multiple `.md` files: Individual pages within the category
- Subcategories: Nested folders for further organization

```
content/
├── guides/              # Category
│   ├── _index.md        # Landing: "Guides"
│   ├── quick-start.md   # Page: "Quick Start"
│   └── advanced/        # Subcategory
│       ├── _index.md    # Landing: "Advanced"
│       └── plugins.md   # Page: "Plugins"
```

### Pages

Pages are markdown files that become documentation pages. They have:

- **Frontmatter**: YAML at the top with `title` and `description`
- **Content**: Markdown body rendered as HTML

### URLs

URLs generate from titles, not filenames:

| Frontmatter | Generated URL |
|-------------|--------------|
| `title: Quick Start` | `/quick-start/` |
| `title: API Reference` | `/api-reference/` |
| `title: Getting Started` | `/getting-started/` |

This means you can name your files however you want (`001-intro.md`, `first-steps.md`) and the URL will always be based on the human-readable title.

## Practical Examples

### Adding a New Category

1. Create a folder: `content/tutorials/`
2. Create the landing page: `content/tutorials/_index.md`

```markdown
---
title: Tutorials
description: Step-by-step tutorials for common tasks.
---

# Tutorials

Work through these tutorials to learn by doing.
```

3. Add a page: `content/tutorials/getting-started.md`

```markdown
---
title: Getting Started Tutorial
description: Your first tutorial to learn the basics.
---

# Getting Started Tutorial

Let's build something together.
```

4. Run `npm run build`
5. The sidebar now shows "Tutorials" with "Getting Started Tutorial" inside

### Adding an Image

1. Put the image in `static/images/diagram.png`
2. Reference it in markdown:

```markdown
![Architecture diagram](/images/diagram.png)
```

3. Run `npm run build`
4. The image appears at `/images/diagram.png` in the output

### Customizing the Site Logo

1. Replace `static/svg/logo.svg` with your own SVG
2. Run `npm run build`
3. Your logo appears in the site header

> [!TIP]
> Keep the logo at 32x32 pixels for best results in the header. Larger logos may need CSS adjustments.

## Next Steps

You now understand the MarkStack project structure. Continue to [Authoring Content](/authoring/) to learn how to write effective documentation with all the markdown features MarkStack supports.
