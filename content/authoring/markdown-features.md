---
title: Markdown Features
description: Complete reference for all markdown syntax supported in MarkStack, including GitHub-style alerts, syntax-highlighted code blocks, task lists, footnotes, tables, images, and links.
---

# Markdown Features

MarkStack extends standard markdown with features commonly used in technical documentation. This guide covers every formatting option available, with examples you can copy directly into your own pages.

The markdown processor is based on markdown-it with plugins for:

- Heading anchors (clickable links for each heading)
- GitHub-style callout alerts
- Task list checkboxes
- Footnotes with automatic numbering
- Syntax highlighting for code blocks

## Standard Markdown

Before covering the extensions, here is a quick reference for standard markdown syntax that works everywhere.

### Headings

Use hash symbols to create headings. More hashes mean smaller headings:

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

Each heading automatically gets an anchor link (the # symbol that appears when you hover). Readers can click these to get a direct URL to that section.

### Paragraphs

Paragraphs are separated by blank lines:

```markdown
This is the first paragraph. It can span multiple lines
in the source and will render as continuous text.

This is the second paragraph, separated by a blank line.
```

### Emphasis

```markdown
*italic text* or _italic text_
**bold text** or __bold text__
***bold and italic*** or ___bold and italic___
~~strikethrough text~~
```

Renders as: *italic*, **bold**, ***bold and italic***, ~~strikethrough~~.

### Lists

Unordered lists use dashes, asterisks, or plus signs:

```markdown
- First item
- Second item
  - Nested item
  - Another nested item
- Third item
```

Ordered lists use numbers:

```markdown
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step
```

The actual numbers do not matter. Markdown renumbers them automatically. You could write `1. 1. 1.` and it would render as `1. 2. 3.`

### Blockquotes

Use the greater-than symbol for quoted text:

```markdown
> This is a blockquote. It can span multiple lines
> and represent quoted material or callouts.
>
> Multiple paragraphs work within blockquotes too.
```

### Horizontal Rules

Create a horizontal line with three or more dashes, asterisks, or underscores:

```markdown
---
```

or

```markdown
***
```

### Inline Code

Wrap code in backticks for inline code:

```markdown
Use the `npm run build` command to generate your site.
```

Renders as: Use the `npm run build` command to generate your site.

## GitHub-Style Alerts

Alerts are styled callout boxes that highlight important information. They are perfect for notes, tips, warnings, and other messages that should stand out from regular text.

MarkStack supports five alert types, matching GitHub's markdown alert syntax:

### NOTE

Use NOTE for general information readers should notice while scanning:

```markdown
> [!NOTE]
> MarkStack requires Node.js version 18 or later. Check your version with `node --version`.
```

Renders as:

> [!NOTE]
> MarkStack requires Node.js version 18 or later. Check your version with `node --version`.

### TIP

Use TIP for optional suggestions that help readers work more effectively:

```markdown
> [!TIP]
> Run `npm run watch` in one terminal and `npm run serve` in another for the fastest development workflow.
```

Renders as:

> [!TIP]
> Run `npm run watch` in one terminal and `npm run serve` in another for the fastest development workflow.

### IMPORTANT

Use IMPORTANT for information critical to completing a task successfully:

```markdown
> [!IMPORTANT]
> Back up your database before running the migration script. This operation cannot be undone.
```

Renders as:

> [!IMPORTANT]
> Back up your database before running the migration script. This operation cannot be undone.

### WARNING

Use WARNING for situations that could cause problems if ignored:

```markdown
> [!WARNING]
> Changing the `title` in frontmatter will change the page URL, potentially breaking existing links.
```

Renders as:

> [!WARNING]
> Changing the `title` in frontmatter will change the page URL, potentially breaking existing links.

### CAUTION

Use CAUTION for actions that could have serious negative consequences:

```markdown
> [!CAUTION]
> Running `npm run clean` deletes the entire `dist/` folder. Make sure you have not stored any important files there.
```

Renders as:

> [!CAUTION]
> Running `npm run clean` deletes the entire `dist/` folder. Make sure you have not stored any important files there.

### Alert Syntax Rules

For alerts to render correctly:

1. Start with a blockquote marker (`>`)
2. Put the alert type marker `[!TYPE]` immediately after, on its own line
3. Write the alert content on following lines with blockquote markers

```markdown
> [!NOTE]
> This is the correct syntax.
> The content can span multiple lines.
```

The alert type must be uppercase: `[!NOTE]`, not `[!Note]` or `[!note]`.

### When to Use Each Alert Type

| Type | Purpose | Example Use Case |
|------|---------|------------------|
| NOTE | General context | Version requirements, related links |
| TIP | Helpful suggestions | Keyboard shortcuts, workflow tips |
| IMPORTANT | Required information | Critical configuration steps |
| WARNING | Potential issues | Side effects, prerequisites |
| CAUTION | Dangerous actions | Data loss, irreversible operations |

## Code Blocks

Code blocks display source code with syntax highlighting. MarkStack uses Highlight.js, which supports over 190 programming languages.

### Basic Code Block

Wrap code in triple backticks with the language name:

````markdown
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```
````

Renders as:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```

### Specifying the Language

Always specify a language for proper syntax highlighting. The language name appears as a label above the code block.

Common language identifiers:

| Language | Identifier |
|----------|------------|
| JavaScript | `javascript` or `js` |
| TypeScript | `typescript` or `ts` |
| Python | `python` or `py` |
| Bash/Shell | `bash` or `shell` |
| JSON | `json` |
| YAML | `yaml` |
| HTML | `html` |
| CSS | `css` |
| SQL | `sql` |
| Markdown | `markdown` or `md` |
| C | `c` |
| C++ | `cpp` |
| C# | `csharp` or `cs` |
| Java | `java` |
| Ruby | `ruby` or `rb` |
| Go | `go` |
| Rust | `rust` |
| PHP | `php` |

### Examples in Different Languages

**Python:**

```python
def calculate_total(items):
    """Calculate the total price of all items."""
    return sum(item['price'] * item['quantity'] for item in items)

cart = [
    {'name': 'Widget', 'price': 9.99, 'quantity': 2},
    {'name': 'Gadget', 'price': 24.99, 'quantity': 1}
]

print(f"Total: ${calculate_total(cart):.2f}")
```

**Bash:**

```bash
#!/bin/bash

# Build and deploy the documentation
npm run clean
npm run build

if [ -d "dist" ]; then
    echo "Build successful, deploying..."
    rsync -avz dist/ user@server:/var/www/docs/
else
    echo "Build failed!"
    exit 1
fi
```

**JSON:**

```json
{
  "siteTitle": "My Documentation",
  "headerTitle": "MyDocs",
  "siteSubtitle": "Complete guides and references",
  "siteUrl": "https://docs.example.com",
  "showHero": true
}
```

**YAML:**

```yaml
name: Deploy Documentation
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
```

### Plain Text Code Blocks

If you do not specify a language, or specify an unrecognized language, the code renders as plain text without highlighting:

````markdown
```
This is plain text without syntax highlighting.
It preserves whitespace and formatting.
```
````

### Copy Button

Every code block automatically includes a Copy button in the top-right corner. Readers can click this button to copy the code to their clipboard without manually selecting it.

## Task Lists

Task lists create checkboxes for tracking items. They are useful for checklists, requirements, or step-by-step processes:

```markdown
- [x] Install Node.js
- [x] Clone the repository
- [x] Run npm install
- [ ] Configure siteconfig.json
- [ ] Add your content
- [ ] Deploy to production
```

Renders as:

- [x] Install Node.js
- [x] Clone the repository
- [x] Run npm install
- [ ] Configure siteconfig.json
- [ ] Add your content
- [ ] Deploy to production

### Task List Syntax

- `- [ ]` creates an unchecked box (space between brackets)
- `- [x]` creates a checked box (x between brackets)
- Use lowercase `x`, not uppercase `X`

Task lists are read-only in the rendered HTML. Readers cannot interact with the checkboxes on the generated site.

## Footnotes

Footnotes let you add references, citations, or extended explanations without cluttering the main text:

```markdown
Documentation sites should be fast and searchable[^1]. MarkStack achieves 
sub-100ms build times for most sites[^2].

[^1]: According to studies, users abandon slow-loading documentation within seconds.
[^2]: Based on testing with documentation sites containing up to 500 pages.
```

### How Footnotes Work

1. In your text, add a footnote marker: `[^1]`, `[^note]`, `[^ref-name]`
2. Define the footnote content anywhere in the file: `[^1]: Footnote text here`
3. All footnotes render at the bottom of the page, numbered automatically

### Footnote Naming

Footnote markers can be numbers or descriptive names:

```markdown
See the official specification[^spec] for details.

[^spec]: The specification is available at https://example.com/spec
```

The rendered page shows sequential numbers regardless of marker names.

## Tables

Tables present structured data in rows and columns:

```markdown
| Feature | Supported | Notes |
|---------|-----------|-------|
| Syntax highlighting | Yes | 190+ languages via Highlight.js |
| GitHub alerts | Yes | NOTE, TIP, IMPORTANT, WARNING, CAUTION |
| Task lists | Yes | Read-only checkboxes |
| Footnotes | Yes | Auto-numbered at page bottom |
| Math equations | No | Not included by default |
```

Renders as:

| Feature | Supported | Notes |
|---------|-----------|-------|
| Syntax highlighting | Yes | 190+ languages via Highlight.js |
| GitHub alerts | Yes | NOTE, TIP, IMPORTANT, WARNING, CAUTION |
| Task lists | Yes | Read-only checkboxes |
| Footnotes | Yes | Auto-numbered at page bottom |
| Math equations | No | Not included by default |

### Table Alignment

Control column alignment with colons in the separator row:

```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| Text | Text | Text |
| More | More | More |
```

| Left | Center | Right |
|:-----|:------:|------:|
| Text | Text | Text |
| More | More | More |

### Table Tips

- Keep tables simple. Complex tables are hard to read and maintain in markdown.
- Use the same number of columns in every row.
- The separator row (`|---|`) can have any number of dashes, but at least three.
- Leading and trailing pipes (`|`) are optional but recommended for readability.

## Images

Add images to your documentation by placing them in the `static/` folder and referencing them with absolute paths.

### Adding an Image

1. Put the image in `static/images/` (create the folder if it does not exist)
2. Reference it in markdown:

```markdown
![Diagram showing the build pipeline](/images/build-pipeline.png)
```

The text in brackets is the alt text, which describes the image for accessibility.

### Image Syntax

```markdown
![Alt text](/path/to/image.png)
![Alt text](/path/to/image.png "Optional title")
```

The optional title appears as a tooltip when hovering over the image.

### Image Best Practices

| Practice | Reason |
|----------|--------|
| Use descriptive alt text | Helps screen reader users and shows if image fails to load |
| Use absolute paths (`/images/...`) | Works from any page on the site |
| Optimize image file sizes | Large images slow down page loading |
| Use SVG for diagrams | Scales without quality loss |
| Use PNG for screenshots | Good quality with transparency support |
| Use JPG for photographs | Smaller file sizes for photo content |

## Links

Links connect pages and point to external resources.

### Internal Links

Link to other pages in your documentation with absolute paths:

```markdown
See the [Installation Guide](/installation/) for setup instructions.

Check [Frontmatter](/authoring/frontmatter/) for metadata options.
```

Use trailing slashes for consistency with the generated URLs.

### External Links

Link to external websites:

```markdown
[Node.js](https://nodejs.org) is required for running MarkStack.

[Highlight.js](https://highlightjs.org "Syntax highlighting library") provides code highlighting.
```

The optional title text appears as a tooltip on hover.

### Link Best Practices

| Practice | Reason |
|----------|--------|
| Use descriptive link text | "Read the installation guide" is better than "click here" |
| Use absolute paths for internal links | Works from any page |
| Include trailing slashes | Matches generated URL structure |
| Test links after renaming pages | Titles change URLs, breaking links |

## Heading Anchors

Every heading automatically gets an anchor ID that allows direct linking:

```markdown
## Installation Steps
```

Generates HTML with an ID:

```html
<h2 id="installation-steps">Installation Steps</h2>
```

Link directly to this section with:

```markdown
See the [Installation Steps](#installation-steps) section.
```

The anchor ID is the heading text, lowercased, with spaces replaced by hyphens and special characters removed.

> [!TIP]
> Hover over any heading on a MarkStack page to see the anchor link icon (#). Click it to copy the direct URL to that section.
