## Notebook Content

Add new files, rename, and delete them here.

- To delete, add a `"delete": true` property to a file in the editor.
- To rename, add a `"rename": "new-name.md"` property to a file in the editor.
- To apply the changes, click the Apply button on the viewer.
- To reset the JSON data to what it was before, click Reset on the viewer.

[![](https://img.shields.io/badge/%E2%98%95%EF%B8%8F-NotebookView-blue)](https://machiatto.dev/component/#NotebookContent)

```json
{
  "files": {
    "_newtab.md": {
      "emoji": "🗂",
      "title": "New Tab"
    },
    "_welcome.md": {
      "emoji": "👋",
      "title": "Welcome"
    },
    "_settings.md": {
      "emoji": "⚙️",
      "title": "Settings"
    }
  }
}
```

## Notebook View

Edit the tabs here.

[![](https://img.shields.io/badge/%E2%98%95%EF%B8%8F-NotebookView-blue)](https://machiatto.dev/component/#NotebookView)

```json
{
  "left": {
    "tabs": ["_newtab.md"],
    "selected": "_newtab.md",
    "lastSelected": null,
    "show": "self"
  },
  "right": {
    "tabs": ["_welcome.md"],
    "selected": "_welcome.md",
    "lastSelected": null,
    "show": "self"
  }
}
```
