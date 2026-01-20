---
title: Commands Reference
description: Complete reference for all MarkStack npm commands including build, watch, clean, and serve options with examples and use cases.
---

# Commands Reference

MarkStack provides a set of npm scripts for building, developing, and previewing your site. This page documents each command in detail.

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Build the site for production |
| `npm run watch` | Build and rebuild on file changes |
| `npm run clean` | Delete the dist folder |
| `npx serve dist` | Preview the built site locally |

## npm run build

The `build` command generates your complete site in the `dist/` folder.

### Usage

```bash
npm run build
```

### What It Does

1. Clears any existing `dist/` folder
2. Copies all files from `static/` to `dist/`
3. Builds the URL map from content titles
4. Processes every markdown file in `content/`
5. Generates HTML pages using the template
6. Creates the homepage and 404 page
7. Generates `search-index.json` for search functionality

### Output

```
🔨 Building MarkStack...

✓ Copied static files

✓ Generated: /getting-started/
✓ Generated: /getting-started/installation/
✓ Generated: /getting-started/quickstart/
✓ Generated: /authoring/
✓ Generated: /authoring/markdown-features/
...
✓ Generated: / (homepage)
✓ Generated: /404.html
✓ Generated: /search-index.json (42 pages)

✅ Build complete in 127ms
📁 Output: C:\Users\...\MarkStack\dist
```

### When to Use

- Before deploying to production
- After making content changes you want to preview
- To generate a clean build for testing

## npm run watch

The `watch` command builds the site and then watches for file changes, automatically rebuilding when you save.

### Usage

```bash
npm run watch
```

### What It Does

1. Performs an initial build (same as `npm run build`)
2. Watches the following directories for changes:
   - `content/` - Markdown files
   - `static/` - CSS, JavaScript, images
   - `templates/` - HTML templates
3. When a file changes, rebuilds the entire site

### Output

```
👀 Watching for changes...

🔨 Building MarkStack...

✓ Copied static files
✓ Generated: /getting-started/
...
✅ Build complete in 127ms

📝 Changed: content\authoring\examples.md

🔨 Building MarkStack...
...
✅ Build complete in 132ms
```

### When to Use

- During content development
- When writing or editing documentation
- When adjusting styles or templates

> [!TIP]
> Run `npm run watch` in one terminal and `npx serve dist` in another. As you save files, the site rebuilds automatically and you can refresh your browser to see changes.

### File Watching Details

The watcher uses chokidar, a reliable cross-platform file watching library. It detects:

- File modifications (content changes)
- File additions (new pages)
- File deletions (removed pages)

Each detected change triggers a full rebuild to ensure navigation and search index stay current.

## npm run clean

The `clean` command removes the `dist/` folder entirely.

### Usage

```bash
npm run clean
```

### What It Does

Deletes the `dist/` directory and all its contents recursively.

### Output

The command runs silently. To verify:

```bash
npm run clean
ls dist  # Should show "dist does not exist" or similar error
```

### When to Use

- Before a fresh build to ensure no stale files
- When troubleshooting build issues
- To reduce folder size before archiving the project

Note: The `build` command already clears `dist/` before building, so `clean` is optional in most workflows.

## npx serve dist

The `serve` command runs a local HTTP server to preview your built site.

### Usage

```bash
npx serve dist
```

### What It Does

Starts a static file server using the `serve` package, hosting the contents of `dist/` at `http://localhost:3000`.

### Output

```
   ┌─────────────────────────────────────────┐
   │                                         │
   │   Serving!                              │
   │                                         │
   │   - Local:    http://localhost:3000     │
   │   - Network:  http://192.168.1.50:3000  │
   │                                         │
   └─────────────────────────────────────────┘
```

### Options

Specify a different port:

```bash
npx serve dist -l 8080
```

Disable directory listing:

```bash
npx serve dist --no-clipboard
```

### When to Use

- To preview the site before deployment
- To test on mobile devices (use the network URL)
- To verify the production build works correctly

### Alternative: Python Server

If you have Python installed:

```bash
cd dist
python -m http.server 3000
```

### Alternative: VS Code Live Server

If you use VS Code, you can right-click `dist/index.html` and select "Open with Live Server" (requires the Live Server extension).

## Combined Development Workflow

For active development, use two terminal windows:

### Terminal 1: Watch Mode

```bash
npm run watch
```

Keep this running. It rebuilds automatically when you save files.

### Terminal 2: Local Server

```bash
npx serve dist
```

Open `http://localhost:3000` in your browser. Refresh after saves to see changes.

### Workflow Steps

1. Start watch mode in terminal 1
2. Start server in terminal 2
3. Open browser to localhost:3000
4. Edit markdown files in your editor
5. Save the file
6. Wait for rebuild message in terminal 1
7. Refresh browser to see changes
8. Repeat steps 4-7

## Build Script Internals

The build process is handled by `build.js`, a single-file static site generator. Key stages:

### 1. URL Map Generation

Scans all content and builds a mapping from file paths to URL slugs based on page titles.

### 2. Markdown Processing

Uses markdown-it with plugins:
- `markdown-it-anchor` for heading links
- `markdown-it-footnote` for footnotes
- `markdown-it-task-lists` for checkboxes
- Custom plugin for GitHub-style alerts

### 3. Navigation Building

Builds the sidebar tree and breadcrumbs by walking the directory structure.

### 4. Template Application

Replaces placeholders in `templates/base.html` with generated content.

### 5. Search Index

Creates a JSON file with page titles, URLs, and plain-text content for client-side search.

## Troubleshooting

### Build Fails with "Cannot find module"

Dependencies are not installed:

```bash
npm install
npm run build
```

### Watch Mode Does Not Detect Changes

Chokidar may have issues with certain file systems. Try:

```bash
# Stop watch mode (Ctrl+C)
npm run build  # Manual build
```

### Port Already in Use

If port 3000 is taken:

```bash
npx serve dist -l 8080
```

Or find and stop the process using port 3000.

### Changes Not Appearing

1. Verify the file saved (check editor)
2. Check terminal for rebuild confirmation
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear browser cache

> [!NOTE]
> The build script clears and regenerates `dist/` on every build. Any manual changes to files in `dist/` will be overwritten.
