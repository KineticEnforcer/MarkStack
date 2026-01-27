---
title: Visual Editor
description: Use the built-in visual markdown editor to write and preview documentation with live rendering, syntax highlighting, and scroll sync.
---

# Visual Editor

MarkStack includes a browser-based visual editor that lets you write markdown while seeing a live preview styled exactly like your final site. The editor eliminates the need to constantly rebuild and refresh your browser during content authoring.

## Starting the Editor

Launch the visual editor with:

```bash
npm run editor
```

This starts a local server and opens the editor in your browser at `http://localhost:3001`. The editor runs entirely locally—no content is sent to external servers.

> [!TIP]
> Use the visual editor for focused writing sessions where you want immediate feedback. For quick edits or working with Git workflows, editing markdown files directly works just as well.

## Editor Interface

The editor provides a complete authoring environment with four main areas:

### File Tree Panel

The left panel displays all files and folders in your `content/` directory:

- **Folders** show with folder icons and can be expanded or collapsed
- **Files** show with file icons and their names
- **Current file** is highlighted in the tree
- **Unsaved changes** are indicated with an asterisk (*) next to the file name

Right-click any item to access actions like rename, delete, or create new files and folders.

### Editor Panel

The center panel is where you write markdown:

- **Syntax highlighting** for markdown formatting, code blocks, and frontmatter
- **Line numbers** for easy reference
- **Monospace font** for precise character alignment
- **Tab key** inserts spaces (configurable indentation)
- **Auto-save detection** tracks unsaved changes

The editor uses your system's native text input for familiar keyboard shortcuts like undo, redo, copy, and paste.

### Preview Panel

The right panel shows a live preview of your content:

- **Real-time rendering** updates as you type
- **Identical styling** to your built site
- **Working code highlighting** for all supported languages
- **GitHub-style alerts** render with proper icons and colors
- **Task lists** display with checkboxes
- **Mermaid diagrams** render interactively

The preview uses the same CSS as your production site, so what you see in the preview is exactly what appears in the final build.

### Toolbar

The toolbar at the top provides quick access to common actions:

| Button | Action | Keyboard Shortcut |
|--------|--------|-------------------|
| Save | Save current file | Ctrl+S |
| Build | Rebuild the entire site | Ctrl+B |
| Scroll Sync | Toggle synchronized scrolling | — |

## Features

### Live Preview

As you type in the editor, the preview panel updates automatically with a short debounce delay to avoid constant re-rendering. Changes appear within 300 milliseconds of your last keystroke.

The preview renders:

- Standard markdown formatting
- Frontmatter (displayed as a subtle header)
- Code blocks with syntax highlighting
- GitHub-style alerts (NOTE, TIP, IMPORTANT, WARNING, CAUTION)
- Task lists with checkboxes
- Tables
- Footnotes
- Mermaid diagrams

### Scroll Synchronization

When Scroll Sync is enabled (the default), scrolling in one panel automatically scrolls the other to the corresponding position. This keeps your editing position and preview aligned.

Toggle scroll sync using the button in the toolbar. The button appears highlighted when sync is active.

> [!NOTE]
> Scroll sync works best with content that has similar length in source and rendered form. Very long code blocks or complex elements may cause slight alignment differences.

### File Management

#### Creating Files

1. Right-click a folder in the file tree
2. Select "New File"
3. Enter a filename (the `.md` extension is added automatically if omitted)
4. The new file opens in the editor with basic frontmatter

#### Creating Folders

1. Right-click the parent folder (or root)
2. Select "New Folder"
3. Enter a folder name
4. Create an `_index.md` file inside to define the category

#### Renaming Items

1. Right-click the file or folder
2. Select "Rename"
3. Enter the new name
4. The file tree updates automatically

#### Deleting Items

1. Right-click the file or folder
2. Select "Delete"
3. Confirm the deletion in the modal dialog

> [!CAUTION]
> Deleting a folder removes all files and subfolders inside it. This action cannot be undone.

### Saving Files

Save your work using:

- **Ctrl+S** keyboard shortcut
- **Save button** in the toolbar

The save button shows "Saved ✓" briefly after a successful save. If you have unsaved changes and try to open a different file, the editor prompts you to save or discard your changes.

### Building the Site

Trigger a full site rebuild from the editor using:

- **Ctrl+B** keyboard shortcut
- **Build button** in the toolbar

The build button shows "Building..." during the process and "Built ✓" when complete. Building is useful when you want to test navigation, search, or other site-wide features that require the full static site.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Save current file |
| Ctrl+B | Build entire site |
| Ctrl+/ | Toggle comment (in frontmatter) |
| Tab | Insert indentation |
| Shift+Tab | Remove indentation |

Standard text editing shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+C, Ctrl+V, etc.) work as expected.

## Best Practices

### Use the Editor for Writing

The visual editor excels at content creation where immediate preview feedback is valuable:

- Writing new documentation pages
- Drafting complex markdown with alerts and code blocks
- Reviewing how content will appear before publishing

### Use Direct File Editing for Quick Changes

For small edits or batch operations, editing files directly in your code editor may be faster:

- Fixing typos across multiple files
- Search and replace operations
- Git-based workflows with staging and committing

### Preview Before Publishing

Always review your content in the preview panel before saving. The preview catches formatting issues that might not be obvious in raw markdown:

- Broken code block syntax
- Malformed alerts
- Incorrect heading levels
- Missing frontmatter fields

## Troubleshooting

### Editor Does Not Load

If the editor page shows an error:

1. Verify the server is running (`npm run editor` in a terminal)
2. Check the terminal for error messages
3. Ensure port 3001 is not in use by another application
4. Try stopping and restarting the server

### Preview Not Updating

If the preview stops updating:

1. Check for JavaScript errors in the browser console (F12)
2. Refresh the page to reset the editor state
3. Verify the file saved correctly

### Files Not Appearing in Tree

If new files do not appear:

1. Ensure files are saved in the `content/` directory
2. Check that file extensions are `.md`
3. Refresh the page to reload the file tree

### Save Button Shows Error

If saving fails:

1. Check the terminal for error messages
2. Verify the file path is valid
3. Ensure you have write permissions to the content folder

## Technical Details

The visual editor consists of two components:

### Editor Server (editor-server.js)

A Node.js HTTP server that provides:

- Static file serving for the editor interface
- REST API for file operations (read, write, create, delete, rename)
- File tree endpoint for navigation
- Site build trigger endpoint

The server runs on port 3001 by default and only accepts connections from localhost for security.

### Editor Interface (editor.html)

A single-page application with:

- Split-panel layout (file tree, editor, preview)
- Real-time markdown rendering using the same pipeline as builds
- Syntax highlighting via highlight.js
- Mermaid diagram rendering via CDN
- Persistent scroll position synchronization

Both components are designed for local development use. The editor is not intended for production deployment or multi-user access.
