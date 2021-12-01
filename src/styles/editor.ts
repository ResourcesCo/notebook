// Based on https://github.com/codemirror/theme-one-dark
// Copyright (C) 2018-2021 by Marijn Haverbeke <marijnh@gmail.com> and others
// MIT License: https://github.com/codemirror/theme-one-dark/blob/main/LICENSE

import { HighlightStyle, tags as t } from "@codemirror/highlight";
import { EditorView } from "@codemirror/view";

// Based on https://github.com/codemirror/highlight
// Copyright (C) 2018-2021 by Marijn Haverbeke <marijnh@gmail.com> and others
// MIT License: https://github.com/codemirror/highlight/blob/main/LICENSE

export const lightHighlightStyle = HighlightStyle.define([
  { tag: t.link, textDecoration: "underline" },
  { tag: t.heading, textDecoration: "underline", fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.keyword, color: "#708" },
  {
    tag: [t.atom, t.bool, t.url, t.contentSeparator, t.labelName],
    color: "#219",
  },
  { tag: [t.literal, t.inserted], color: "#164" },
  { tag: [t.string, t.deleted], color: "#a11" },
  { tag: [t.regexp, t.escape, t.special(t.string)], color: "#e40" },
  { tag: t.definition(t.variableName), color: "#00f" },
  { tag: t.local(t.variableName), color: "#30a" },
  { tag: [t.typeName, t.namespace], color: "#085" },
  { tag: t.className, color: "#167" },
  {
    tag: [t.special(t.variableName), t.macroName, t.local(t.variableName)],
    color: "#256",
  },
  { tag: t.definition(t.propertyName), color: "#00c" },
  { tag: t.comment, color: "#940" },
  { tag: t.meta, color: "#7a757a" },
  { tag: t.invalid, color: "#f00" },
]);

const chalky = "#e5c07b",
  coral = "#e06c75",
  cyan = "#56b6c2",
  invalid = "#ffffff",
  ivory = "#abb2bf",
  stone = "#5c6370",
  malibu = "#61afef",
  sage = "#98c379",
  whiskey = "#d19a66",
  violet = "#c678dd";

/// The highlighting style for code in the One Dark theme.
export const darkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: violet },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: coral,
  },
  { tag: [t.processingInstruction, t.string, t.inserted], color: sage },
  { tag: [t.function(t.variableName), t.labelName], color: malibu },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: whiskey },
  { tag: [t.definition(t.name), t.separator], color: ivory },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: chalky,
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: cyan,
  },
  { tag: [t.meta, t.comment], color: stone },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.link, color: stone, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: coral },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: whiskey },
  { tag: t.invalid, color: invalid },
]);

// Based on https://github.com/codemirror/theme-one-dark
// Copyright (C) 2018-2021 by Marijn Haverbeke <marijnh@gmail.com> and others
// MIT License: https://github.com/codemirror/theme-one-dark/blob/main/LICENSE

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors

const lightColors = {
  foreground: "rgb(55, 65, 81)",
  lightBackground: "#fff",
  highlightBackground: "#2c313a",
  background: "#fff",
  selection: "#339cec33",
  cursor: "#528bff",
};

/// The editor theme styles for One Dark, customized to light.
export const lightTheme = EditorView.theme(
  {
    "&": {
      color: lightColors.foreground,
      backgroundColor: lightColors.background,
      caretColor: lightColors.cursor,
    },

    "&.cm-wrap": {
      outline: "none",
    },

    "&.cm-wrap .cm-scroller": {
      outline: "none",
    },

    "&.cm-wrap .cm-content": {
      outline: "none",
    },

    "&.cm-focused .cm-cursor": { borderLeftColor: lightColors.cursor },
    "&.cm-focused .cm-selectionBackground": {
      backgroundColor: lightColors.selection,
    },

    ".cm-panels": {
      backgroundColor: lightColors.lightBackground,
      color: lightColors.foreground,
    },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid #d9d9d9" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid #d9d9d9" },

    ".cm-searchMatch": {
      backgroundColor: "#339cec33",
      outline: "1px solid #d9d9d9",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#339cec33",
    },

    ".cm-activeLine": { backgroundColor: lightColors.background },
    ".cm-selectionMatch": { backgroundColor: "#aafe661a" },

    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "#bad0f847",
      outline: "1px solid #515a6b",
    },

    ".cm-gutters": {
      backgroundColor: lightColors.background,
      color: "#545868",
      border: "none",
    },
    ".cm-lineNumbers .cm-gutterElement": { color: "inherit" },

    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#ddd",
    },

    ".cm-tooltip": {
      border: "1px solid #181a1f",
      backgroundColor: lightColors.lightBackground,
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: lightColors.highlightBackground,
        color: lightColors.foreground,
      },
    },
  },
  { dark: false }
);

// Based on https://github.com/codemirror/theme-one-dark
// Copyright (C) 2018-2021 by Marijn Haverbeke <marijnh@gmail.com> and others
// MIT License: https://github.com/codemirror/theme-one-dark/blob/main/LICENSE

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors

// duplicate colors from highlight theme omitted
const darkColors = {
  darkBackground: "#21252b",
  highlightBackground: "#2c313a",
  background: "#121212",
  selection: "#3E4451",
  cursor: "#528bff",
};

/// The editor theme styles for One Dark.
export const darkTheme = EditorView.theme(
  {
    "&": {
      color: "rgb(229, 231, 235)",
      backgroundColor: darkColors.background,
      "& ::selection": { backgroundColor: darkColors.selection },
      caretColor: darkColors.cursor,
    },

    "&.cm-wrap": {
      outline: "none",
    },

    "&.cm-wrap .cm-scroller": {
      outline: "none",
    },

    "&.cm-wrap .cm-content": {
      outline: "none",
    },

    "&.cm-focused .cm-cursor": { borderLeftColor: darkColors.cursor },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: darkColors.selection,
    },

    ".cm-panels": { backgroundColor: darkColors.darkBackground, color: ivory },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

    ".cm-searchMatch": {
      backgroundColor: "#72a1ff59",
      outline: "1px solid #457dff",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#6199ff2f",
    },

    ".cm-activeLine": { backgroundColor: darkColors.background },
    ".cm-selectionMatch": { backgroundColor: "#aafe661a" },

    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "#bad0f847",
      outline: "1px solid #515a6b",
    },

    ".cm-gutters": {
      backgroundColor: darkColors.background,
      color: stone,
      border: "none",
    },
    ".cm-lineNumbers .cm-gutterElement": { color: "inherit" },

    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#ddd",
    },

    ".cm-tooltip": {
      border: "1px solid #181a1f",
      backgroundColor: darkColors.darkBackground,
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: darkColors.highlightBackground,
        color: ivory,
      },
    },
  },
  { dark: true }
);
