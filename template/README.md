# Template Content

This folder contains template files you can copy to create new content.

## Structure

```
template/content/
├── category-name/           # Rename to your category
│   ├── _index.md            # Category page (required)
│   └── subcategory/         # Optional nested category
│       ├── _index.md        # Subcategory page
│       └── article.md       # Article page
```

## Usage

1. Copy the `category-name` folder to `content/`
2. Rename the folder to your desired category name
3. Edit `_index.md` with your category title and description
4. Add article `.md` files as needed
5. Run `npm run build` to generate the site

## Frontmatter

Every markdown file should have frontmatter at the top:

```yaml
---
title: Page Title           # Optional - derived from filename if omitted
description: SEO description # Used in meta tags and category listings
---
```

## File Naming

- **`_index.md`** - Required for category/folder pages
- **`article-name.md`** - Regular article pages
- Filenames become fallback titles if `title` frontmatter is omitted
