---
title: Navigation and Routing
description: Learn how MarkStack generates URLs from titles, builds navigation trees, creates breadcrumbs, and handles clean URL routing.
---

# Navigation and Routing

MarkStack automatically generates navigation from your content structure. This page explains how URLs are created, how the sidebar tree is built, and how routing works.

## URL Generation

### Title-Based URLs

URLs are generated from page and folder titles, not filenames. This creates human-readable, SEO-friendly URLs.

| Title | Generated URL |
|-------|---------------|
| Getting Started | `/getting-started/` |
| Installation Guide | `/installation-guide/` |
| Markdown Features | `/markdown-features/` |
| CI/CD Integration | `/cicd-integration/` |

### The Slugify Function

The `slugify()` function converts titles to URL-safe slugs:

```javascript
function slugify(title) {
  return title
    .toLowerCase()                    // "Getting Started" → "getting started"
    .replace(/[^a-z0-9\s-]/g, '')     // Remove special chars
    .replace(/\s+/g, '-')              // Spaces to hyphens
    .replace(/-+/g, '-')               // Multiple hyphens to single
    .replace(/^-|-$/g, '');            // Trim leading/trailing
}
```

Step-by-step example:

```
Input:  "CI/CD Integration Guide!"
Step 1: "ci/cd integration guide!"
Step 2: "cicd integration guide"
Step 3: "cicd-integration-guide"
Step 4: "cicd-integration-guide"
Step 5: "cicd-integration-guide"
Output: "cicd-integration-guide"
```

### Title Sources

Titles come from these sources, in priority order:

1. **Frontmatter title**: Explicitly set in the markdown file
2. **Filename**: Derived from the filename if no frontmatter title
3. **Directory name**: For `_index.md` files, derived from parent directory

```yaml
---
title: My Custom Title  # This is used first
---
```

If no frontmatter title exists:
- `installation.md` becomes "Installation"
- `project-structure.md` becomes "Project Structure"
- `CI-CD.md` becomes "CI CD"

### URL Map

Before processing content, MarkStack builds a complete URL map:

```javascript
const urlMap = new Map();

// Maps file paths to URLs
urlMap.set('/content/authoring/markdown-features.md', '/authoring/markdown-features/');
urlMap.set('/content/getting-started/_index.md', '/getting-started/');
```

This map is consulted during content processing to:
- Generate correct navigation links
- Build accurate breadcrumbs
- Ensure internal consistency

## Directory Structure to URLs

### Basic Mapping

| File Path | URL Path |
|-----------|----------|
| `content/_index.md` | `/` (homepage) |
| `content/about.md` | `/about/` |
| `content/docs/_index.md` | `/docs/` |
| `content/docs/intro.md` | `/docs/intro/` |
| `content/docs/guide/setup.md` | `/docs/guide/setup/` |

### Nested Categories

Deep nesting works naturally:

```
content/
  platform/
    _index.md           → /platform/
    aws/
      _index.md         → /platform/aws/
      ec2.md            → /platform/aws/ec2/
      s3.md             → /platform/aws/s3/
    azure/
      _index.md         → /platform/azure/
      vms.md            → /platform/azure/vms/
```

Each level adds to the URL path based on the directory or file title.

## Sidebar Navigation

### Tree Structure

The sidebar is built as a tree structure that mirrors your content hierarchy:

```javascript
[
  {
    type: 'folder',
    title: 'Getting Started',
    url: '/getting-started/',
    expanded: true,  // If current page is within
    children: [
      {
        type: 'file',
        title: 'Installation',
        url: '/getting-started/installation/',
        current: false
      },
      {
        type: 'file',
        title: 'Quick Start',
        url: '/getting-started/quickstart/',
        current: true  // Current page
      }
    ]
  },
  {
    type: 'folder',
    title: 'Authoring',
    url: '/authoring/',
    expanded: false,
    children: [...]
  }
]
```

### Expansion State

Folders expand automatically when:
- The current page is inside that folder
- The current page is inside a nested subfolder

```javascript
expanded: currentUrlPath.startsWith(folderUrl)
```

If you are viewing `/authoring/markdown-features/`, the Authoring folder expands, but other top-level folders remain collapsed.

### Sorting

Items are sorted alphabetically by title within each level:

```javascript
folders.sort((a, b) => a.title.localeCompare(b.title));
files.sort((a, b) => a.title.localeCompare(b.title));
```

Folders appear before files at each level:

```
📁 Architecture
📁 Authoring  
📁 Getting Started
📄 About
📄 Changelog
```

### Rendering to HTML

The tree is rendered recursively:

```html
<ul class="sidebar-list sidebar-level-0">
  <li class="sidebar-item sidebar-folder sidebar-expanded">
    <div class="sidebar-folder-header">
      <button class="sidebar-toggle">▼</button>
      <a href="/getting-started/">
        <svg><!-- folder icon --></svg>
        Getting Started
      </a>
    </div>
    <div class="sidebar-children expanded">
      <ul class="sidebar-list sidebar-level-1">
        <li class="sidebar-item sidebar-file sidebar-current">
          <a href="/getting-started/quickstart/">
            <svg><!-- file icon --></svg>
            Quick Start
          </a>
        </li>
      </ul>
    </div>
  </li>
</ul>
```

### Client-Side Toggle

Folder expand/collapse is handled by JavaScript:

