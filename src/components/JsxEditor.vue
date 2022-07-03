<template>
  <div>
    <header class="header">
      <div class="container">
        <div class="header-left">
          <h1>JSX Live Editor</h1>
          <h2>
            {{ version }},
            <a
              target="_blank"
              href="https://github.com/sodatea/vue-jsx-playground"
            >
              check out source code
            </a>
          </h2>
        </div>
        <div class="header-right">
          <select
            v-model="mode"
            aria-label="Select JSX mode"
            class="form-control"
          >
            <option value="vue">Vue</option>
            <option value="react">React</option>
          </select>
          <!-- <button class="form-control save-button" @click="saveGist">
            Save as Gist
          </button> -->
        </div>
      </div>
    </header>

    <div class="editors">
      <editor-window title="input" width="500px" style="margin: 0 20px">
        <code-mirror v-model="input" class="input" :options="editorOptions" />
      </editor-window>
      <editor-window title="result" width="500px" style="margin: 0 20px">
        <div class="result">
          <pre class="code cm-s-default"><code v-html="result" /></pre>
          <div v-show="error" class="error">{{ error }}</div>
        </div>
      </editor-window>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EditorWindow } from 'vue-windows'
import highlight from 'cm-highlight'
import CodeMirror from 'vue-cm'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/jsx/jsx'
import { version as BABEL_VERSION } from '@babel/standalone/package.json'
import { version as VUE_JSX_VERSION } from '@vue/babel-preset-jsx/package.json'
import { onMounted, ref, watch } from 'vue'
import type { TransformOptions } from '@babel/core'

import 'normalize.css/normalize.css'
import 'codemirror/lib/codemirror.css'
import 'vue-windows/dist/vue-windows.css'

const defaultValue = `
<div id="welcome">
  <h1>Hello World!</h1>
</div>
`.trim()

// const { input, mode } = { input: '', mode: '' } //this.$route.query

const result = ref('Loading...')
const error = ref('')
const mode = ref<'vue' | 'react'>('vue')
const input = ref('' /* input */ || defaultValue)
const version = `@babel/standalone@${BABEL_VERSION} & @vue/babel-preset-jsx@${VUE_JSX_VERSION}`

const editorOptions = {
  mode: 'jsx',
  tabSize: 2,
  indentWithTabs: false,
  extraKeys: {
    Tab: (cm) => {
      cm.replaceSelection(' '.repeat(cm.getOption('tabSize')))
    },
  },
}

const transform = async () => {
  try {
    const [babel, vueJSXPreset] = await Promise.all([
      import('@babel/standalone'),
      // @ts-expect-error
      import('@vue/babel-preset-jsx').then((r) => r.default),
    ])
    const transformOptions: TransformOptions = {
      presets: [],
      plugins: [],
    }
    if (mode.value === 'vue') {
      transformOptions.presets!.push(vueJSXPreset)
    } else if (mode.value === 'react') {
      transformOptions.presets!.push('react')
    }
    const transformed = babel.transform(input.value, transformOptions)
    result.value = highlight(transformed.code, {
      mode: 'jsx',
    })
    console.log(result.value)
    error.value = ''
  } catch (err: any) {
    console.error(err)
    error.value = err.message
  }
}

onMounted(() => {
  transform()
})

watch([input, mode], () => transform())
</script>

<style lang="scss">
html,
body,
#app,
.CodeMirror {
  height: 100%;
}
body {
  margin: 0;
  font: 14px/1.4 -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Helvetica Neue, sans-serif;
}
* {
  box-sizing: border-box;
}
.container {
  max-width: 1080px;
  margin: 0 auto;
  height: 100%;
}
.header {
  height: 80px;
  background-color: #4fc08d;
  color: white;
  > .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  h1 {
    margin: 0;
    font-weight: 400;
    a {
      text-decoration: none;
      color: white;
    }
  }
  h2 {
    margin: 0;
    font-weight: 400;
    font-size: 14px;
    a {
      color: white;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
  }
}
.editors {
  background-color: #f9f9f9;
  height: calc(100% - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.input {
  border: none;
  outline: none;
  resize: none;
  font-size: 1rem;
}
.result {
  position: relative;
  height: 100%;
  background-color: white;
  overflow: auto;
}
.code {
  margin: 0;
  height: 100%;
}
.error {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: red;
  color: white;
  padding: 0;
  overflow: auto;
  padding: 10px;
  font-size: 16px;
  white-space: pre;
}
.form-control {
  height: 26px;
}
.save-button {
  background: #eee;
  border: none;
  border-radius: 3px;
  margin-left: 5px;
}
</style>
