---
title: Frequently Asked Questions
description: Answers to common questions about MarkStack features, capabilities, limitations, and best practices.
---

# Frequently Asked Questions

This page answers common questions about MarkStack. Questions are grouped by topic.

## General Questions

### What is MarkStack?

MarkStack is a static site generator designed for documentation and knowledge bases. It takes markdown files organized in folders and produces a complete static website with navigation, search, and a professional design.

### Is MarkStack free?

Yes, MarkStack is open source and free to use under the GPL-3.0 license. You can use it for personal projects, commercial documentation, internal wikis, and any other purpose.

### What makes MarkStack different from other static site generators?

MarkStack focuses on simplicity and speed:

- **Single-file build script**: No complex toolchain or build pipeline
- **Minimal dependencies**: Only essential packages, no framework overhead
- **Fast builds**: Typically under 200ms for most sites
- **Convention over configuration**: Works out of the box with sensible defaults
- **Modern features**: Dark/light themes, search, GitHub-style alerts

### Who should use MarkStack?

MarkStack is ideal for:

- Technical documentation
- Knowledge bases and wikis
- Project documentation
- Personal notes and references
- Any content organized hierarchically

### What are the system requirements?

- Node.js 18.0.0 or higher
- Any operating system (Windows, macOS, Linux)
- Approximately 50MB disk space for dependencies

## Content Questions

### What markdown features are supported?

MarkStack supports CommonMark markdown plus these extensions:

- Syntax-highlighted code blocks (190+ languages)
- GitHub-style task lists
- Tables
- Footnotes
- Auto-linked URLs
- Heading anchor links
- GitHub-style alerts (NOTE, TIP, WARNING, etc.)

See the [Markdown Features](/authoring/markdown-features/) page for complete documentation.

### Can I use HTML in my markdown?

Yes, raw HTML is allowed in markdown files. However, use markdown when possible for consistency and maintainability:

```markdown
This is **markdown** formatting.

<div class="custom">
  This is <strong>HTML</strong> formatting.
</div>
```

### How do I create a new page?

Create a new `.md` file in the `content/` directory:

```markdown
---
title: My New Page
description: A description for search and previews
---

# My New Page

Content goes here.
```

Run `npm run build` to generate the page.

### How do I create a new category?

Create a new folder in `content/` with an `_index.md` file:

```
content/
  my-category/
    _index.md       # Category page
    first-page.md   # Page in category
    second-page.md
```

The `_index.md` file defines the category title and description.

### Can I nest categories?

Yes, you can nest folders as deep as needed:

```
content/
  platform/
    aws/
      ec2/
        instances.md
        volumes.md
```

This creates the URL `/platform/aws/ec2/instances/`.

### How do I control page order in the sidebar?

Pages are sorted alphabetically by title. To control order, prefix your titles:

```yaml
---
title: 01 Introduction
---
```

Or use numbered filenames:

```
01-introduction.md
02-getting-started.md
03-configuration.md
```

Note that numbered filenames affect the URL unless you set a different title in frontmatter.

### How do I add images?

Place images in `static/images/` and reference them with absolute paths:

```markdown
![Alt text](/images/screenshot.png)
```

Or use external URLs:

```markdown
![Alt text](https://example.com/image.png)
```

### Can I embed videos?

Use HTML to embed videos:

```html
<video controls width="100%">
  <source src="/videos/demo.mp4" type="video/mp4">
</video>
```

Or embed from YouTube/Vimeo:

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
```

## Configuration Questions

### Where is the configuration file?

Site configuration is in `siteconfig.json` at the project root:

```json
{
  "siteTitle": "My Knowledge Base",
  "siteUrl": "https://docs.example.com",
  "defaultDescription": "Documentation for my project"
}
```

See [Site Configuration](/configuration/siteconfig/) for all options.

### How do I change the site title?

Edit `siteconfig.json`:

```json
{
  "siteTitle": "Your Site Name"
}
```

Rebuild to apply changes.

### How do I change the logo?

Replace `static/svg/logo.svg` with your own SVG file. Keep it at 32x32 pixels for best results.

### How do I add custom CSS?

Create `static/css/custom.css` with your styles, then add this to `templates/base.html`:

```html
<link rel="stylesheet" href="/css/custom.css">
```

Or add styles directly to `static/css/main.css`.

### How do I add analytics?

Add your analytics script to `templates/base.html` before the closing `</head>` tag:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Building and Deployment

### How do I build the site?

```bash
npm run build
```

The generated site is in the `dist/` folder.

### How do I preview locally?

```bash
npm run build
npx serve dist
```

Open `http://localhost:3000` in your browser.

