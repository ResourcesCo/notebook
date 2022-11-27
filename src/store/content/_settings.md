## Notebook Content

Add new files, rename, and delete them here.

- To delete, add a `"delete": true` property to a file in the editor.
- To rename, add a `"rename": "new-name.md"` property to a file in the editor.
- To apply the changes, click the Apply button on the viewer.
- To reset the JSON data to what it was before, click Reset on the viewer.
- Filenames must end with `.md` and `_newtab.md`, `_settings.md`, and `_welcome.md` cannot be deleted or renamed.
- A property `primaryComponent` may be added to a file and set to `edit` or `view`

[![](https://img.shields.io/badge/%E2%98%95%EF%B8%8F-NotebookView-blue)](https://macchiato.dev/component/#NotebookContent)

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

- To add a tab, add a filename to tabs. It must be in the content above.
- To move a tab, just move the filename within tabs.
- To change the selected tab, put the filename under "selected".
- Settings can be left out because it can be added/removed by clicking the gear.
- The "lastSelected" property is used to restore the state in the settings toggle
  (the gear in the upper-right corner). It can be set to null, or left as-is.
  Currently it isn't validated and just ignored when hiding settings if it
  doesn't point to an existing file.
- To reset the JSON data to what it was before, click Reset on the viewer.

[![](https://img.shields.io/badge/%E2%98%95%EF%B8%8F-NotebookView-blue)](https://macchiato.dev/component/#NotebookView)

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

## LocalStorage Tools

Use this to back up and restore the notebook data (including the content) in LocalStorage.

[![](https://img.shields.io/badge/%E2%98%95%EF%B8%8F-LocalStorageTools-blue)](https://macchiato.dev/component/#LocalStorageTools)

```json
{}
```
