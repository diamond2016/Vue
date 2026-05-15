<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  expr: string
}>()

const emit = defineEmits<{
  (e: 'update:expr', value: string): void
}>()

// Computed for v-model binding
const exprModel = computed({
  get: () => props.expr,
  set: (val) => emit('update:expr', val),
})
</script>

<template>
  <nav class="menu">
    <div class="menuitem">
      <input v-model="exprModel" type="text" placeholder="Enter expression" class="expr-input" />
      <router-link :to="`/eval/${exprModel}`"> Calculator </router-link>
    </div>
  </nav>
</template>

<style scoped>
.expr-input {
  padding: 8px 12px;
  border: 1px solid #444;
  border-radius: 4px;
  background: #2a2a2a;
  color: #fff;
  font-size: 14px;
  width: 200px;
  margin-right: 10px;
}

.menu {
  background-color: #1a1a1a;
  padding: 1rem;
}

.menu .menuitem {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.menu .menuitem a {
  color: #646cff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.menu .menuitem a:hover {
  background-color: #2a2a2a;
  color: #535bf2;
}

@media (prefers-color-scheme: light) {
  .menu {
    background-color: #f9f9f9;
  }

  .menu .menuitem a {
    color: #213547;
  }

  .menu .menuitem a:hover {
    background-color: #e0e0e0;
    color: #1a1a1a;
  }
}
</style>