### How do I enable live reload during development?

```bash
npm run watch
```

This rebuilds automatically when files change. Run `npx serve dist` in another terminal to view.

Note: You still need to manually refresh the browser. Full live reload requires additional setup.

### Where can I deploy MarkStack sites?

Anywhere that serves static files:

- **Recommended**: Netlify, Vercel, Cloudflare Pages, GitHub Pages
- **Self-hosted**: nginx, Apache, Caddy, any web server
- **Cloud storage**: AWS S3, Google Cloud Storage, Azure Blob Storage

See [Deployment](/build-deploy/deployment/) for detailed instructions.

### Does MarkStack support CI/CD?

Yes. Add a build step to your CI pipeline:

```yaml
- run: npm ci
- run: npm run build
```

See [CI/CD Integration](/build-deploy/ci-cd/) for GitHub Actions, GitLab CI, and other platforms.

## Customization Questions

### How do I change colors?

Edit CSS custom properties in `static/css/main.css`:

```css
[data-theme="dark"] {
  --color-accent: #ff5500;  /* Change accent color */
}
```

See [Themes and Styling](/customization/themes/) for all customization options.

### How do I change fonts?

1. Update the font link in `templates/base.html`
2. Update font variables in `static/css/main.css`:

```css
:root {
  --font-sans: 'Your Font', sans-serif;
}
```

### Can I use a different template?

MarkStack uses a single template at `templates/base.html`. You can modify this template to change the page structure.

### Can I add new markdown extensions?

Yes, by modifying `build.js`. Add markdown-it plugins:

```javascript
const myPlugin = require('markdown-it-myplugin');
md.use(myPlugin);
```

### How do I add a new alert type?

1. Add the icon to `alertIcons` in `build.js`
2. Add CSS for `.alert-yourtype` in `main.css`

See the existing alert implementations as examples.

## Search Questions

### How does search work?

MarkStack generates a JSON index at build time. When users search, JavaScript loads this index and performs client-side text matching. No server required.

### Can I exclude pages from search?

Not in the default build, but you can add this feature by modifying `build.js` to check for a frontmatter flag:

```yaml
---
title: Hidden Page
searchable: false
---
```

### Why are my search results not accurate?

The search uses substring matching. It finds pages containing the search terms, but does not have fuzzy matching or typo correction. Try:

- Using more specific terms
- Checking spelling
- Using terms that appear exactly in your content

### How large can the search index get?

The index grows with content. Typical sizes:

- 50 pages: ~100 KB
- 200 pages: ~400 KB
- 500 pages: ~1 MB

Enable gzip compression on your server to reduce transfer size.

## Performance Questions

### How fast are builds?

MarkStack builds are fast:

- 10 pages: ~50ms
- 50 pages: ~100ms
- 200 pages: ~300ms
- 500 pages: ~600ms

### Can MarkStack handle large sites?

Yes, but consider:

- Build time increases linearly with page count
- Search index size grows with content
- For 500+ pages, builds are still under 1 second

### How do I optimize page load speed?

1. Enable gzip/brotli compression on your server
2. Use a CDN for global distribution
3. Optimize images before adding them
4. Enable HTTP/2 on your server

## Limitations

### Does MarkStack support multiple languages (i18n)?

Not natively. For multilingual sites, you would need to:

- Create separate content folders (`content/en/`, `content/es/`)
- Modify the build script to handle multiple roots
- Or use separate builds for each language

### Can I have dynamic content?

No. MarkStack generates static HTML. For dynamic features, you would need to add client-side JavaScript or use a different tool.

### Does MarkStack have a plugin system?

Not formally. However, you can extend functionality by:

- Adding markdown-it plugins
- Modifying `build.js`
- Adding custom JavaScript in `static/js/`

### Can I use MarkStack for a blog?

MarkStack is designed for documentation, not blogging. It lacks:

- Date-based archives
- RSS feeds
- Author pages
- Tags/categories for posts

For blogs, consider Hugo, Jekyll, or 11ty.

### Does MarkStack support comments?

Not natively. You can integrate third-party comment systems (Disqus, Giscus, etc.) by adding their scripts to the template.
