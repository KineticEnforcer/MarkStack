---
title: Search Indexing
description: Understand how MarkStack generates the search index and how the client-side search algorithm finds and ranks results.
---

# Search Indexing

MarkStack includes full-text search without requiring a server-side search engine. This page explains how the search index is generated and how search works in the browser.

## Search Architecture

MarkStack search works entirely in the browser:

1. **Build time**: Generate a JSON index with all page content
2. **Page load**: Browser fetches the search index (on first search)
3. **Search time**: JavaScript searches the index and displays results

No server-side processing, no external search services, no API calls.

## Index Generation

### When the Index is Built

The search index is generated as part of the build process. As each page is processed, its content is added to a global array:

```javascript
const searchIndex = [];

// During content processing:
searchIndex.push({
  title: processed.title,
  url: processed.urlPath,
  description: processed.description,
  content: plainTextContent
});
```

After all pages are processed, the index is written:

```javascript
function generateSearchIndex() {
  const outputPath = path.join(CONFIG.distDir, 'search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));
  console.log('✓ Generated: /search-index.json (' + searchIndex.length + ' pages)');
}
```

### Index Entry Structure

Each entry in the search index contains:

```json
{
  "title": "Markdown Features",
  "url": "/authoring/markdown-features/",
  "description": "Learn about all the markdown features supported by MarkStack.",
  "content": "MarkStack supports standard markdown syntax plus several extensions..."
}
```

| Field | Source | Purpose |
|-------|--------|---------|
| `title` | Frontmatter or filename | Display in results, high-weight matching |
| `url` | Generated URL path | Link to the page |
| `description` | Frontmatter or default | Display in results, medium-weight matching |
| `content` | Rendered markdown (stripped) | Full-text search |

### Content Cleaning

The HTML content is stripped to plain text for indexing:

```javascript
const plainContent = processed.content
  // Remove HTML tags
  .replace(/<[^>]*>/g, ' ')
  
  // Decode HTML entities
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, ' ')
  
  // Remove markdown syntax remnants
  .replace(/#{1,6}\s*/g, '')              // Headings
  .replace(/\*\*([^*]+)\*\*/g, '$1')      // Bold
  .replace(/\*([^*]+)\*/g, '$1')          // Italic
  .replace(/__([^_]+)__/g, '$1')          // Bold underscore
  .replace(/_([^_]+)_/g, '$1')            // Italic underscore
  .replace(/`([^`]+)`/g, '$1')            // Inline code
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
  .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')  // Images
  .replace(/^[\s]*[-*+]\s+/gm, '')         // List markers
  .replace(/^[\s]*\d+\.\s+/gm, '')         // Numbered lists
  .replace(/^>/gm, '')                     // Blockquotes
  
  // Normalize whitespace
  .replace(/\s+/g, ' ')
  .trim();
```

This ensures clean, searchable text without HTML noise or formatting artifacts.

## Client-Side Search

### Index Loading

The search index is loaded lazily on first search:

```javascript
let searchIndex = null;

async function loadSearchIndex() {
  if (searchIndex) return searchIndex;  // Already loaded
  
  try {
    const response = await fetch('/search-index.json');
    searchIndex = await response.json();
    return searchIndex;
  } catch (error) {
    console.error('Failed to load search index:', error);
    return [];
  }
}
```

The index is cached in memory after loading. Subsequent searches use the cached data.

### Search Algorithm

The search function performs simple substring matching with relevance scoring:

```javascript
function performSearch(query, index) {
  if (!query || query.length < 2) return [];
  
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/).filter(w => w.length > 1);
  
  const results = [];
  
  for (const item of index) {
    const titleLower = item.title.toLowerCase();
    const contentLower = (item.content || '').toLowerCase();
    const descriptionLower = (item.description || '').toLowerCase();
    
    let score = 0;
    let matchContext = '';
    
    for (const word of words) {
      // Title matches (highest weight)
      if (titleLower.includes(word)) {
        score += titleLower === word ? 100 : 50;
      }
      
      // URL matches
      if (item.url.toLowerCase().includes(word)) {
        score += 30;
      }
      
      // Description matches
      if (descriptionLower.includes(word)) {
        score += 20;
      }
      
      // Content matches
      const contentIndex = contentLower.indexOf(word);
      if (contentIndex !== -1) {
        score += 10;
        
        // Bonus for multiple occurrences
        const matches = (contentLower.match(new RegExp(word, 'gi')) || []).length;
        score += Math.min(matches, 10);
        
        // Extract context around match
        if (!matchContext) {
          const start = Math.max(0, contentIndex - 60);
          const end = Math.min(item.content.length, contentIndex + word.length + 100);
          matchContext = item.content.substring(start, end);
          if (start > 0) matchContext = '...' + matchContext;
          if (end < item.content.length) matchContext = matchContext + '...';
        }
      }
    }
    
    if (score > 0) {
      results.push({
        ...item,
        score,
        excerpt: matchContext || item.description || item.content.substring(0, 150) + '...'
      });
    }
  }
  
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
```

### Scoring System

Results are ranked by relevance score:

| Match Location | Points |
|----------------|--------|
| Exact title match | 100 |
| Title contains word | 50 |
| URL contains word | 30 |
| Description contains word | 20 |
| Content contains word | 10 |
| Per additional content match | +1 (max 10) |

Higher scores appear first in results.

### Multi-Word Queries

For queries with multiple words, each word contributes to the score independently:

Query: "markdown syntax"
- Page about "Markdown Features" with "syntax" in content scores: 50 (title) + 10 (content) = 60
- Page about "Syntax Highlighting" with "markdown" in content scores: 50 (title) + 10 (content) = 60

All words must match for a result to appear.

## Search Interface

### Dropdown Results

As you type, results appear in a dropdown below the search input:

```javascript
searchInput.addEventListener('input', async function(e) {
  const query = e.target.value.trim();
  
  if (query.length < 2) {
    hideResults();
    return;
  }
  
  // Debounce to avoid excessive searches
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async function() {
    const index = await loadSearchIndex();
    const results = performSearch(query, index);
    renderResults(results, query);
  }, 150);
});
```

### Result Rendering

Each result shows title, excerpt, and URL:

```javascript
function renderResults(results, query) {
  let html = '';
  
  for (const item of results) {
    html += '<a href="' + item.url + '" class="search-result-item">';
    html += '<div class="search-result-title">' + highlightMatch(item.title, query) + '</div>';
    html += '<div class="search-result-excerpt">' + highlightMatch(item.excerpt, query) + '</div>';
    html += '<div class="search-result-path">' + item.url + '</div>';
    html += '</a>';
  }
  
  searchResults.innerHTML = html;
  searchResults.classList.add('active');
}
```

### Match Highlighting

Matching terms are highlighted in results:

```javascript
function highlightMatch(text, query) {
  if (!text) return '';
  
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  let result = escapeHtml(text);
  
  for (const word of words) {
    const regex = new RegExp('(' + escapeRegex(word) + ')', 'gi');
    result = result.replace(regex, '<mark>$1</mark>');
  }
  
  return result;
}
```

### Full Results Modal

Pressing Enter opens a modal with all results:

```javascript
searchInput.addEventListener('keydown', async function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query.length >= 2) {
      const index = await loadSearchIndex();
      const results = performSearch(query, index);
      showFullSearchResults(query, results);
    }
  }
});
```

### Keyboard Navigation

The search interface supports keyboard navigation:

| Key | Action |
|-----|--------|
| `Ctrl+K` | Focus search input |
| `↓` | Move to first/next result |
| `↑` | Move to previous result |
| `Enter` | Open selected result or show full results |
| `Escape` | Close search dropdown |

```javascript
// Global shortcut
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

