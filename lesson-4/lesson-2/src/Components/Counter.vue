<template>
  <div class="counter">
    <h2>{{ label }}</h2>
    <p>Conto: {{ count }}</p>
    <button @click="increment">Incrementa</button>
    <button @click="decrement">Decrementa</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  initialCount: number;
  label: string;
}>();

const count = defineModel<number>({
  required: true,
  default: 0,
});

const increment = () => count.value++;

const decrement = () => count.value--;
</script>

<style scoped>
.counter {
  padding: 1rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
}
</style>
