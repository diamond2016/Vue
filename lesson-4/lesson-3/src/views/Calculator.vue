<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { tokenize, evaluate, type Token } from '@/utils/tokenizer'

// 1. Default Props & Loading State
const props = withDefaults(defineProps<{ expr: string }>(), {
  expr: ''
})
const isLoading = ref(false)

// 2. State
const tokens = ref<Token[]>([])
const exprValue = ref<number | string>('') // Allow string for errors

// 3. Logic Helpers
const isResultSuccess = computed(() => {
  const val = exprValue.value
  return typeof val === 'number' && Number.isFinite(val)
})

// 4. Handlers
const handleTokenize = () => {
  tokens.value = tokenize(props.expr)
}

const handleEvaluation = async () => {
  isLoading.value = true
  try {
    const result = evaluate(props.expr)
    // 5. Robust Check (Fixes NaN and 0 issues)
    exprValue.value = Number.isFinite(result) ? result : String(result)
  } catch (error) {
    exprValue.value = String(error)
  } finally {
    isLoading.value = false
  }
}

// 6. Cleanup (Removed redundant reset)
onMounted(() => {
  // Optional: Auto-tokenize on load if desired
  // tokens.value = tokenize(props.expr) 
})
</script>

<template>
  <div class="calculator">
    <h3>Expression Evaluator</h3>
    <p>
      Expression: <strong>{{ expr }}</strong>
    </p>
    <div class="buttons">
      <button @click="handleTokenize">Tokenize</button>
      <button @click="handleEvaluation" :disabled="isLoading">
        {{ isLoading ? 'Calculating...' : 'Evaluate' }}
      </button>
    </div>
    
    <!-- 7. Simplified Result Display -->
    <section class="result-output">
      <h4>Expression Evaluation:</h4>
      <pre class="result-value">
        <span :class="{ success: isResultSuccess, error: !isResultSuccess }">
          {{ exprValue }}
        </span>
      </pre>
    </section>

    <section class="token-output">
      <h4>Tokenization:</h4>
      <div v-if="tokens.length > 0">
        <div v-for="(item, index) in tokens" :key="index" class="token">
          <span class="token-type">{{ item.type }}</span>
          <span class="token-separator">: </span>
          <span class="token-value">{{ item.value }}</span>
          <span class="token-separator"> [</span>
          <span class="token-meta">{{ item.start }}</span>
          <span class="token-separator">-</span>
          <span class="token-meta">{{ item.end }}</span>
          <span class="token-separator">]</span>
        </div>
      </div>
      <div v-else>
        <span class="no-tokens">No tokens yet</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ... existing styles ... */
/* 8. Add CSS Variables for easier theming */
:root {
  --success-color: #6a9955;
  --error-color: #ce9178;
  --meta-color: #9cdcfe;
}
.success { color: var(--success-color); }
.error { color: var(--error-color); }
</style>
