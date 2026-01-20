---
title: Templates
description: Understand and customize the MarkStack HTML template, add analytics scripts, modify page structure, and extend the template system.
---

# Templates

MarkStack uses a single HTML template file that defines the structure of every page. This guide explains how the template works and how to customize it safely.

## Template Location

The template file is located at:

```
templates/base.html
```

Every page on your site is generated from this template. The build script replaces placeholder tokens with page-specific content during the build process.

## Understanding Placeholders

The template uses double-brace syntax for placeholders:

```html
<title>{{title}} | {{siteTitle}}</title>
```

During the build, `{{title}}` is replaced with the page's title and `{{siteTitle}}` with the value from `siteconfig.json`.

### Available Placeholders

Here is the complete list of placeholders you can use in the template:

| Placeholder | Source | Description |
|-------------|--------|-------------|
| `{{title}}` | Frontmatter or filename | The current page's title |
| `{{siteTitle}}` | siteconfig.json headerTitle | Site name shown in header |
| `{{description}}` | Frontmatter or default | Page meta description |
| `{{url}}` | Generated from siteUrl + path | Full URL for OpenGraph |
| `{{content}}` | Rendered markdown | The page's HTML content |
| `{{sidebar}}` | Generated navigation | Sidebar HTML tree |
| `{{breadcrumbs}}` | Generated navigation | Breadcrumb HTML |
| `{{pageClass}}` | Build script | Additional page classes (e.g., homepage) |
| `{{copyrightText}}` | siteconfig.json | Footer copyright text |

### Where Placeholders Are Used

Looking at the default template:

```html
<!-- In the head -->
<meta name="description" content="{{description}}">
<meta property="og:title" content="{{title}} | {{siteTitle}}">
<title>{{title}} | {{siteTitle}}</title>

<!-- In the header -->
<span class="logo-text">{{siteTitle}}</span>

<!-- In the main content -->
{{breadcrumbs}}
{{sidebar}}
{{content}}

<!-- In the footer -->
<p class="copyright">{{copyrightText}}</p>
```

## Template Structure

The template is organized into clear sections:

### Head Section

Contains meta tags, fonts, styles, and scripts that run before page render:

```html
<head>
  <meta charset="UTF-8">
  
  <!-- Theme initialization (prevents flash of wrong theme) -->
  <script>
    (function() {
      const theme = localStorage.getItem('theme') || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  
  <!-- Sidebar state initialization -->
  <script>
    (function() {
      const savedState = localStorage.getItem('sidebar-state');
      if (savedState === 'collapsed') {
        document.documentElement.classList.add('sidebar-collapsed');
      }
    })();
  </script>
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{{description}}">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
  
  <!-- OpenGraph tags for social sharing -->
  <meta property="og:title" content="{{title}} | {{siteTitle}}">
  <meta property="og:description" content="{{description}}">
  
  <title>{{title}} | {{siteTitle}}</title>
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="/css/main.css">
  <link rel="stylesheet" href="/css/hljs-theme.css">
  
  <!-- Favicon -->
  <link rel="icon" href="/svg/logo.svg" type="image/svg+xml">
</head>
```

### Header Section

Contains the site logo, search, and theme toggle:

```html
<header class="site-header">
  <div class="header-container">
    <!-- Logo -->
    <a href="/" class="site-logo">
      <img src="/svg/logo.svg" alt="Logo" class="logo-icon">
      <span class="logo-text">{{siteTitle}}</span>
    </a>
    
    <!-- Search -->
    <div class="header-search">
      <!-- Search input and results -->
    </div>
    
    <!-- Theme toggle -->
    <div class="header-actions">
      <button id="theme-toggle" class="theme-toggle">
        <!-- Sun and moon icons -->
      </button>
    </div>
  </div>
</header>
```

### Breadcrumb Bar

Shows the navigation path to the current page:

```html
<div class="breadcrumb-bar">
  <div class="breadcrumb-container">
    {{breadcrumbs}}
  </div>
</div>
```

### Main Layout

Contains the sidebar and content area:

```html
<div class="main-layout{{pageClass}}">
  <aside class="sidebar">
    <nav class="sidebar-nav">
      {{sidebar}}
    </nav>
  </aside>
  
  <main class="content">
    <article class="article">
      {{content}}
    </article>
  </main>
</div>
```

### Footer Section

Contains site footer and copyright:

```html
<footer class="site-footer">
  <div class="footer-container">
    <p>Built with MarkStack</p>
    <p class="copyright">{{copyrightText}}</p>
  </div>
</footer>
```

### Scripts

JavaScript loaded at the end of the body:

```html
<script src="/js/app.js"></script>
</body>
</html>
```

## Safe Template Modifications

### Adding Analytics

To add analytics (Google Analytics, Plausible, Fathom, etc.), insert the script before the closing `</head>` tag:

```html
  <!-- Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
</head>
```

For privacy-focused analytics like Plausible:

```html
  <script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
</head>
```

### Adding Custom Meta Tags

Add meta tags in the `<head>` section:

