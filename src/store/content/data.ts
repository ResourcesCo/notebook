import { NotebookContent, NotebookView } from "../notebook"

export const defaultContent: NotebookContent = {
  files: {
    "_newtab.md": {
      "emoji": "🗂",
      "title": "New Tab",
    },
    "_welcome.md": {
      "emoji": "👋",
      "title": "Welcome",
    },
    "_settings.md": {
      "emoji": "⚙️",
      "title": "Settings",
    },
    "notes-example.md": {
      "emoji": "🗒",
      "title": "Notes Example",
      "primaryComponent": "edit",
    },
    "sandbox-example.md": {
      "emoji": "🏝",
      "title": "Sandbox Example",
      "primaryComponent": "edit",
    },
    "request-example.md": {
      "emoji": "🌐",
      "title": "Request Example",
      "primaryComponent": "edit",
    },
  }
}
export const defaultView: NotebookView = {
  "left": {
    "tabs": ["notes-example.md", "sandbox-example.md", "request-example.md"],
    "selected": "notes-example.md",
    "lastSelected": null,
    "show": "self",
  },
  "right": {
    "tabs": ["_welcome.md"],
    "selected": "_welcome.md",
    "lastSelected": null,
    "show": "self",
  },
}