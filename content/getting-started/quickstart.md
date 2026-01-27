---
title: Quickstart
description: Learn the MarkStack development workflow with step-by-step instructions for building, watching, and previewing your documentation site locally.
---

# Quickstart

This guide teaches you the development workflow you will use every time you work on your MarkStack documentation. By the end, you will know how to build your site, preview it locally, and set up automatic rebuilds that make authoring fast and fluid.

## Understanding the Build Process

When you run a build, MarkStack performs these steps:

1. Reads all markdown files from the `content/` folder
2. Parses YAML frontmatter to extract titles and descriptions
3. Converts markdown to HTML with syntax highlighting and GitHub-style features
4. Generates sidebar navigation from the folder structure
5. Creates a search index containing all page content
6. Copies static files (CSS, JavaScript, images) to the output
7. Writes everything to the `dist/` folder as static HTML

The entire process typically completes in under 100 milliseconds.

## Running a One-Time Build

The simplest way to generate your site is a one-time build:

```bash
npm run build
```

This command generates the complete site and then exits. You will see output showing each page being generated:

```
🔨 Building MarkStack...

✓ Copied static files

✓ Generated: /getting-started/
✓ Generated: /getting-started/installation/
✓ Generated: /getting-started/quickstart/
✓ Generated: /getting-started/project-structure/
✓ Generated: /authoring/
... (additional pages)
✓ Generated: / (homepage)
✓ Generated: /404.html
✓ Generated: /search-index.json (28 pages)

✅ Build complete in 92ms
📁 Output: C:\projects\markstack\dist
```

A one-time build is useful for:

- Verifying your environment works correctly
- Generating the final site before deployment
- Troubleshooting when you want a completely fresh build

## Previewing Your Site Locally

After building, you need a web server to view the site properly. Opening the HTML files directly in a browser will not work correctly because the site uses absolute paths for CSS, JavaScript, and links.

Start the built-in preview server:

```bash
npm run serve
```

The server starts and displays the local URL:

```
Serving!

- Local:   http://localhost:3000
- Network: http://192.168.1.100:3000
```

Open `http://localhost:3000` in your browser. You should see your documentation site with:

- The header with site title and search
- The sidebar navigation showing your content structure
- The main content area with the current page
- Working links between pages
- Functional search (type in the search box or press Ctrl+K)
- Theme toggle switching between dark and light modes

Press `Ctrl+C` in the terminal to stop the server when you are finished.

## The Live Authoring Workflow

For the best authoring experience, use two terminals: one running watch mode and one running the preview server. This setup automatically rebuilds your site whenever you save a file.

### Terminal 1: Watch Mode

Open a terminal and start watch mode:

```bash
npm run watch
```

Watch mode does an initial build and then monitors for changes:

```
👀 Watching for changes...

🔨 Building MarkStack...

✓ Copied static files
... (build output)
✅ Build complete in 89ms
```

The terminal now waits. Whenever you save a file in `content/`, `static/`, or `templates/`, watch mode detects the change and rebuilds:

```
📝 Changed: content/getting-started/quickstart.md

🔨 Building MarkStack...
... (build output)
✅ Build complete in 76ms
```

Leave this terminal running while you work.

### Terminal 2: Preview Server

Open a second terminal and start the preview server:

```bash
npm run serve
```

Now you have the complete workflow:

1. Edit a markdown file in your text editor
2. Save the file
3. Watch mode detects the change and rebuilds (usually under 100ms)
4. Refresh your browser to see the updated page

### Setting Up Your Workspace

The ideal authoring setup has three windows visible:

| Window | Purpose |
|--------|---------|
| Text editor | Edit markdown files |
| Terminal with watch | See rebuild confirmations and any errors |
| Browser | Preview the rendered documentation |

Many developers arrange these side by side or use multiple monitors. VS Code users can use the integrated terminal and live preview extensions.

## Performing a Clean Build

Sometimes you want to start fresh, especially after:

