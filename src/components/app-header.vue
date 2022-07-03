<script setup lang="ts">
import { version as BABEL_VERSION } from '@babel/standalone/package.json'
import { version as VUE2_JSX_VERSION } from '@vue/babel-preset-jsx/package.json'
import { version as VUE3_JSX_VERSION } from '@vue/babel-plugin-jsx/package.json'
</script>

<template>
  <div text-center>
    <div i-carbon-automatic text-4xl inline-block />
    <p>
      <a href="https://vue-jsx.sxzz.moe">Vue JSX Playground</a>
    </p>
    <p>
      <em text-sm op75>
        @babel/standalone@{{ BABEL_VERSION }}, @vue/babel-preset-jsx@{{
          VUE2_JSX_VERSION
        }}, @vue/babel-plugin-jsx@{{ VUE3_JSX_VERSION }}
      </em>
    </p>
  </div>
</template>
