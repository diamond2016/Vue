<script setup lang="ts">
import { ref } from 'vue';
import vueLogo from '../assets/vue.svg';

const count = ref(0);

function increment() {
  count.value++; // .value serve per modificare il valore dentro il "ref"
}
function decrement() {
  count.value--; // .value serve per modificare il valore dentro il "ref"
}
function reset() {
  count.value = 0; // .value serve per modificare il valore dentro il "ref"
}

</script>


<template>
  <section id="center">
    <div class="hero">
      <img :src="vueLogo" class="framework" alt="Vue logo" />
    </div>
    <div>
      <h3>A simple counter app</h3>
      <p>Use commands to increment or decrement</p>
    </div>
  </section>
  
  <section id="counter_app">
    <div class="base">  
    <p class="counter">Count is {{ count }}</p>
    <p><button type="button" id="buttonUp" class="button-icon" @click="increment()">++</button>
    &nbsp;
    <button type="button" id="buttonDown" class="button-icon" @click="decrement()">--</button></p>
    </div>
    <p v-if="count < 0"><button type="button" id="Reset" class="button-icon" @click="reset()">Reset</button></p>
  </section>

  <div class="ticks"></div>


  <div class="ticks"></div>
  <section id="spacer"></section>
</template>