- Pulling changes from version control
- Deleting content files (the old generated files might remain)
- Encountering strange rendering issues

To clean and rebuild:

```bash
npm run clean
npm run build
```

The `clean` command deletes the entire `dist/` folder. The subsequent `build` generates everything from scratch.

You can also combine these into a single command:

```bash
npm run clean && npm run build
```

## Verifying Your Setup

After completing the quickstart, verify everything works correctly:

### Check the dist folder

Your `dist/` folder should contain:

```
dist/
  index.html              # Homepage
  404.html                # Error page
  search-index.json       # Search data
  css/
    main.css              # Styles
    hljs-theme.css        # Code highlighting
  js/
    app.js                # Client-side functionality
  svg/
    logo.svg              # Site logo
  getting-started/        # Section folder
    index.html            # Section landing page
    installation/
      index.html          # Page
    quickstart/
      index.html
    project-structure/
      index.html
  ... (more sections)
```

### Verify the preview

With `npm run serve` running, check that:

- The homepage loads without errors (check browser developer console)
- CSS loads properly (the page should be styled, not plain HTML)
- JavaScript loads properly (theme toggle and search should work)
- Sidebar navigation shows your content structure
- Clicking links navigates to the correct pages
- Search finds content when you type keywords

### Test watch mode

With `npm run watch` running:

1. Open any markdown file in `content/`
2. Make a small change (add a word to a paragraph)
3. Save the file
4. Check the terminal shows a rebuild completed
5. Refresh the browser and verify the change appears

## Common Workflows

### Writing new documentation

```bash
# Start the development environment
npm run watch   # Terminal 1
npm run serve   # Terminal 2

# Create a new markdown file in content/
# Edit and save
# Refresh browser to see results
```

### Preparing for deployment

```bash
# Clean build for production
npm run clean
npm run build

# Verify locally before deploying
npm run serve
# Check a few pages, then Ctrl+C to stop

# Deploy the dist/ folder to your host
```

### After pulling from Git

```bash
# Update dependencies if package.json changed
npm install

# Clean build to pick up all changes
npm run clean
npm run build
```

## What to Edit First

Now that your environment works, here are good first customizations:

### Site identity (siteconfig.json)

Set your site's title, subtitle, and other branding:

```json
{
  "siteTitle": "My Documentation",
  "headerTitle": "MyDocs",
  "siteSubtitle": "Everything you need to know",
  "siteUrl": "https://docs.example.com"
}
```

### Homepage content (content/_index.md)

Write a welcoming homepage introduction:

```markdown
---
description: Welcome to our documentation portal.
---

# Welcome

Start exploring our documentation using the sidebar navigation.
```

### Your first custom page

Create a new file in `content/` to see the full workflow in action. For example, create `content/getting-started/my-first-page.md`:

```markdown
---
title: My First Page
description: Testing that everything works.
---

# My First Page

This is my first page in MarkStack!
```

Save the file. Watch mode rebuilds. Refresh the browser. Your new page appears in the sidebar.

> [!TIP]
> Keep your terminals visible while authoring. When you save a file and nothing happens in the watch terminal, check that you saved to the correct location. When the build succeeds but the browser shows old content, try a hard refresh (Ctrl+Shift+R).

## Alternative: Visual Editor

If you prefer a more integrated writing experience, MarkStack includes a visual editor with live preview:

```bash
npm run editor
```

This opens a browser-based editor at `http://localhost:3001` with:

- **File tree** for navigating your content
- **Markdown editor** with syntax highlighting
- **Live preview** styled exactly like your final site
- **Scroll sync** to keep editor and preview aligned
- **Save and build** buttons with keyboard shortcuts

The visual editor is ideal for focused writing sessions where you want immediate feedback on how your content will appear. For complete documentation, see [Visual Editor](/authoring/visual-editor/).

## Next Steps

You now know the MarkStack development workflow. Continue to [Project Structure](/getting-started/project-structure/) to understand which folders contain your content and which are generated.
