<script setup lang="ts">
import { Editor } from '@kosmotema/bytemd-vue-next'
import gfm from '@kosmotema/bytemd-plugin-gfm'

const content = ref('')
const plugins = [gfm()]
const handleChange = (v: string) => {
  content.value = v
}
</script>

<template>
  <ClientOnly>
    <Editor :value="content" :plugins="plugins" @change="handleChange" />
  </ClientOnly>
</template>
