<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import {
  EditorView,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  keymap,
  placeholder,
} from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { history, historyKeymap } from '@codemirror/history'
import { foldGutter, foldKeymap } from '@codemirror/fold'
import {
  indentOnInput,
  LanguageSupport,
  LanguageDescription,
} from '@codemirror/language'
import { defaultKeymap } from '@codemirror/commands'
import { bracketMatching } from '@codemirror/matchbrackets'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { commentKeymap } from '@codemirror/comment'
import { rectangularSelection } from '@codemirror/rectangular-selection'
import { lintKeymap } from '@codemirror/lint'
import { jsxLanguage } from '@codemirror/lang-javascript'
import { htmlLanguage } from '@codemirror/lang-html'
import { cssLanguage } from '@codemirror/lang-css'
import { pythonLanguage } from '@codemirror/lang-python'
import { markdown } from '@codemirror/lang-markdown'
import { jsonLanguage } from '@codemirror/lang-json'
import { sql, PostgreSQL } from '@codemirror/lang-sql'
import {
  lightHighlightStyle,
  darkHighlightStyle,
  lightTheme,
  darkTheme,
} from '../styles/editor'

export default defineComponent({
  setup(props, _ctx) {
    const codeLanguages: { [key: string]: LanguageSupport } = {
      javascript: new LanguageSupport(jsxLanguage),
      css: new LanguageSupport(cssLanguage),
      python: new LanguageSupport(pythonLanguage),
      json: new LanguageSupport(jsonLanguage),
      sql: sql({ dialect: PostgreSQL }),
    }
    codeLanguages.html = new LanguageSupport(htmlLanguage, [
      codeLanguages.css, codeLanguages.javascript
    ]);
    const lang = (name: string, extraProps = {}) => (
      LanguageDescription.of({
        name,
        async load() {
          return codeLanguages[name]
        },
        ...extraProps
      })
    )
    const markdownLanguage = markdown({
      codeLanguages: [
        lang('javascript', { alias: ['js', 'jsx'] }),
        lang('css'),
        lang('python', { alias: ['py'] }),
        lang('json'),
        lang('sql'),
        lang('html', { alias: ['htm'] }),
      ]
    })

    const styleCompartment = new Compartment()

    const root = ref()
    let editor: EditorView

    // TODO: use reactive
    const darkStyleExtension = [darkHighlightStyle, darkTheme]
    const lightStyleExtension = [lightHighlightStyle, lightTheme]
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const getStyleExtension = () => {
      const setting = localStorage.getItem('color-schema') || 'auto'
      const isDark = (setting === 'dark' ? true :
        (setting === 'light' ? false : prefersDark))
      return isDark ? darkStyleExtension : lightStyleExtension
    }
    let styleExtension = getStyleExtension()

    const extensions = [
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...commentKeymap,
        ...completionKeymap,
        ...lintKeymap,
      ]),
      markdownLanguage,
      styleCompartment.of(styleExtension),
      EditorView.lineWrapping,
      placeholder('# Enter some markdown here...'),
    ]

    const updateStyle = () => {
      const newStyleExtension = getStyleExtension()
      if (newStyleExtension !== styleExtension) {
        styleExtension = newStyleExtension
        editor.dispatch({
          effects: styleCompartment.reconfigure(styleExtension)
        })
      }
    }

    onMounted(() => {
      editor = new EditorView({
        state: EditorState.create({
          doc: '',
          extensions,
        }),
        parent: root.value,
      })
      window.addEventListener('storage', updateStyle)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('storage', updateStyle)
    })

    const handleFocus = () => {
      if (editor) {
        editor.focus()
      }
    }

    return {
      root,
      handleFocus,
    }
  }
})

</script>

<template>
  <div @click="handleFocus" class="code-editor flex-grow" ref="root"></div>
</template>