// Navigate results
searchResults.addEventListener('keydown', function(e) {
  const current = document.activeElement;
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const next = current.nextElementSibling;
    if (next) next.focus();
  }
  
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prev = current.previousElementSibling;
    if (prev) prev.focus();
    else searchInput.focus();
  }
});
```

## Index Size Considerations

### Typical Sizes

The search index size depends on content volume:

| Pages | Approximate Size |
|-------|------------------|
| 10 pages | ~20 KB |
| 50 pages | ~100 KB |
| 200 pages | ~400 KB |
| 500 pages | ~1 MB |

### Optimization Strategies

For large sites, consider these optimizations:

**1. Gzip Compression**

Most servers compress JSON automatically. A 400 KB index compresses to approximately 100 KB.

**2. Truncate Content**

Modify the build script to limit content length:

```javascript
content: plainContent.substring(0, 5000)  // First 5000 chars only
```

**3. Exclude Pages**

Add frontmatter to exclude pages from search:

```yaml
---
title: Internal Notes
searchable: false
---
```

Then filter during index generation:

```javascript
if (frontmatter.searchable !== false) {
  searchIndex.push({...});
}
```

**4. Split Index**

For very large sites, split the index by section:

```
/search-index-getting-started.json
/search-index-authoring.json
/search-index-reference.json
```

Load only relevant indexes based on current page or user selection.

## Limitations

### No Fuzzy Matching

The current search uses exact substring matching. "instal" will not match "installation". Consider adding fuzzy matching for better UX:

```javascript
// Example with Fuse.js (would need to add as dependency)
const fuse = new Fuse(index, {
  keys: ['title', 'description', 'content'],
  threshold: 0.4
});
```

### No Stemming

"running" and "run" are treated as different words. For English content, a stemming algorithm would improve results.

### Client-Side Only

Search happens entirely in the browser. For sites with thousands of pages, server-side search (Algolia, Elasticsearch) may be more appropriate.

## Extending Search

### Custom Scoring

Modify the `performSearch` function to adjust scoring weights or add new criteria.

### Search Analytics

Track what users search for:

```javascript
function performSearch(query, index) {
  // Track search
  if (typeof gtag === 'function') {
    gtag('event', 'search', { search_term: query });
  }
  
  // ... existing search logic
}
```

### Filtering by Section

Add section-based filtering:

```javascript
function performSearch(query, index, section = null) {
  let filteredIndex = index;
  
  if (section) {
    filteredIndex = index.filter(item => item.url.startsWith('/' + section + '/'));
  }
  
  // ... existing search logic on filteredIndex
}
```
