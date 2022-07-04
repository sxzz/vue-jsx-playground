<script lang="ts" setup>
import { transform as babelTransform } from '@babel/standalone'
// @ts-expect-error
import vue2JSXPreset from '@vue/babel-preset-jsx'
import vue3JSXPlugin from '@vue/babel-plugin-jsx'
import { atou, utoa } from '../utils/encode'
import type { TransformOptions } from '@babel/core'

const defaultValue = `
<div id="welcome">
  <h1>Hello World!</h1>
</div>
`.trim()

const input = ref(defaultValue)
const result = ref('Loading...')
const error = ref('')
const mode = useLocalStorage('mode', ref<'vue2' | 'vue3' | 'react'>('vue3'), {
  listenToStorageChanges: false,
})

if (location.hash) {
  input.value = atou(location.hash.slice(1))
}
if (!input.value) {
  input.value = defaultValue
}

const transform = async () => {
  try {
    const transformOptions: TransformOptions = {
      presets: [],
      plugins: [],
    }
    if (mode.value === 'vue2') {
      transformOptions.presets!.push(vue2JSXPreset)
    } else if (mode.value === 'vue3') {
      transformOptions.plugins!.push(vue3JSXPlugin)
    } else if (mode.value === 'react') {
      transformOptions.presets!.push('react')
    }
    const transformed = babelTransform(input.value, transformOptions)
    result.value = transformed.code!
    error.value = ''
  } catch (err: any) {
    console.error(err)
    error.value = err.message
  }
}

watch(
  [input, mode],
  () => {
    transform()
    location.hash = utoa(input.value)
  },
  { immediate: true }
)
</script>

<template>
  <div ma flex="~ col gap-2" max-w-800px>
    <select v-model="mode" w-72px border-1px border-rounded self-end>
      <option value="vue2">Vue 2</option>
      <option value="vue3">Vue 3</option>
      <option value="react">React</option>
    </select>

    <div font-mono flex="~ col gap-2">
      <code-mirror v-model="input" mode="jsx" border="1px rounded #ccc" />

      <p text-center>Output</p>

      <div>
        <code-mirror
          v-model="result"
          readonly
          mode="javascript"
          border="1px rounded #ccc"
        />
        <div
          v-if="error"
          overflow-auto
          whitespace-pre
          text="sm white"
          bg="red"
          w-full
          pl-5
          max-h-200px
        >
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
