<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { CodeMirror } from './codemirror'

export interface Props {
  modelValue: string
  mode?: string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'htmlmixed',
  readonly: false,
})

const emit = defineEmits<(e: 'update:modelValue', value: string) => void>()

const el = ref()

onMounted(() => {
  const addonOptions = {
    autoCloseBrackets: true,
    autoCloseTags: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  }

  const editor = CodeMirror(el.value!, {
    value: '',
    mode: props.mode,
    readOnly: props.readonly,
    tabSize: 2,
    lineWrapping: true,
    lineNumbers: true,
    ...addonOptions,
  })

  editor.on('change', () => {
    emit('update:modelValue', editor.getValue())
  })

  watchEffect(() => {
    const cur = editor.getValue()
    if (props.modelValue !== cur) {
      editor.setValue(props.modelValue)
    }
  })

  watchEffect(() => {
    editor.setOption('mode', props.mode)
  })

  watchEffect(() => {
    editor.setOption('theme', isDark.value ? 'monokai' : 'default')
  })
})
</script>

<template>
  <div ref="el" class="editor" />
</template>
