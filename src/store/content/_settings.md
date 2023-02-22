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

## Containers

[`containers`](https://macchiato.dev/component/#Containers)

Containers give pages access to storage, environment variables, and the network through rules.

The "pages" property takes a path or a list of paths to pages, that are matched using [path-to-regexp](https://www.npmjs.com/package/path-to-regexp). The last container in the list matching the page is used.

```json
{
  "containers": {}
}
```

<details>
  <summary>Example</summary>

This allows the `request-example.md` file to make HTTP requests to `https://httpbin.org/post` and provides the environment variable `HTTPBIN_API_KEY` for use in `Authorization`. It can't directly access `HTTPBIN_API_KEY`. It is not scrubbed from the response, however, so because httpbin uses it, it can access it!

Note: if you allow any type of content, including images, on a server, data in a container could be encoded into the path or query string of a URL and sent to a server. So if you don't trust the server operator and any private data is stored or accessed in the container, don't run untrusted code in the container. As a quick example, if a page can access images on a server, code in the client could take the data in the page, base64 encode it, and create an image tag with the base64 encoded data in the querystring of the URL (`example.com/cat.png?SECRET_INFO`) and the server operator could go into the logs and get SECRET_INFO. So, rather than running untrusted code in a container that has access to servers you don't trust, review the code first before running it, or run it in a container that doesn't have access to any servers you don't trust. Also make sure the logs of the server that the notebook is running on are private and secure, whether self-hosting it or using someone else's service, because containers default to include the `self` source in the Content Security Policy.

GitLab proxies external content through `user-content.gitlab-static.net`. This approach could be used to prevent HTTP requests that could contain data. URLs could be transformed while rendering the content and for any that are missed, a MutationObserver could be used to update URLs as they appear (loading them would still need to be blocked by a Content Security Policy because it may not be able to transform them before the browser tries to load them).

```json
{
  "containers": {
    "sandbox-example": {
      "pages": "sandbox-example.md",
      "content": {
        "placekitten.com": {
          "img": true
        }
      }
    },
    "request-example": {
      "pages": "request-example.md",
      "content": {
        "jsonplaceholder.typicode.com": {
          "request": {
            "headers": {
              "Authorization": {
                "env": "API_KEY"
              }
            },
            "confirm": true
          }
        },
        "cdn.jsdelivr.net": {
          "script": true,
          "style": true,
          "media": true,
          "font": true,
          "img": true,
          "object": true
        },
        "placekitten.com": {
          "img": true
        }
      }
    }
  }
}
```

</details>

## Environment

Enter environment information, such as account IDs and API keys here.

Each environment variable should either have a string for the value, or the object `{"secret": true}`. The `{"secret": true}` indicates that it will appear in a separate place for secrets, that can be excluded from publishing, syncing, and versioning.

The secrets will be entered on the view side, rather than the editor side, so they won't appear in the undo history.

[`environment`](https://macchiato.dev/component/#Environment)

```json
{}
```

<details>
  <summary>Example</summary>

```json
{
  "HTTPBIN_USERNAME": "testing",
  "HTTPBIN_API_KEY": {
    "secret": true
  }
}
```

</details>

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
