---
title: Customization
description: Learn how to customize your MarkStack site's appearance with themes, colors, typography, logos, and template modifications.
---

# Customization

MarkStack ships with a clean, professional design that works well for most documentation sites. When you need to match your brand or adjust the design, this section shows you how to customize every visual aspect of your site.

## Customization Approach

MarkStack uses CSS custom properties (CSS variables) for theming. This approach means:

- **No build tools required**: Edit CSS files directly, save, and rebuild
- **Consistent changes**: Update a color once, it changes everywhere
- **Theme support**: Dark and light themes share the same structure, just different values
- **Easy experimentation**: Try changes quickly without complex toolchains

All customization happens in three locations:

| File | Purpose |
|------|---------|
| `static/css/main.css` | Colors, typography, spacing, layout |
| `static/css/hljs-theme.css` | Code syntax highlighting colors |
| `templates/base.html` | Page structure, scripts, meta tags |

## What This Section Covers

### Themes and Styling

The [Themes and Styling](/customization/themes/) guide covers visual customization:

- Changing colors for dark and light themes
- Adjusting typography (fonts, sizes, weights)
- Modifying spacing and layout proportions
- Customizing code block appearance
- Replacing the logo
- Making your site match your brand

This is the guide for changing how your site looks without modifying the underlying structure.

### Templates

The [Templates](/customization/templates/) guide covers structural customization:

- Understanding the HTML template and placeholders
- Adding analytics scripts
- Including additional meta tags
- Modifying the page layout
- Extending the build process for new features

This is the guide for changing what your site includes or how pages are structured.

## Common Customization Tasks

Here are quick references for the most common customizations:

### Change the Accent Color

Edit `static/css/main.css` and find the `--color-accent` variable:

```css
[data-theme="dark"] {
  --color-accent: #22c55e;  /* Change this */
}

[data-theme="light"] {
  --color-accent: #16a34a;  /* And this */
}
```

### Replace the Logo

Replace `static/svg/logo.svg` with your own SVG file. Keep it at 32x32 pixels for best results.

### Change Fonts

Edit the font variables in `static/css/main.css`:

```css
:root {
  --font-sans: 'Your Font', -apple-system, sans-serif;
  --font-mono: 'Your Mono Font', monospace;
}
```

### Add Analytics

Edit `templates/base.html` and add your analytics script before the closing `</head>` tag.

## Design Philosophy

MarkStack's default design follows these principles:

- **Readability first**: Typography optimized for long-form reading
- **Reduce visual noise**: Clean lines, consistent spacing, minimal decoration
- **Accessibility**: Color contrasts meet WCAG guidelines, keyboard navigation works
- **Responsive**: Works on phones, tablets, and desktops

When customizing, consider maintaining these qualities. Test your changes across screen sizes and verify color contrast for accessibility.

## Before You Customize

Before making changes:

1. Build the default site and preview it to understand the baseline
2. Identify specifically what you want to change
3. Make one change at a time and verify it works
4. Keep notes on what you changed for future reference

> [!TIP]
> Use your browser's developer tools to inspect elements and experiment with CSS changes before editing files. Press F12 in most browsers to open developer tools.
