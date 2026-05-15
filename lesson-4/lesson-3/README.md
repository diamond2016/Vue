# Expression Evaluator - Lesson 3

A complete Vue 3 + TypeScript project demonstrating:
- **Reactive state** with `ref()` and `watch()`
- **Two-way binding** with `v-model` and custom events
- **Routing** with vue-router 5
- **Expression parsing** with Chevrotain lexer
- **Expression evaluation** with Function constructor

## Project Structure

```
lesson-3/
├── src/
│   ├── App.vue                      # Main app with reactive expr state
│   ├── components/
│   │   └── UI/
│   │       └── navbar.vue           # Navigation with input form
│   ├── router/
│   │   └── index.ts                 # Vue Router configuration
│   ├── utils/
│   │   └── tokenizer.ts             # Lexer and evaluate functions
│   └── views/
│       └── Calculator.vue           # Expression evaluator view
├── index.html
├── vite.config.ts
└── README.md
```

## How It Works

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      App.vue (Parent)                       │
│  - expr = ref('1+2')                                        │
│  - watch(expr, ...) → auto-navigate                         │
│  - v-model:expr="expr" to NavBar                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    NavBar.vue (Child)                       │
│  - exprModel = computed({ get, set emit })                  │
│  - <input v-model="exprModel">                              │
│  - Router link: /eval/${exprModel}                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Calculator.vue (View)                      │
│  - props = { expr: string }                                 │
│  - tokens = ref<Token[]>([])                                │
│  - exprValue = ref<number>(0)                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Concepts

#### 1. Reactive State in App.vue
```ts
const expr = ref('1+2')
const router = useRouter()

// Watch and auto-navigate
watch(expr, (newExpr) => {
  router.push(`/eval/${newExpr}`)
}, { immediate: false }) // No immediate = only on change
```

#### 2. Two-Way Binding with v-model
```ts
// In NavBar.vue
const emit = defineEmits<{
  (e: 'update:expr', value: string): void
}>()

const exprModel = computed({
  get: () => props.expr,
  set: (val) => emit('update:expr', val)
})
```

#### 3. Expression Tokenization (tokenizer.ts)
```ts
export const tokenize = (expr: string): Token[] => {
  const lexerResult = LexerInstance.tokenize(expr)
  return lexerResult.tokens
    .filter(token => token.tokenType !== WhitespaceToken)
    .map(token => ({
      type: token.tokenType.name,
      value: token.image,
      start: token.startOffset,
      end: token.endOffset,
    }))
}
```

#### 4. Expression Evaluation (tokenizer.ts)
```ts
export const evaluate = (expr: string): number | string => {
  try {
    // Safer than eval() - only allows expressions
    const result = new Function(`return ${expr}`)()
    
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return Number(result.toFixed(6))
    }
    
    return 'Invalid expression'
  } catch (error) {
    return 'Syntax error'
  }
}
```

### File-by-File Changes

#### App.vue
- **Before:** `const expr: string = "1+2";` (constant)
- **After:** `const expr = ref('1+2');` (reactive)
- Added: `watch(expr, ...)` for auto-navigation
- Changed: `<NavBar :expr="expr" />` → `<NavBar v-model:expr="expr" />`

#### NavBar.vue
- **Before:** Static router-link with props.expr
- **After:** Dynamic input with v-model binding
- Added: `computed` getter/setter for two-way binding
- Added: Input field with `v-model="exprModel"`

#### Calculator.vue
- **Before:** `tokens` array (not reactive)
- **After:** `tokens = ref<Token[]>([])`
- Added: `handleTokenize()` and `handleEvaluation()` handlers
- Added: Styled result display with success/error states

#### tokenizer.ts
- **Added:** `evaluate()` function using `new Function()`
- **Features:** Error handling, floating-point precision fix

## Setup

```bash
cd lesson-3
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:5173/ in your browser.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test:unit` | Run unit tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Features

### Tokenization
- Breaks expression into tokens (NUMBER, OPERATOR, LPAREN, RPAREN, WHITESPACE)
- Shows position (start/end offsets) for each token

### Evaluation
- Safely evaluates mathematical expressions
- Handles: addition, subtraction, multiplication, division
- Returns formatted result with 6 decimal precision
- Shows "Syntax error" for invalid expressions

### Auto-Navigation
- Type in navbar input → page updates automatically
- No manual button clicks needed for navigation

### Two-Way Binding
- Input in NavBar syncs with route params
- Route params sync with NavBar input
- Parent (App) state controls child (NavBar) and view (Calculator)

## Navigation Flow

```
/ (Home)
├── Shows empty content area
└── NavBar with input field

/eval/:expr (Calculator)
├── Shows expression from route param
├── Tokenize button → shows tokenized tokens
└── Evaluate button → shows calculated result
```

## Example Usage

1. **Start the app:** `npm run dev`
2. **Open browser:** http://localhost:5173/
3. **Type expression:** "2+3"
4. **Auto-navigate:** Page goes to `/eval/2+3`
5. **Click Evaluate:** Result "5" appears in green
6. **Click Tokenize:** Token list shows NUMBER, OPERATOR, NUMBER
7. **Try invalid:** "abc" → "Syntax error" in red

## Technical Details

### v-model Implementation
```html
<!-- In App.vue -->
<NavBar v-model:expr="expr" />

<!-- In NavBar.vue -->
<script setup lang="ts">
const props = defineProps<{ expr: string }>()
const emit = defineEmits<{ (e: 'update:expr', value: string): void }>()

const exprModel = computed({
  get: () => props.expr,
  set: (val) => emit('update:expr', val)
})
</script>

<template>
  <input v-model="exprModel" />
</template>
```

### Router Configuration
```ts
// src/router/index.ts
{
  path: '/eval/:expr',
  name: 'eval-expr',
  component: () => import('@/views/Calculator.vue'),
  props: true  // Automatically pass route params as props
}
```

### Safe Evaluation
```ts
// ✅ Safe: Only evaluates expressions
new Function(`return ${expr}`)()

// ❌ Unsafe: Can execute any code
eval(expr)
```

## Best Practices Implemented

1. **Reactivity:** Use `ref()` for all dynamic state
2. **Two-way binding:** Custom events + computed
3. **Error handling:** Try-catch for evaluation
4. **Type safety:** TypeScript interfaces for tokens
5. **Code style:** ESLint + Prettier configured
6. **Testing:** Vitest setup included

---

**Stack:** Vue 3.5+, TypeScript 6+, Vite 8+, Vue Router 5, Chevrotain
