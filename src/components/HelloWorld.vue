<script setup lang="ts">
interface Props {
  msg: string
}

withDefaults(defineProps<Props>(), {
  msg: 'Hello World!',
})
</script>

<template>
  <h1>{{ msg }}</h1>
</template>

<style scoped>
</style>
