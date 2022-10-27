import { HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

import editorThemeLight from './editorThemeLight'
import editorThemeDark from './editorThemeDark'

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

export const lightTheme = editorThemeLight
export const darkTheme = editorThemeDark