```javascript
sidebarNav.addEventListener('click', function(e) {
  const toggle = e.target.closest('.sidebar-toggle');
  if (!toggle) return;
  
  e.preventDefault();
  
  const sidebarItem = toggle.closest('.sidebar-item');
  const children = sidebarItem.querySelector('.sidebar-children');
  const isExpanded = sidebarItem.dataset.state === 'expanded';
  
  if (isExpanded) {
    children.classList.remove('expanded');
    sidebarItem.dataset.state = 'collapsed';
    toggle.innerHTML = chevronRight;  // →
  } else {
    children.classList.add('expanded');
    sidebarItem.dataset.state = 'expanded';
    toggle.innerHTML = chevronDown;   // ↓
  }
});
```

## Breadcrumb Navigation

### Structure

Breadcrumbs show the path from homepage to current page:

```
Home / Getting Started / Quick Start
```

### Building Breadcrumbs

Breadcrumbs are built by walking up the directory tree:

```javascript
function buildNavigationTree(filePath, urlPath) {
  const nav = { breadcrumbs: [], sidebar: ... };
  
  // Always start with Home
  nav.breadcrumbs.push({ title: 'Home', url: '/' });
  
  // Walk each path segment
  const pathParts = relativePath.split('/').filter(Boolean);
  for (const part of pathParts) {
    if (part === '_index.md') continue;  // Skip index files
    
    if (part.endsWith('.md')) {
      // It's a page - add with URL from map
      nav.breadcrumbs.push({
        title: pageTitle,
        url: urlMap.get(filePath)
      });
    } else {
      // It's a directory - add with URL from map
      nav.breadcrumbs.push({
        title: directoryTitle,
        url: urlMap.get(directoryPath)
      });
    }
  }
  
  return nav;
}
```

### Rendering Breadcrumbs

```javascript
function renderBreadcrumbs(breadcrumbs) {
  return breadcrumbs.map((item, i) => {
    if (i === 0) {
      // Home link with icon
      return '<a href="/" class="breadcrumb-home">' + homeIcon + '</a>';
    }
    if (i === breadcrumbs.length - 1) {
      // Current page (not linked)
      return '<span class="breadcrumb-current">' + item.title + '</span>';
    }
    // Intermediate links
    return '<a href="' + item.url + '">' + item.title + '</a>';
  }).join('<span class="breadcrumb-separator">/</span>');
}
```

Output:
```html
<a href="/" class="breadcrumb-home"><svg>...</svg></a>
<span class="breadcrumb-separator">/</span>
<a href="/getting-started/">Getting Started</a>
<span class="breadcrumb-separator">/</span>
<span class="breadcrumb-current">Quick Start</span>
```

## Clean URLs

### Output Structure

Each page is output as `[slug]/index.html`:

```
dist/
  getting-started/
    index.html              ← /getting-started/
    installation/
      index.html            ← /getting-started/installation/
    quickstart/
      index.html            ← /getting-started/quickstart/
```

### How Clean URLs Work

When a browser requests `/getting-started/`, the web server:
1. Looks for `/getting-started/index.html`
2. Returns the index.html file
3. Browser displays the URL without `.html`

This is standard behavior for most web servers and hosting platforms.

### Server Configuration

Most hosts handle this automatically. For self-hosted setups:

**nginx:**
```nginx
location / {
  try_files $uri $uri/ $uri/index.html =404;
}
```

**Apache (.htaccess):**
```apache
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.*)$ $1/index.html [L]
```

## Internal Link Resolution

### Linking Between Pages

When writing markdown, use the URL path (not file path):

```markdown
See the [installation guide](/getting-started/installation/).
```

The URL is based on the page title, so:
- A page titled "Installation Guide" is at `/installation-guide/`
- Not at `/installation.md` or `/installation/`

### Relative Links

Relative links also work:

```markdown
From /getting-started/installation/:

[Next: Quick Start](../quickstart/)
```

However, absolute paths are clearer and less error-prone.

### Anchor Links

Links to headings within pages use the slugified heading text:

```markdown
[See the syntax section](/authoring/markdown-features/#syntax-highlighting)
```

Heading anchors are generated by markdown-it-anchor:

```javascript
slugify: s => s.toLowerCase().replace(/[^\w]+/g, '-')
```

## URL Consistency

### Why Title-Based URLs?

Using titles for URLs instead of filenames provides:

- **Readable URLs**: `/markdown-features/` vs `/md-feat.md`
- **SEO benefits**: Keywords in URL path
- **Refactoring freedom**: Rename files without breaking URLs (if title unchanged)
- **Consistency**: URLs match what users see in navigation

### Maintaining URL Stability

If you change a page title, its URL changes. To maintain old URLs:

1. Keep the original title in frontmatter
2. Or set up redirects on your hosting platform

```yaml
---
title: Installation Guide  # Original title, keeps /installation-guide/ URL
---

# Setting Up MarkStack  <!-- Display heading can differ -->
```

## Navigation Edge Cases

### Empty Directories

Directories without `_index.md` still appear in navigation, using the directory name as the title.

### Hidden Files

Files and directories starting with `.` are ignored:

```
content/
  .drafts/        ← Ignored
  .hidden.md      ← Ignored
  visible.md      ← Processed
```

### Ordering

Currently, items sort alphabetically. For custom ordering, prefix titles:

```yaml
---
title: 01 Introduction
---
```

Or prefix filenames:

```
01-introduction.md
02-installation.md
03-configuration.md
```

The URL will include the prefix, so consider if this is acceptable for your use case.
