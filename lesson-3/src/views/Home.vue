<template>
  <main class="app">
    <h3>A simple calculator</h3>
    <p>Insert a simple math expression and test</p>

    <p>Expression: {{ expr }}</p>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const expr = ref('1+2')
</script>

<style scoped>
.app {
  padding: 20px;
}
</style>
