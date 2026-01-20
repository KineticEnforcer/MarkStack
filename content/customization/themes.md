---
title: Themes and Styling
description: Customize your MarkStack site's colors, typography, spacing, logos, and code highlighting for both dark and light themes.
---

# Themes and Styling

MarkStack uses CSS custom properties (also called CSS variables) to control every visual aspect of your site. This guide shows you how to customize colors, typography, spacing, and more for both dark and light themes.

## Understanding CSS Custom Properties

CSS custom properties are variables defined in CSS that you can reuse throughout your stylesheets. MarkStack defines all its design tokens as custom properties in `static/css/main.css`.

Here is how they work:

```css
/* Define a variable */
:root {
  --color-accent: #22c55e;
}

/* Use the variable */
.button {
  background-color: var(--color-accent);
}
```

When you change `--color-accent`, every element using that variable updates automatically. This makes theming straightforward and consistent.

## Theme Structure

MarkStack supports dark and light themes. Each theme defines its own set of color values:

```css
/* Dark theme colors */
[data-theme="dark"] {
  --color-bg: #0f0f0f;
  --color-text: #f5f5f5;
  --color-accent: #22c55e;
  /* ... more colors */
}

/* Light theme colors */
[data-theme="light"] {
  --color-bg: #ffffff;
  --color-text: #171717;
  --color-accent: #16a34a;
  /* ... more colors */
}
```

The theme is controlled by the `data-theme` attribute on the `<html>` element. Users toggle between themes using the theme button in the header.

## Color System

### Core Colors

These colors control the fundamental appearance of your site:

| Variable | Purpose | Dark Default | Light Default |
|----------|---------|--------------|---------------|
| `--color-bg` | Page background | `#0f0f0f` | `#ffffff` |
| `--color-bg-secondary` | Cards, code blocks | `#171717` | `#f5f5f5` |
| `--color-bg-tertiary` | Hover states | `#262626` | `#e5e5e5` |
| `--color-text` | Primary text | `#f5f5f5` | `#171717` |
| `--color-text-secondary` | Muted text | `#a3a3a3` | `#525252` |
| `--color-text-tertiary` | Subtle text | `#737373` | `#737373` |
| `--color-accent` | Links, highlights | `#22c55e` | `#16a34a` |
| `--color-border` | Borders, dividers | `#262626` | `#e5e5e5` |

### Changing Your Accent Color

The accent color appears on links, the current sidebar item, search highlights, and interactive elements. To change it:

1. Open `static/css/main.css`
2. Find the `[data-theme="dark"]` section
3. Change `--color-accent` to your color
4. Find the `[data-theme="light"]` section
5. Change `--color-accent` to a darker version of your color (for contrast on light backgrounds)

Example using blue:

```css
[data-theme="dark"] {
  --color-accent: #3b82f6;  /* Blue for dark theme */
}

[data-theme="light"] {
  --color-accent: #2563eb;  /* Darker blue for light theme */
}
```

### Complete Theme Example

Here is a complete color palette swap for a purple theme:

```css
[data-theme="dark"] {
  --color-bg: #0c0a14;
  --color-bg-secondary: #1a1625;
  --color-bg-tertiary: #2d2640;
  --color-text: #f3f0ff;
  --color-text-secondary: #b4a9d6;
  --color-text-tertiary: #8b7bb8;
  --color-accent: #a78bfa;
  --color-border: #2d2640;
}

[data-theme="light"] {
  --color-bg: #faf5ff;
  --color-bg-secondary: #f3e8ff;
  --color-bg-tertiary: #e9d5ff;
  --color-text: #1e1b2e;
  --color-text-secondary: #4c3f6b;
  --color-text-tertiary: #6b5b8e;
  --color-accent: #7c3aed;
  --color-border: #e9d5ff;
}
```

## Typography

### Font Families

MarkStack uses IBM Plex fonts by default. The fonts are loaded from Google Fonts in `templates/base.html`.

To change fonts:

1. Choose your fonts from Google Fonts or another source
2. Update the font link in `templates/base.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;500;600;700&display=swap" rel="stylesheet">
```

3. Update the font variables in `static/css/main.css`:

```css
:root {
  --font-sans: 'Your Font', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Your Mono Font', 'Cascadia Code', 'Fira Code', monospace;
}
```

### Font Sizes

The font size scale uses relative units for accessibility:

| Variable | Default | Purpose |
|----------|---------|---------|
| `--font-size-xs` | `0.75rem` | Small labels, badges |
| `--font-size-sm` | `0.875rem` | Secondary text |
| `--font-size-base` | `1rem` | Body text |
| `--font-size-lg` | `1.125rem` | Large body text |
| `--font-size-xl` | `1.25rem` | Subheadings |
| `--font-size-2xl` | `1.5rem` | Section headings |
| `--font-size-3xl` | `1.875rem` | Page titles |

Example of adjusting the scale for larger text:

```css
:root {
  --font-size-base: 1.0625rem;  /* Slightly larger body text */
  --font-size-lg: 1.1875rem;
  --font-size-xl: 1.375rem;
}
```

### Line Height and Spacing

| Variable | Default | Purpose |
|----------|---------|---------|
| `--line-height-tight` | `1.25` | Headings |
| `--line-height-normal` | `1.5` | UI elements |
| `--line-height-relaxed` | `1.75` | Body text |

For more readable body text, increase the relaxed line height:

```css
:root {
  --line-height-relaxed: 1.85;
}
```

## Spacing System

