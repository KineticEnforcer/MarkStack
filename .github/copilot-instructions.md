# MarkStack - AI Coding Instructions

## Project Overview
MarkStack is a static site generator for markdown-based knowledge bases. It transforms markdown content in `content/` into a fully searchable documentation website in `dist/`.

## Architecture

### Build Pipeline (`build.js`)
1. **URL Mapping**: Scans `content/` and builds a URL map converting file paths to title-based URLs via `slugify()`
2. **Markdown Processing**: Uses `markdown-it` with highlight.js for syntax highlighting and custom GitHub-style alerts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, etc.)
3. **Navigation Generation**: Builds sidebar tree and breadcrumbs from directory structure
4. **Search Index**: Generates `dist/search-index.json` with plain-text content for client-side search
5. **Output**: Writes HTML to `dist/` with clean URLs (each page → `dist/<slug>/index.html`)

### Key Files
- [build.js](../build.js) - Single-file SSG, handles all build logic
- [templates/base.html](../templates/base.html) - Main HTML template with `{{placeholder}}` syntax
- [siteconfig.json](../siteconfig.json) - Site metadata (title, URL, copyright)
- [static/js/app.js](../static/js/app.js) - Client-side: theme toggle, sidebar, search

## Content Structure

### Directory Layout
```
content/
  linux/               # Category folder
    _index.md          # Category page (required for custom title/description)
    kernel/            # Subcategory
      _index.md
      headers.md       # Article page
```

### Frontmatter Schema
```yaml
---
title: Page Title           # Optional - derived from filename if omitted
description: SEO description # Used in meta tags and category listings
---
```

### GitHub-Style Alerts
Use blockquote syntax for callouts:
```markdown
> [!NOTE]
> Informational note

> [!TIP]
> Helpful suggestion

> [!IMPORTANT]
> Critical information

> [!WARNING]
> Potential issues

> [!CAUTION]
> Dangerous actions
```

## Developer Commands
```bash
npm run build    # One-time build → dist/
npm run watch    # Rebuild on file changes (uses chokidar)
npm run clean    # Delete dist/ directory
npx serve dist   # Local preview at http://localhost:3000
```

## Conventions

### URL Generation
URLs are derived from frontmatter `title` or filename via `slugify()`:
- `Kernel Headers` → `/kernel-headers/`
- Folder URLs end with `/`, article URLs do not in the map but output as `/slug/index.html`

### Template Placeholders
Use double-braces in `base.html`: `{{title}}`, `{{content}}`, `{{sidebar}}`, `{{breadcrumbs}}`, `{{siteTitle}}`, `{{description}}`, `{{url}}`, `{{copyrightText}}`

### Adding New Alert Types
Extend `alertIcons` object in `build.js` with SVG, then add CSS for `.alert-{type}` in `main.css`

## Common Tasks

### Add a New Category
1. Create `content/<category-name>/_index.md` with frontmatter
2. Run `npm run build`

### Modify Site Metadata
Edit `siteconfig.json` - changes apply on next build

### Customize Styling
- Theme colors: CSS custom properties in `static/css/main.css` under `[data-theme="dark"]` and `[data-theme="light"]`
- Code highlighting: `static/css/hljs-theme.css`
