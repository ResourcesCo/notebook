<script lang="ts" setup>
import { defineComponent, ref, onMounted, watch, PropType, Ref, watchEffect } from "vue"
import {
  EditorView,
  highlightSpecialChars,
  drawSelection,
  keymap,
  rectangularSelection,
  KeyBinding
} from "@codemirror/view"
import { EditorState, Compartment, Extension, Prec, Text } from "@codemirror/state"
import {
  indentOnInput,
  LanguageSupport,
  LanguageDescription,
  foldGutter,
  foldKeymap,
  bracketMatching,
  syntaxHighlighting
} from "@codemirror/language"
import {
  defaultKeymap, history, historyKeymap
} from "@codemirror/commands"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap
} from "@codemirror/autocomplete"
import { lintKeymap } from "@codemirror/lint"
import { markdown as originalMarkdown } from "@codemirror/lang-markdown"
import { yCollab } from 'y-codemirror.next'
import {
  lightHighlightStyle,
  darkHighlightStyle,
  lightTheme,
  darkTheme,
} from "../../../styles/editor"
import { isDark } from "../../../store"
import { insertNewlineContinueMarkup, deleteMarkupBackward } from '../../../vendor/commands'
import * as Y from 'yjs'

const props = defineProps({
  page: {
    type: Object as PropType<{body: string}>,
    required: true,
  },
  yText: {
    type: Object as PropType<Y.Text>,
    required: true,
  },
  undoManager: {
    type: Object as PropType<Y.UndoManager>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'change', value: Text): void
}>()

const markdownKeymap: readonly KeyBinding[] = [
  {key: "Enter", run: insertNewlineContinueMarkup},
  {key: "Backspace", run: deleteMarkupBackward}
]

const markdown = ({codeLanguages}: {codeLanguages: readonly LanguageDescription[]}) => {
  const { language, support } = originalMarkdown({codeLanguages, addKeymap: false})
  return new LanguageSupport(language, [...(support as Extension[]), Prec.high(keymap.of(markdownKeymap))])
}

const codeLanguages = [
  LanguageDescription.of({
    name: "javascript",
    alias: ["js", "jsx"],
    async load() {
      const { jsxLanguage } = await import("@codemirror/lang-javascript")
      return new LanguageSupport(jsxLanguage)
    },
  }),
  LanguageDescription.of({
    name: "typescript",
    alias: ["ts", "tsx"],
    async load() {
      const { tsxLanguage } = await import("@codemirror/lang-javascript")
      return new LanguageSupport(tsxLanguage)
    },
  }),
  LanguageDescription.of({
    name: "css",
    async load() {
      const { cssLanguage } = await import("@codemirror/lang-css")
      return new LanguageSupport(cssLanguage)
    },
  }),
  LanguageDescription.of({
    name: "python",
    alias: ["py"],
    async load() {
      const { pythonLanguage } = await import("@codemirror/lang-python")
      return new LanguageSupport(pythonLanguage)
    },
  }),
  LanguageDescription.of({
    name: "json",
    async load() {
      const { jsonLanguage } = await import("@codemirror/lang-json")
      return new LanguageSupport(jsonLanguage)
    },
  }),
  LanguageDescription.of({
    name: "sql",
    async load() {
      const { sql, PostgreSQL } = await import("@codemirror/lang-sql")
      return sql({ dialect: PostgreSQL })
    },
  }),
  LanguageDescription.of({
    name: "html",
    alias: ["htm"],
    async load() {
      const { jsxLanguage } = await import("@codemirror/lang-javascript")
      const javascript = new LanguageSupport(jsxLanguage)
      const { cssLanguage } = await import("@codemirror/lang-css")
      const css = new LanguageSupport(cssLanguage)
      const { htmlLanguage } = await import("@codemirror/lang-html")

      return new LanguageSupport(htmlLanguage, [css, javascript])
    },
  }),
]

const markdownLanguage = markdown({
  codeLanguages: [
    ...codeLanguages,
    LanguageDescription.of({
      name: "markdown",
      alias: ["md", "mkd"],
      async load() {
        return markdown({
          codeLanguages: [
            ...codeLanguages,
            LanguageDescription.of({
              name: "markdown",
              alias: ["md", "mkd"],
              async load() {
                return markdown({
                  codeLanguages: [
                    ...codeLanguages,
                    LanguageDescription.of({
                      name: "markdown",
                      alias: ["md", "mkd"],
                      async load() {
                        return markdown({
                          codeLanguages,
                        })
                      },
                    }),
                  ],
                })
              },
            }),
          ],
        })
      },
    }),
  ],
})

const styleCompartment = new Compartment()

const root = ref()
let editor: EditorView

// TODO: use reactive
const darkStyleExtension: readonly Extension[] = [syntaxHighlighting(darkHighlightStyle), darkTheme]
const lightStyleExtension: readonly Extension[] = [syntaxHighlighting(lightHighlightStyle), lightTheme]
const getStyleExtension = () => {
  return isDark.value ? darkStyleExtension : lightStyleExtension
}
let styleExtension = getStyleExtension()

watch(isDark, () => {
  const newStyleExtension = getStyleExtension()
  if (newStyleExtension !== styleExtension) {
    styleExtension = newStyleExtension
    editor.dispatch({ effects: styleCompartment.reconfigure(newStyleExtension) })
  }
})

onMounted(() => {
  const extensions = [
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    autocompletion({ activateOnTyping: false }),
    rectangularSelection(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ]),
    markdownLanguage,
    styleCompartment.of(styleExtension),
    EditorView.lineWrapping,
    EditorView.updateListener.of((v) => {
      if (v.docChanged) {
        emit("change", editor.state.doc)
      }
    }),
    yCollab(props.yText, undefined, { undoManager: props.undoManager })
  ]

  editor = new EditorView({
    state: EditorState.create({
      doc: props.yText.toString(),
      extensions,
    }),
    parent: root.value,
  })
  console.log(String(editor.state.doc))
})

const handleFocus = () => {
  if (editor) {
    editor.focus()
  }
}
</script>

<template>
  <div @click="handleFocus" class="code-editor flex-grow" ref="root"></div>
</template>
