<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import {
  EditorView,
  highlightSpecialChars,
  drawSelection,
  keymap,
  rectangularSelection
} from "@codemirror/view";
import { EditorState, Compartment, Extension } from "@codemirror/state";
import {
  indentOnInput,
  LanguageSupport,
  LanguageDescription,
  foldGutter,
  foldKeymap,
  bracketMatching,
  syntaxHighlighting
} from "@codemirror/language";
import {
  defaultKeymap, history, historyKeymap
} from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { markdown } from "@codemirror/lang-markdown";
import {
  lightHighlightStyle,
  darkHighlightStyle,
  lightTheme,
  darkTheme,
} from "../styles/editor";
import { isDark } from "../modules/store";

export default defineComponent({
  emits: ["change"],
  props: ["page"],
  setup(props, ctx) {
    const codeLanguages = [
      LanguageDescription.of({
        name: "javascript",
        alias: ["js", "jsx"],
        async load() {
          const { jsxLanguage } = await import("@codemirror/lang-javascript");
          return new LanguageSupport(jsxLanguage);
        },
      }),
      LanguageDescription.of({
        name: "typescript",
        alias: ["ts", "tsx"],
        async load() {
          const { tsxLanguage } = await import("@codemirror/lang-javascript");
          return new LanguageSupport(tsxLanguage);
        },
      }),
      LanguageDescription.of({
        name: "css",
        async load() {
          const { cssLanguage } = await import("@codemirror/lang-css");
          return new LanguageSupport(cssLanguage);
        },
      }),
      LanguageDescription.of({
        name: "python",
        alias: ["py"],
        async load() {
          const { pythonLanguage } = await import("@codemirror/lang-python");
          return new LanguageSupport(pythonLanguage);
        },
      }),
      LanguageDescription.of({
        name: "json",
        async load() {
          const { jsonLanguage } = await import("@codemirror/lang-json");
          return new LanguageSupport(jsonLanguage);
        },
      }),
      LanguageDescription.of({
        name: "sql",
        async load() {
          const { sql, PostgreSQL } = await import("@codemirror/lang-sql");
          return sql({ dialect: PostgreSQL });
        },
      }),
      LanguageDescription.of({
        name: "html",
        alias: ["htm"],
        async load() {
          const { jsxLanguage } = await import("@codemirror/lang-javascript");
          const javascript = new LanguageSupport(jsxLanguage);
          const { cssLanguage } = await import("@codemirror/lang-css");
          const css = new LanguageSupport(cssLanguage);
          const { htmlLanguage } = await import("@codemirror/lang-html");

          return new LanguageSupport(htmlLanguage, [css, javascript]);
        },
      }),
    ];

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
                            });
                          },
                        }),
                      ],
                    });
                  },
                }),
              ],
            });
          },
        }),
      ],
    });

    const styleCompartment = new Compartment();

    const root = ref();
    let editor: EditorView;

    // TODO: use reactive
    const darkStyleExtension: readonly Extension[] = [syntaxHighlighting(darkHighlightStyle), darkTheme];
    const lightStyleExtension: readonly Extension[] = [syntaxHighlighting(lightHighlightStyle), lightTheme];
    const getStyleExtension = () => {
      return isDark.value ? darkStyleExtension : lightStyleExtension;
    };
    let styleExtension = getStyleExtension();

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
          ctx.emit("change", editor.state.doc);
        }
      }),
    ];

    watch(isDark, () => {
      const newStyleExtension = getStyleExtension();
      if (newStyleExtension !== styleExtension) {
        styleExtension = newStyleExtension;
        editor.dispatch({ effects: styleCompartment.reconfigure(newStyleExtension) })
      }
    });

    watch(props.page, () => {
      const tr = editor.state.update({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: props.page.body,
        },
      });
      editor.dispatch(tr);
    });

    onMounted(() => {
      editor = new EditorView({
        state: EditorState.create({
          doc: props.page.body,
          extensions,
        }),
        parent: root.value,
      });
    });

    const handleFocus = () => {
      if (editor) {
        editor.focus();
      }
    };

    return {
      root,
      handleFocus,
    };
  },
});
</script>

<template>
  <div @click="handleFocus" class="code-editor flex-grow" ref="root"></div>
</template>
