---
title: Media and Links
description: Complete guide to adding images, downloadable files, and links in MarkStack documentation, including file organization, path conventions, and accessibility best practices.
---

# Media and Links

This guide covers everything about adding non-text content to your documentation: images, downloadable files, and links to other pages. Understanding these conventions ensures your assets load correctly and your links work reliably.

## Understanding Static Assets

MarkStack copies everything in the `static/` folder to `dist/` during each build. This is where you place files you want to serve alongside your documentation:

```
static/
├── css/          # Stylesheets
├── js/           # JavaScript
├── svg/          # SVG files (logo, icons)
├── images/       # PNG, JPG, GIF images
└── files/        # Downloadable documents (PDFs, ZIPs)
```

When you reference these files in markdown, use absolute paths starting with `/`:

- `static/images/diagram.png` becomes `/images/diagram.png`
- `static/files/guide.pdf` becomes `/files/guide.pdf`

## Images

Images enhance documentation by showing concepts visually, providing screenshots of interfaces, and displaying diagrams that would be difficult to explain in words.

### Adding Images to Your Project

1. Create an images folder if it does not exist: `static/images/`
2. Copy your image file into that folder
3. Reference it in your markdown

```markdown
![Descriptive alt text](/images/your-image.png)
```

### Image Syntax

The basic syntax for images is:

```markdown
![Alt text](/path/to/image.png)
```

You can add an optional title that appears as a tooltip:

```markdown
![Alt text](/path/to/image.png "Tooltip text")
```

### Complete Example

Suppose you have a screenshot of the MarkStack sidebar. You would:

1. Save it as `static/images/sidebar-screenshot.png`
2. Reference it in markdown:

```markdown
The sidebar shows your documentation structure:

![Screenshot of the MarkStack sidebar navigation](/images/sidebar-screenshot.png "Sidebar Navigation")

Click any item to navigate to that page.
```

### Image Organization

For sites with many images, organize them into subfolders:

```
static/images/
├── getting-started/
│   ├── install-step-1.png
│   └── install-step-2.png
├── guides/
│   ├── dashboard-overview.png
│   └── settings-panel.png
└── diagrams/
    ├── architecture.svg
    └── data-flow.svg
```

Reference them with the full path:

```markdown
![Installation step 1](/images/getting-started/install-step-1.png)
```

### SVG Files

SVG (Scalable Vector Graphics) files are ideal for diagrams, logos, and icons because they scale without losing quality. Store them in `static/svg/` or `static/images/`:

```markdown
![System architecture](/svg/architecture.svg)
```

### Image Format Guidelines

| Format | Best For | Characteristics |
|--------|----------|-----------------|
| PNG | Screenshots, UI elements | Lossless, supports transparency |
| JPG | Photographs, complex images | Smaller files, no transparency |
| SVG | Diagrams, logos, icons | Scalable, small file size |
| GIF | Simple animations | Limited colors, animation support |
| WebP | Modern browsers | Best compression, broad support |

### Image Optimization

Large images slow down page loading. Optimize images before adding them:

- Resize images to the maximum size they will display (no need for 4000px images if they display at 800px)
- Compress using tools like ImageOptim, TinyPNG, or Squoosh
- Use appropriate formats (PNG for screenshots, JPG for photos)
- Consider SVG for diagrams and illustrations

### Why Absolute Paths Matter

Always use absolute paths starting with `/` for images:

```markdown
<!-- Correct: absolute path -->
![Diagram](/images/diagram.png)

<!-- Incorrect: relative path -->
![Diagram](../images/diagram.png)
![Diagram](images/diagram.png)
```

Absolute paths work from any page regardless of nesting depth. Relative paths break when pages move or when the same content appears at different URL depths.

## Downloadable Files

Provide downloadable content like PDFs, ZIP archives, or sample files by placing them in `static/files/` and linking to them.

### Adding Downloadable Files

1. Create the files folder: `static/files/`
2. Add your file (e.g., `user-guide.pdf`)
3. Link to it in markdown:

```markdown
Download the complete [User Guide (PDF)](/files/user-guide.pdf).
```

### Common File Types

| File Type | Example Path | Use Case |
|-----------|--------------|----------|
| PDF documents | `/files/user-guide.pdf` | Printable guides, specifications |
| ZIP archives | `/files/sample-project.zip` | Code samples, starter kits |
| Configuration files | `/files/config-template.yaml` | Templates for users to download |
| Data files | `/files/sample-data.csv` | Example datasets |

### File Organization

For many downloadable files, organize by category:

```
static/files/
├── guides/
│   ├── getting-started.pdf
│   └── advanced-usage.pdf
├── samples/
│   ├── starter-project.zip
│   └── example-config.yaml
└── reference/
    └── api-specification.pdf
```

Reference with full paths:

```markdown
[Download the starter project](/files/samples/starter-project.zip)
```

## Internal Links

Internal links connect pages within your documentation. They help readers navigate to related content and create a cohesive documentation experience.

### Link Syntax

```markdown
[Link text](/path/to/page/)
```

### Linking to Pages

Link to other documentation pages using their URL path:

