<template>
  <div class="counter">
    <h2>{{ label }} {{ count }}</h2>
    <div class="buttons">
      <button id="buttonUp" @click="increment">Incrementa</button>
      <button id="buttonDown" @click="decrement">Decrementa</button>
      <button v-if="count < 0" id="Reset" @click="reset">Reset</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 1. Default Props & Loading State
const props = withDefaults(defineProps<{ modelValue: number; label: string; }>(), {
  modelValue: 0,
  label: '',
});

const count = defineModel<number>({
  required: true,
  default: 0,
});

const increment = () => count.value++;

const decrement = () => count.value--;

const reset = () => (count.value = props.modelValue);
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