MarkStack uses a consistent spacing scale based on 0.25rem (4px) increments:

| Variable | Value | Pixels |
|----------|-------|--------|
| `--space-1` | `0.25rem` | 4px |
| `--space-2` | `0.5rem` | 8px |
| `--space-3` | `0.75rem` | 12px |
| `--space-4` | `1rem` | 16px |
| `--space-5` | `1.25rem` | 20px |
| `--space-6` | `1.5rem` | 24px |
| `--space-8` | `2rem` | 32px |
| `--space-10` | `2.5rem` | 40px |
| `--space-12` | `3rem` | 48px |

These variables are used throughout the CSS for margins, padding, and gaps. Adjusting them will proportionally scale the entire layout.

## Layout Dimensions

These variables control major layout proportions:

| Variable | Default | Purpose |
|----------|---------|---------|
| `--sidebar-width` | `280px` | Sidebar navigation width |
| `--header-height` | `60px` | Top header height |
| `--content-max-width` | `900px` | Maximum article width |

Example of a wider reading area:

```css
:root {
  --content-max-width: 1000px;
}
```

## Logo Customization

### Replacing the Logo

The logo file is `static/svg/logo.svg`. To replace it:

1. Create or export your logo as an SVG
2. Optimize the SVG (remove unnecessary metadata, minify)
3. Replace the file at `static/svg/logo.svg`

Requirements for the logo:

- Format: SVG (vector format for crisp display at any size)
- Dimensions: 32x32 pixels (viewBox should be 32x32 or proportional)
- Colors: Use `currentColor` if you want the logo to match the theme

### Making the Logo Theme-Aware

To have your logo change color with the theme, use `currentColor` for fills:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <path fill="currentColor" d="M..."/>
</svg>
```

The logo will inherit the text color from the header.

### Adjusting Logo Size

If your logo needs different dimensions, edit the logo element in `templates/base.html`:

```html
<img src="/svg/logo.svg" alt="Logo" class="logo-icon" width="40" height="40">
```

Then adjust the corresponding CSS in `static/css/main.css`:

```css
.logo-icon {
  width: 40px;
  height: 40px;
}
```

## Code Syntax Highlighting

Code block colors are defined in `static/css/hljs-theme.css`. This file contains color definitions for syntax highlighting powered by highlight.js.

### Understanding the Highlight Styles

The file defines colors for different code tokens:

```css
[data-theme="dark"] .hljs {
  --hljs-keyword: #ff7b72;     /* Keywords like if, for, function */
  --hljs-string: #a5d6ff;      /* String literals */
  --hljs-number: #79c0ff;      /* Numeric values */
  --hljs-comment: #8b949e;     /* Comments */
  --hljs-function: #d2a8ff;    /* Function names */
  --hljs-variable: #ffa657;    /* Variables */
  --hljs-type: #7ee787;        /* Type names */
}
```

### Customizing Syntax Colors

To change syntax highlighting colors:

1. Open `static/css/hljs-theme.css`
2. Find the theme section (dark or light)
3. Modify the color values

Example of a more muted syntax theme:

```css
[data-theme="dark"] .hljs {
  --hljs-keyword: #c792ea;
  --hljs-string: #c3e88d;
  --hljs-number: #f78c6c;
  --hljs-comment: #546e7a;
  --hljs-function: #82aaff;
  --hljs-variable: #f07178;
  --hljs-type: #ffcb6b;
}
```

### Code Block Background

The code block background is controlled in `main.css`:

```css
pre.hljs {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
```

## Alert Box Colors

GitHub-style alerts have their own color scheme. Each alert type has a distinct color:

```css
.alert-note {
  --alert-color: #2563eb;
}

.alert-tip {
  --alert-color: #22c55e;
}

.alert-important {
  --alert-color: #a855f7;
}

.alert-warning {
  --alert-color: #eab308;
}

.alert-caution {
  --alert-color: #ef4444;
}
```

To customize alert colors, find these definitions in `main.css` and adjust the color values.

## Sidebar Styling

### Sidebar Background

```css
.sidebar {
  background-color: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
}
```

### Active Item Highlight

```css
.sidebar-current > a {
  background-color: var(--color-accent);
  color: var(--color-bg);
}
```

### Folder and File Icons

The sidebar uses inline SVG icons. To change their appearance:

```css
.sidebar-icon {
  width: 16px;
  height: 16px;
  fill: var(--color-text-secondary);
}
```

## Header Styling

### Header Background

```css
.site-header {
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}
```

### Search Box

```css
.search-container {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
```

## Testing Your Changes

After making changes:

1. Rebuild the site: `npm run build`
2. Preview locally: `npx serve dist`
3. Test both dark and light themes
4. Check on different screen sizes
5. Verify color contrast for accessibility

> [!TIP]
> Use the Lighthouse tool in Chrome DevTools to audit accessibility, including color contrast ratios.

## Common Customization Patterns

### Brand Color Integration

When applying your brand colors, consider the full palette:

- Primary brand color for accents
- Darker variant for hover states
- Lighter variant for backgrounds
- Ensure sufficient contrast for text

### Maintaining Readability

When changing colors:

- Text should have at least 4.5:1 contrast ratio with its background
- Large text (18px+) can use 3:1 contrast ratio
- Interactive elements need distinct hover and focus states

### Dark Theme Considerations

For dark themes:

- Avoid pure black (`#000000`); use dark grays instead
- Keep text slightly off-white to reduce eye strain
- Muted colors often work better than vibrant ones