```markdown
See the [Installation Guide](/installation/) for setup instructions.

Review the [Configuration Reference](/configuration/siteconfig/) for all options.
```

### Linking to Category Landing Pages

Category landing pages end with a trailing slash:

```markdown
Explore the [Authoring Content](/authoring/) section for writing guides.
```

### Linking to Page Sections

Link to specific sections using anchor IDs:

```markdown
See the [Code Blocks](#code-blocks) section below.

Refer to the [GitHub Actions example](/build-deploy/ci-cd/#example-github-actions).
```

Anchor IDs are generated from heading text: lowercased, spaces become hyphens, special characters removed.

### Best Practices for Internal Links

| Practice | Example |
|----------|---------|
| Use absolute paths | `/authoring/frontmatter/` not `../frontmatter/` |
| Include trailing slashes | `/getting-started/` not `/getting-started` |
| Use descriptive link text | "read the installation guide" not "click here" |
| Check links after renaming | Title changes break links based on old slugs |

### Example: Navigation Links

Create a "Related Pages" section at the bottom of pages:

```markdown
## Related Pages

- [Markdown Features](/authoring/markdown-features/) for formatting options
- [Frontmatter](/authoring/frontmatter/) for metadata fields
- [Examples](/authoring/examples/) for copy-ready templates
```

## External Links

External links point to resources outside your documentation site.

### Basic External Links

```markdown
[Node.js](https://nodejs.org) is required to run MarkStack.
```

### External Links with Titles

Add tooltip text with a title:

```markdown
[Highlight.js](https://highlightjs.org "Syntax highlighting library") provides code highlighting.
```

### When to Link Externally

External links are helpful for:

- Official documentation of tools you reference
- Specifications and standards
- Additional resources for deeper learning
- Credit and attribution

### External Link Considerations

External links can break if the destination page moves or disappears. Consider:

- Linking to stable, authoritative sources (official documentation, specifications)
- Periodically checking that external links still work
- Avoiding links to content that changes frequently

## Accessibility

Accessible documentation works for everyone, including people using screen readers, keyboard navigation, or other assistive technologies.

### Alt Text for Images

Every image needs descriptive alt text that conveys the image's purpose:

```markdown
<!-- Good: describes what the image shows -->
![Flowchart showing the build pipeline from content to dist folder](/images/build-flow.png)

<!-- Bad: unhelpful alt text -->
![Image](/images/build-flow.png)
![](/images/build-flow.png)
```

If an image is purely decorative and adds no information, you can use empty alt text:

```markdown
![](/images/decorative-divider.png)
```

However, documentation images almost always convey information and need meaningful alt text.

### Writing Good Alt Text

| Image Type | Alt Text Approach |
|------------|-------------------|
| Screenshot | Describe what the interface shows and any highlighted elements |
| Diagram | Summarize the relationships or flow depicted |
| Graph/Chart | Describe the data and any key insights |
| Icon | Describe the icon's meaning in context |

Examples:

```markdown
![MarkStack homepage showing the search bar and navigation sidebar](/images/homepage.png)

![Diagram of request flow: client sends request to API, API queries database, database returns data](/images/request-flow.svg)

![Bar chart showing build times: MarkStack at 89ms, Tool B at 2400ms, Tool C at 5600ms](/images/performance-comparison.png)
```

### Descriptive Link Text

Link text should describe where the link goes:

```markdown
<!-- Good: describes the destination -->
Read the [installation guide](/installation/) for setup instructions.

Download the [complete API reference (PDF)](/files/api-reference.pdf).

<!-- Bad: generic link text -->
Click [here](/installation/) for installation.

[Download](/files/api-reference.pdf) the reference.
```

Screen reader users often navigate by links, hearing just the link text without surrounding context. "Click here" and "download" do not tell them where the link leads.

### Link Purpose from Context

If context makes the destination clear, shorter link text works:

```markdown
For setup help, see [Installation](/installation/).
```

## Practical Examples

### Documentation Page with Multiple Assets

```markdown
---
title: Dashboard Overview
description: Learn to navigate and customize the dashboard interface.
---

# Dashboard Overview

The dashboard is your central hub for monitoring system status.

![Dashboard main view showing navigation and status panels](/images/dashboard-main.png)

## Navigation

The left sidebar provides access to all major sections:

![Sidebar navigation highlighting the main menu items](/images/dashboard-sidebar.png)

## Customization

Download our [dashboard configuration template](/files/dashboard-config.yaml) to get started with customization.

For detailed customization options, see the [Configuration Guide](/configuration/).

> [!TIP]
> Press `Ctrl+K` anywhere in the dashboard to open the quick search.
```

### Linking Related Content

```markdown
## Learn More

- [Getting Started](/getting-started/) provides initial setup instructions
- [Markdown Features](/authoring/markdown-features/) covers all formatting options
- [Highlight.js](https://highlightjs.org) powers the syntax highlighting

For printable reference material:

- [Quick Reference Card (PDF)](/files/quick-reference.pdf)
- [Full Documentation (PDF)](/files/complete-docs.pdf)
```

> [!TIP]
> After adding new files to `static/`, run `npm run build` (or let `npm run watch` rebuild) so they copy to `dist/` and become accessible.
