---
title: Build Pipeline
description: Understand how MarkStack processes markdown files, renders content, applies templates, and generates the final static site.
---

# Build Pipeline

The build pipeline is the core of MarkStack. It takes markdown files as input and produces a complete static website as output. This page explains each stage of the process in detail.

## Pipeline Stages

The build process runs through seven distinct stages:

1. **Initialization**: Clear output, copy static files
2. **URL Mapping**: Scan content and build URL lookup table
3. **Content Processing**: Parse and render each markdown file
4. **Navigation Generation**: Build sidebar and breadcrumbs
5. **Template Application**: Inject content into HTML template
6. **Special Pages**: Generate homepage and 404 page
7. **Search Index**: Create JSON index for client-side search

## Stage 1: Initialization

```javascript
// Clear dist directory
if (fs.existsSync(CONFIG.distDir)) {
  fs.rmSync(CONFIG.distDir, { recursive: true });
}
ensureDir(CONFIG.distDir);

// Copy static files
if (fs.existsSync(CONFIG.staticDir)) {
  copyDir(CONFIG.staticDir, CONFIG.distDir);
}
```

The build always starts fresh. The `dist/` folder is deleted and recreated, ensuring no stale files remain from previous builds. Static assets (CSS, JavaScript, images) are copied unchanged.

## Stage 2: URL Mapping

Before processing content, MarkStack scans all markdown files to build a URL map. This map connects file paths to their final URLs.

```javascript
const urlMap = new Map();

function buildUrlMap() {
  // Scan content directory recursively
  function scanDirectory(dirPath, parentSlugPath = '') {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Read _index.md to get folder title
        // Generate slug from title
        // Map directory path to URL
        // Recurse into subdirectory
      } else if (entry.name.endsWith('.md')) {
        // Read frontmatter for page title
        // Generate slug from title
        // Map file path to URL
      }
    }
  }
  
  scanDirectory(CONFIG.contentDir);
}
```

### URL Generation

URLs are generated from page titles using the `slugify()` function:

```javascript
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')           // Spaces to hyphens
    .replace(/-+/g, '-')            // Multiple hyphens to single
    .replace(/^-|-$/g, '');         // Trim leading/trailing hyphens
}
```

Examples:
- "Getting Started" becomes `getting-started`
- "Markdown Features" becomes `markdown-features`
- "CI/CD Integration" becomes `cicd-integration`

The URL map ensures internal links can resolve correctly and navigation URLs match page URLs.

## Stage 3: Content Processing

Each markdown file goes through the `processMarkdownFile()` function:

```javascript
function processMarkdownFile(filePath) {
  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Parse frontmatter and markdown body
  const { data: frontmatter, content: markdownContent } = matter(content);
  
  // Extract or derive title
  const title = getTitle(filePath, frontmatter);
  
  // Get URL from map
  const urlPath = getUrlPath(filePath);
  
  // Build navigation context
  const nav = buildNavigationTree(filePath, urlPath);
  
  // Render markdown to HTML
  const htmlContent = md.render(markdownContent);
  
  return {
    title,
    description: frontmatter.description || CONFIG.defaultDescription,
    content: htmlContent,
    urlPath,
    breadcrumbs: nav.breadcrumbs,
    sidebar: nav.sidebar,
    frontmatter
  };
}
```

### Markdown Rendering

MarkStack uses markdown-it with several plugins:

```javascript
const md = require('markdown-it')({
  html: true,       // Allow raw HTML in markdown
  linkify: true,    // Auto-link URLs
  typographer: true // Smart quotes and dashes
});

// Add anchor links to headings
md.use(require('markdown-it-anchor'), {
  permalink: anchor.permalink.ariaHidden({
    placement: 'before',
    symbol: '#',
    class: 'heading-anchor'
  })
});

// Add footnote support
md.use(require('markdown-it-footnote'));

// Add task list support
md.use(require('markdown-it-task-lists'));
```

