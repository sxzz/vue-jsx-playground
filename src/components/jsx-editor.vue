<script lang="ts" setup>
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
const mode = useLocalStorage<
  'vue2-babel' | 'vue2-swc' | 'vue3-babel' | 'react-babel' | 'react-swc'
>('mode', 'vue3-babel', {
  listenToStorageChanges: false,
})
const typescript = useLocalStorage('typescript', false)

if (location.hash) {
  input.value = atou(location.hash.slice(1))
}
if (!input.value) {
  input.value = defaultValue
}

const transformBabel = async () => {
  const { transform } = await import('@babel/standalone')

  const transformOptions: TransformOptions = {
    presets: [],
    plugins: [],
  }
  if (mode.value === 'vue2-babel') {
    // @ts-expect-error
    const vue2JSXPreset = await import('@vue/babel-preset-jsx').then(
      (m) => m.default
    )
    transformOptions.presets!.push(vue2JSXPreset)
  } else if (mode.value === 'vue3-babel') {
    const { default: vue3JSXPlugin } = await import('@vue/babel-plugin-jsx')
    transformOptions.plugins!.push(vue3JSXPlugin)
  } else if (mode.value === 'react-babel') {
    transformOptions.presets!.push(['react', { useBuiltIns: true }])
  }
  if (typescript.value) {
    // @ts-expect-error
    const ts = await import('@babel/plugin-transform-typescript').then(
      (m) => m.default
    )
    transformOptions.plugins!.push([ts, { isTSX: true }])
  }

  return transform(input.value, transformOptions).code!
}

const transformSwc = async () => {
  const { default: initSwc, transformSync } = await import('@swc/wasm-web')
  await initSwc()

  const code = transformSync(input.value, {
    jsc: {
      parser: {
        syntax: typescript.value ? 'typescript' : 'ecmascript',
        jsx: true,
        tsx: true,
      },
      target: 'es2022',
      transform: {
        react: {
          useBuiltins: true,
        },
      },
    },
  })
  return code.code as string
}

const transform = async () => {
  try {
    if (mode.value.endsWith('babel')) {
      result.value = await transformBabel()
    } else {
      result.value = await transformSwc()
    }
    error.value = ''
  } catch (err: any) {
    result.value = 'Error'
    console.error(err)
    error.value = err.toString()
  }
}

watchEffect(() => {
  transform()
  location.hash = utoa(input.value)
})
</script>

<template>
  <div ma flex="~ col gap-2" max-w-800px>
    <div flex="~ gap-2" justify-end>
      <select v-model="mode" w-140px border-1px border-rounded self-end>
        <option value="vue2-babel">Vue 2 (Babel)</option>
        <!-- <option value="vue2-swc">Vue 2 (SWC)</option> -->
        <option value="vue3-babel">Vue 3</option>
        <option value="react-babel">React (Babel)</option>
        <option value="react-swc">React (SWC)</option>
      </select>

      <label><input v-model="typescript" type="checkbox" /> TypeScript</label>
    </div>

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
