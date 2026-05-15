# Vue.js Learning Project

Learning project for **Vue 3 + TypeScript + Vite** with integrated testing (Vitest + Vue Testing Library).

## Lessons

### 1. [lesson-1](./lesson-1/) - Vue Basics
Simple counter app to learn fundamental concepts:
- **Reactive state** with `ref()`
- **Event handling** with `@click`
- Component rendering and DOM updates
- Unit testing with Vitest

### 2. [lesson-2](./lesson-2/) - Working with Props
Counter component that receives data from parent:
- **Props**: `initialCount` (required), `label` (optional)
- One-way data flow parent → child
- Reset functionality based on props

### 3. [lesson-3](./lesson-3/) - Expression Evaluator
Complete Vue 3 app with routing and expression evaluation:
- **Reactive state** with `ref()` and `watch()`
- **Two-way binding** with `v-model` and custom events
- **Routing** with vue-router 5 (auto-navigation)
- **Expression parsing** with Chevrotain lexer
- **Expression evaluation** with Function constructor
- **Professional tooling**: ESLint, Prettier, Vitest

### 4. [lesson-4](./lesson-4/) - Composables & Form Validation
Advanced Composition API patterns with a Task Manager app:
- **Composables** for reusable logic
- **Computed properties** with caching and dependencies
- **Lifecycle hooks** (onMounted, onUnmounted, watchEffect)
- **Async operations** with loading/error states
- **Form validation** with custom rules
- **Keyboard navigation** with event listeners

## Available Commands

For each lesson, run commands in its directory:

```bash
npm run dev        # Start dev server
npm run test:unit  # Run tests (lesson-3, lesson-4)
npm run lint       # Run linter
npm run format     # Run Prettier
npm run build      # Build for production
```

## Structure

```
Lessons_and_exercises/
├── lesson-1/     # Vue basics + testing
├── lesson-2/     # Props
├── lesson-3/     # Full setup with lint/format
├── lesson-4/     # Composables + form validation
└── README.md     # This file
```

---
**Stack:** Vue 3.5+, TypeScript 6, Vite 8, Vitest, ESLint, Prettier, Husky