### Syntax Highlighting

Code blocks are highlighted using highlight.js:

```javascript
highlight: function (str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return '<pre class="hljs" data-language="' + lang + '"><code>' +
        hljs.highlight(str, { language: lang }).value +
        '</code></pre>';
    } catch (err) {
      // Fall through to plain text
    }
  }
  return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
}
```

### GitHub-Style Alerts

A custom markdown-it plugin transforms blockquotes starting with alert markers:

```javascript
md.core.ruler.after('block', 'github-alerts', function(state) {
  const tokens = state.tokens;
  
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === 'blockquote_open') {
      // Find inline content
      // Check for [!NOTE], [!TIP], etc.
      // Add alert classes and icon
      // Remove marker from content
    }
  }
});
```

Input:
```markdown
> [!WARNING]
> This is a warning message.
```

Output:
```html
<blockquote class="alert alert-warning">
  <span class="alert-title">
    <span class="alert-icon"><!-- SVG --></span>
    WARNING
  </span>
  <p>This is a warning message.</p>
</blockquote>
```

## Stage 4: Navigation Generation

Navigation is built from the directory structure.

### Sidebar Tree

The `buildFullNavTree()` function walks the content directory and creates a nested structure:

```javascript
function buildFullNavTree(dirPath, currentUrlPath) {
  const items = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  // Separate folders and files
  const folders = [];
  const files = [];
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Get folder title from _index.md
      // Build children recursively
      folders.push({
        type: 'folder',
        title: folderTitle,
        url: folderUrl,
        expanded: currentUrlPath.startsWith(folderUrl),
        children: buildFullNavTree(entryPath, currentUrlPath)
      });
    } else if (entry.name.endsWith('.md') && entry.name !== '_index.md') {
      files.push({
        type: 'file',
        title: pageTitle,
        url: fileUrl,
        current: fileUrl === currentUrlPath
      });
    }
  }
  
  // Sort alphabetically by title
  folders.sort((a, b) => a.title.localeCompare(b.title));
  files.sort((a, b) => a.title.localeCompare(b.title));
  
  return [...folders, ...files];
}
```

### Breadcrumbs

Breadcrumbs are built by walking up from the current file to the root:

```javascript
function buildNavigationTree(filePath, urlPath) {
  const nav = {
    breadcrumbs: [],
    sidebar: buildFullNavTree(CONFIG.contentDir, urlPath)
  };
  
  // Start with Home
  nav.breadcrumbs.push({ title: 'Home', url: '/' });
  
  // Walk up directory tree
  const pathParts = relativePath.split('/').filter(Boolean);
  for (const part of pathParts) {
    // Get directory or file title
    // Get URL from urlMap
    // Add to breadcrumbs
  }
  
  return nav;
}
```

## Stage 5: Template Application

The `generatePage()` function replaces placeholders in the template:

```javascript
function generatePage(processed) {
  const template = readTemplate('base');
  
  let html = template
    .replace(/\{\{siteTitle\}\}/g, CONFIG.headerTitle)
    .replace(/\{\{title\}\}/g, processed.title)
    .replace(/\{\{description\}\}/g, processed.description)
    .replace(/\{\{url\}\}/g, CONFIG.siteUrl + processed.urlPath)
    .replace(/\{\{breadcrumbs\}\}/g, renderBreadcrumbs(processed.breadcrumbs))
    .replace(/\{\{sidebar\}\}/g, renderSidebar(processed.sidebar))
    .replace(/\{\{pageClass\}\}/g, processed.isHomepage ? ' is-homepage' : '')
    .replace(/\{\{copyrightText\}\}/g, CONFIG.copyrightText)
    .replace(/\{\{content\}\}/g, processed.content);
  
  return html;
}
```

### Sidebar HTML Rendering

The sidebar tree is converted to HTML recursively:

```javascript
function renderSidebar(sidebar, level = 0) {
  let html = '<ul class="sidebar-list sidebar-level-' + level + '">\n';
  
  for (const item of sidebar) {
    const classes = ['sidebar-item', 'sidebar-' + item.type];
    if (item.current) classes.push('sidebar-current');
    if (item.expanded) classes.push('sidebar-expanded');
    
    if (item.type === 'folder') {
      html += '<li class="' + classes.join(' ') + '">';
      html += '<div class="sidebar-folder-header">';
      // Toggle button with chevron
      // Link with folder icon
      html += '</div>';
      html += '<div class="sidebar-children">';
      html += renderSidebar(item.children, level + 1);
      html += '</div>';
      html += '</li>';
    } else {
      html += '<li class="' + classes.join(' ') + '">';
      html += '<a href="' + item.url + '">' + item.title + '</a>';
      html += '</li>';
    }
  }
  
  html += '</ul>';
  return html;
}
```

## Stage 6: Special Pages

### Homepage

The homepage is generated separately:

```javascript
function generateHomepage() {
  let content = '';
  
  // Add hero section if enabled
  if (CONFIG.showHero && (CONFIG.siteTitle || CONFIG.siteSubtitle)) {
    content += '<div class="homepage-hero">';
    // Add title and subtitle
    content += '</div>';
  }
  
  // Check for content/_index.md
  if (fs.existsSync(homepageIndexPath)) {
    // Render markdown content below hero
  }
  
  // Generate page with homepage flag
  const processed = {
    title: 'Home',
    content,
    urlPath: '/',
    isHomepage: true
    // ...
  };
  
  const html = generatePage(processed);
  fs.writeFileSync(path.join(CONFIG.distDir, 'index.html'), html);
}
```

### 404 Page

The 404 page uses static content:

```javascript
function generate404() {
  const content = '<div class="error-page">...</div>';
  
  const processed = {
    title: 'Page Not Found',
    content,
    urlPath: '/404/',
    sidebar: []
  };
  
  const html = generatePage(processed);
  fs.writeFileSync(path.join(CONFIG.distDir, '404.html'), html);
}
```

## Stage 7: Search Index

The search index is built as pages are processed:

```javascript
const searchIndex = [];

// During content processing:
searchIndex.push({
  title: processed.title,
  url: processed.urlPath,
  description: processed.description,
  content: plainTextContent  // HTML stripped
});

// After all pages processed:
function generateSearchIndex() {
  fs.writeFileSync(
    path.join(CONFIG.distDir, 'search-index.json'),
    JSON.stringify(searchIndex, null, 2)
  );
}
```

The content is stripped of HTML tags and markdown syntax to provide clean text for search:

```javascript
const plainContent = processed.content
  .replace(/<[^>]*>/g, ' ')           // Remove HTML tags
  .replace(/&quot;/g, '"')            // Decode entities
  .replace(/#{1,6}\s*/g, '')          // Remove heading markers
  .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove bold
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Links to text
  .replace(/\s+/g, ' ')               // Normalize whitespace
  .trim();
```

## Output Structure

The build produces:

```
dist/
  index.html                 # Homepage
  404.html                   # Error page
  search-index.json          # Search data
  css/
    main.css                 # Copied from static/
    hljs-theme.css
  js/
    app.js                   # Copied from static/
  svg/
    logo.svg                 # Copied from static/
  getting-started/
    index.html               # Category page
    installation/
      index.html             # Article page
    quickstart/
      index.html
  authoring/
    index.html
    ...
```

Each page is output as `[slug]/index.html` for clean URLs. When a web server serves `/getting-started/`, it serves `/getting-started/index.html`.

## Performance Considerations

The build is optimized for speed:

- **Single pass**: Each file is read once
- **In-memory processing**: No intermediate files
- **Direct I/O**: No caching layers or virtual file systems
- **Minimal dependencies**: Only essential packages loaded

For very large sites (500+ pages), consider:
- Using `npm run build` in CI rather than watch mode
- Ensuring adequate system memory for URL map
