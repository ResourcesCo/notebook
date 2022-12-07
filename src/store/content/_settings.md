## Notebook Content

Add new files, rename, and delete them here.

- To delete, add a `"delete": true` property to a file in the editor.
- To rename, add a `"rename": "new-name.md"` property to a file in the editor.
- To apply the changes, click the Apply button on the viewer.
- To reset the JSON data to what it was before, click Reset on the viewer.
- Filenames must end with `.md` and `_newtab.md`, `_settings.md`, and `_welcome.md` cannot be deleted or renamed.
- A property `primaryComponent` may be added to a file and set to `edit` or `view`

[`NotebookContent`](https://macchiato.dev/component/#NotebookContent)

```json
{
  "files": {
    "_newtab.md": {
      "emoji": "🗂",
      "title": "New Tab"
    },
    "_settings.md": {
      "emoji": "⚙️",
      "title": "Settings"
    },
    "_welcome.md": {
      "emoji": "👋",
      "title": "Welcome"
    },
    "notes-example.md": {
      "emoji": "🗒",
      "title": "Notes Example",
      "primaryComponent": "edit"
    },
    "request-example.md": {
      "emoji": "🌐",
      "title": "Request Example",
      "primaryComponent": "edit"
    },
    "sandbox-example.md": {
      "emoji": "🏝",
      "title": "Sandbox Example",
      "primaryComponent": "edit"
    }
  }
}
```

## Permissions

These are the permissions. Here is an example, that allows the `request-example.md` file to make HTTP requests to `https://httpbin.org/post` and send the environment variable `HTTPBIN_API_KEY` in `Authorization`. It can't directly access `HTTPBIN_API_KEY`. It is not scrubbed from the response, however, so because httpbin uses it, it can access it!

[`permissions`](https://macchiato.dev/component/#Permissions)

```json
{
  "permissions": [
    {
      "grantee": {
        "file": "request-example.md"
      },
      "requests": [
        {
          "urlPatterns": [
            "https://httpbin.org/post"
          ],
          "authorizationEnv": "HTTPBIN_API_KEY"
        }
      ]
    }
  ]
}
```

<details>
  <summary>Example</summary>

```json
{
  "permissions": [
    {
      "grantee": {
        "file": "request-example.md"
      },
      "requests": [
        {
          "urlPatterns": [
            "https://httpbin.org/post"
          ],
          "authorizationEnv": "HTTPBIN_API_KEY"
        }
      ]
    }
  ]
}
```

</details>

## Environment

Enter environment information, such as account IDs and API keys here.

[`environment`](https://macchiato.dev/component/#Environment)

```json
{}
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

[`NotebookView`](https://macchiato.dev/component/#NotebookView)

```json
{
  "left": {
    "tabs": [
      "notes-example.md",
      "sandbox-example.md",
      "request-example.md"
    ],
    "selected": "request-example.md",
    "lastSelected": null,
    "show": "other"
  },
  "right": {
    "tabs": [
      "_welcome.md",
      "_settings.md"
    ],
    "selected": "_settings.md",
    "lastSelected": "_settings.md",
    "show": "self"
  }
}
```

## LocalStorage Tools

Use this to back up and restore the notebook data (including the content) in LocalStorage.

[`LocalStorageTools`](https://macchiato.dev/component/#LocalStorageTools)

```json
{}
```