```html
<!-- Twitter card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourhandle">

<!-- Author information -->
<meta name="author" content="Your Name">

<!-- Robots directives -->
<meta name="robots" content="index, follow">

<!-- Canonical URL (uses the page URL) -->
<link rel="canonical" href="{{url}}">
```

### Adding External Stylesheets

Add CSS links after the existing stylesheets:

```html
<link rel="stylesheet" href="/css/main.css">
<link rel="stylesheet" href="/css/hljs-theme.css">
<!-- Your custom stylesheet -->
<link rel="stylesheet" href="/css/custom.css">
```

Create `static/css/custom.css` with your additional styles.

### Adding JavaScript Libraries

Add scripts before the closing `</body>` tag:

```html
<script src="/js/app.js"></script>
<!-- Additional libraries -->
<script src="https://cdn.example.com/library.js"></script>
<script src="/js/custom.js"></script>
</body>
```

Create `static/js/custom.js` with your custom code.

## Modifying Page Structure

### Adding a Table of Contents Placeholder

If you want to add a table of contents area, you could add a placeholder:

```html
<main class="content">
  <article class="article">
    {{content}}
  </article>
  <aside class="toc">
    <!-- Table of contents would go here -->
  </aside>
</main>
```

Note: You would need to modify `build.js` to generate and inject table of contents content.

### Adding a Reading Progress Bar

Add this after the opening `<body>` tag:

```html
<div class="reading-progress">
  <div class="reading-progress-bar" id="progress-bar"></div>
</div>
```

Then add JavaScript in a custom script file:

```javascript
window.addEventListener('scroll', function() {
  const article = document.querySelector('.article');
  if (!article) return;
  
  const rect = article.getBoundingClientRect();
  const progress = Math.min(100, Math.max(0, 
    ((-rect.top) / (rect.height - window.innerHeight)) * 100
  ));
  
  document.getElementById('progress-bar').style.width = progress + '%';
});
```

### Adding a Back-to-Top Button

Add before the closing `</body>` tag:

```html
<button class="back-to-top" id="back-to-top" aria-label="Back to top">
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M12 4l-8 8h5v8h6v-8h5z"/>
  </svg>
</button>
```

Add JavaScript:

```javascript
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', function() {
  if (window.scrollY > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

## Creating Custom Placeholders

To add new placeholders, you need to modify `build.js`. The placeholder replacement happens in the `generatePage` function:

```javascript
function generatePage(processed) {
  const template = readTemplate('base');
  
  let html = template
    .replace(/\{\{siteTitle\}\}/g, CONFIG.headerTitle)
    .replace(/\{\{title\}\}/g, processed.title)
    // ... other replacements
    .replace(/\{\{yourNewPlaceholder\}\}/g, yourValue);
  
  return html;
}
```

### Example: Adding a Last Updated Placeholder

1. In `templates/base.html`, add the placeholder where you want it:

```html
<article class="article">
  <div class="last-updated">Last updated: {{lastUpdated}}</div>
  {{content}}
</article>
```

2. In `build.js`, modify `processMarkdownFile` to get the file modification date:

```javascript
function processMarkdownFile(filePath) {
  const stats = fs.statSync(filePath);
  const lastUpdated = stats.mtime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // ... existing code ...
  
  return {
    // ... existing properties
    lastUpdated
  };
}
```

3. In `generatePage`, add the replacement:

```javascript
.replace(/\{\{lastUpdated\}\}/g, processed.lastUpdated || '')
```

## Template Best Practices

### Keep Inline Scripts Minimal

The inline scripts in `<head>` prevent flash of unstyled content (FOUC) for theme and sidebar state. Keep these scripts small and focused. Heavy JavaScript should go in external files loaded at the end of `</body>`.

### Maintain Accessibility

When modifying the template:

- Keep semantic HTML structure (header, main, nav, aside, footer)
- Maintain ARIA labels on interactive elements
- Ensure keyboard navigation continues to work
- Test with screen readers if possible

### Test Thoroughly

After template changes:

1. Rebuild the site: `npm run build`
2. Test multiple pages (homepage, category pages, article pages)
3. Test both themes (dark and light)
4. Test on mobile and desktop
5. Verify all interactive features still work

### Version Control Your Changes

Before making significant template changes, commit your current working state:

```bash
git add .
git commit -m "Backup before template changes"
```

This allows you to easily revert if something breaks.

## Common Template Issues

### Broken Placeholders

If you see `{{placeholder}}` literally in your output, the placeholder name may be misspelled or missing from the `generatePage` function in `build.js`.

### Missing Styles

If styles are missing after template changes, verify:

- CSS links are correct and paths start with `/`
- The `static/css` folder was copied to `dist/css`
- No syntax errors in CSS files

### JavaScript Not Working

If interactive features stop working:

- Check browser console for errors (press F12)
- Verify script paths are correct
- Ensure scripts are loaded in the right order (dependencies first)

> [!WARNING]
> Modifying the template can break your site if done incorrectly. Always test thoroughly after making changes, and keep backups of working versions.
