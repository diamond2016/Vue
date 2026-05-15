<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/UI/navbar.vue'

// Reactive expression state
const expr = ref('1+2')
const router = useRouter()

// Auto-navigate when expr changes
watch(expr, (newExpr) => {
  router.push(`/eval/${newExpr}`)
})
</script>

<template>
  <header>
    <NavBar v-model:expr="expr" />
  </header>

  <!-- view container -->
  <RouterView />
</template>
