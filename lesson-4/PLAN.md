## High-Level Implementation Plan for lesson-4: Composables & Form Validation

### Architecture Overview

The project is a **Task Manager SPA** built on Vue 3 + TypeScript + Vite, demonstrating advanced Composition API patterns. Data flows from composables (reactive state + logic) down into components via props/events, with persistence via localStorage and routing via vue-router.

---

### Phase 1: Project Scaffolding

**Files to create:**
- `lesson-4/package.json` — based on lesson-1's structure, adding `vue-router`, `@vue/test-utils`, `jsdom`
- `lesson-4/vite.config.ts` — `@vitejs/plugin-vue`, sourcemap, server port 5173
- `lesson-4/tsconfig.json` — extends `@vue/tsconfig/tsconfig.dom.json`, target ES2020, strict mode
- `lesson-4/.eslintrc.cjs` — extends `@vue/eslint-config-typescript`, `@vue/eslint-config-prettier`
- `lesson-4/.prettierrc` — semi-colons, single quotes, 2-space indent
- `lesson-4/.husky/pre-commit` — `npx lint-staged`
- `lesson-4/lint-staged.config.js` — lint + format staged `.vue`/`.ts` files

**Key design decisions:**
- Use Vite 8 + Vue 3.5+ (matching lesson-1's known working deps)
- Use `vitest` v4 for testing (same as lesson-1)
- Use `vue-router` 5 (latest for Vue 3.5+, auto-imports `defineRouteComponent`)

---

### Phase 2: TypeScript Types

**`src/types/task.ts`:**
```typescript
export interface Task {
  id: number
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
}
```

**`src/types/validation.ts`:**
```typescript
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  allowedValues?: string[]
}

export interface ValidationRules {
  title: ValidationRule
  description: ValidationRule
  priority: ValidationRule
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}
```

---

### Phase 3: Composables (Core Logic Layer)

| Composable | Responsibility | Key Vue Features |
|---|---|---|
| `useTaskManager` | CRUD tasks, filter, async fetch | `ref`, `computed`, `watch`, `onMounted`, async/await |
| `useFormValidation` | Validate `TaskFormData`, field-level errors | `ref`, reactive error map, composable rules |
| `useKeyboardShortcuts` | Ctrl+N, Delete, F, Esc shortcuts | `onMounted`/`onUnmounted` event listeners, `emit`-based |
| `useLocalStorage` | Persist/restore reactive ref to localStorage | `watch`, `onMounted`, generics `<T>` |
| `useTaskStats` | Derived stats from task list | `computed` with multiple dependencies |
| `useEventListener` | Auto-cleanup event listener on mount/unmount | `onMounted`, `onUnmounted` (utility composable) |
| `useDebounce` | Debounce any function call | `setTimeout`/`clearTimeout` closure |
| `useDeepWatch` | Deep object comparison watch | `watch` with `deep: true`, `JSON.stringify` comparator |

**Data flow:**
```
useTaskManager (owns tasks[], filter, isLoading)
    │
    ├── useTaskStats (reads tasks via Ref → computed stats)
    ├── useLocalStorage (persists tasks on change, restores on mount)
    ├── TaskManager view (consumes all composables)
    │     ├── TaskForm (uses useFormValidation, emits create/update)
    │     ├── TaskList (reads filteredTasks, emits edit/delete/toggle)
    │     │     ├── TaskItem (inline edit, checkbox, delete)
    │     └── FilterBar (sets filter)
    └── useKeyboardShortcuts (emits new-task, delete-task)
```

**`useTaskManager`** — the central composable:
- Internal state: `tasks`, `filter` (`'all'|'active'|'completed'`), `isLoading`, `error`
- `filteredTasks` computed based on filter
- `fetchTasks()` simulates 1s API delay (seed data)
- `addTask(formData)` → assigns ID, timestamps, pushes to array
- `updateTask(id, formData)` → finds and replaces
- `deleteTask(id)` → filters out
- `toggleTask(id)` → flips `completed`
- Returns all refs + computed + functions

**`useFormValidation`**:
- `errors` ref: `Record<string, string>`
- `validate(data): boolean` — checks required, min/max length, pattern, allowed values
- `reset()` — clears errors and submitting flag
- Rules object is externalized (configurable)

**`useKeyboardShortcuts`**:
- `Ctrl+N` → emits `'new-task'`
- `Delete` → emits `'delete-task'`
- `F` → emits `'toggle-filter'`
- `Esc` → emits `'cancel-edit'`
- `onMounted` adds listener, `onUnmounted` removes it

---

### Phase 4: Utilities

**`src/utils/validators.ts`:**
- `validateField(field, value, rules)` — pure function, returns `boolean`
- `generateId()` — timestamp-based unique ID
- `formatDate(date)` — locale date string
- Re-exported validation rules object as constant

---

### Phase 5: Routing

**`src/router/index.ts`:**
```typescript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'tasks', component: () => import('@/views/TaskManager.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }, // catch-all
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

`main.ts` mounts `App` with `router` plugin.

---

### Phase 6: Components

**`TaskForm.vue`** — `<script setup>` with `defineProps`/`defineEmits` (`v-model`-compatible):
- Props: `modelValue` (TaskFormData), `errors` (Record), `submitting` (boolean)
- Emits: `update:modelValue`, `submit`, `cancel`
- Two-way binding on title, description (textarea), priority (select)
- Shows inline error messages per field
- Submit button disabled when `submitting`
- Cancel button emits cancel

**`TaskItem.vue`** — single task row:
- Props: `task` (Task), `isEditing` (boolean)
- Emits: `toggle`, `delete`, `edit`, `save`, `cancel`
- Default: shows title, priority badge, checkbox, edit/delete buttons
- Editing: renders inline TaskForm-like inputs with save/cancel
- Completed tasks: strikethrough style

**`TaskList.vue`** — scrollable list container:
- Props: `tasks` (Task[]), `editingId` (number|null)
- Emits: `toggle`, `delete`, `edit`, `save`, `cancel`
- `TransitionGroup` for enter/leave animations
- Empty state message when `tasks` is empty

**`FilterBar.vue`** — filter button group:
- Props: `modelValue` (string), `disabled` (boolean)
- Emits: `update:modelValue`
- Three buttons: All / Active / Completed with counts
- `v-model` compatible

---

### Phase 7: Views

**`TaskManager.vue`** — the central composing view:
```typescript
// Composes all composables
const { tasks, filter, isLoading, filteredTasks, fetchTasks, addTask, ... } = useTaskManager()
const { errors, validate, reset } = useFormValidation()
const { handleKeyDown } = useKeyboardShortcuts()

// Stats
const { total, completed, active, rate } = useTaskStats(tasks)

// Persistence
useLocalStorage('tasks', tasks)

// Handlers wired to child emits
const handleNewTask = () => { showForm, reset form }
const handleSubmit = () => { if(validate(data)) addTask(data); reset() }
const handleDelete = (id) => { deleteTask(id) }
const handleToggle = (id) => { toggleTask(id) }
```

- `onMounted(() => fetchTasks())`
- `<form @keydown="handleKeyDown">` for keyboard shortcuts
- Child components via props/event bindings
- Stats bar showing completion rate
- Loading spinner while `isLoading`

**`App.vue`** — minimal wrapper:
- `<RouterView />`
- Global keyboard listener delegation

**`main.ts`:**
```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './style.css'

createApp(App).use(router).mount('#app')
```

---

### Phase 8: Testing

**Vitest configuration (`vitest.config.ts`):**
```typescript
import { defineConfig } from 'vitest/config'
export default defineConfig({ test: { environment: 'jsdom' } })
```

**Test files (co-located with source or in `__tests__/`):**
- `src/composables/__tests__/useTaskManager.test.ts` — initial state, add/delete/toggle, filter logic, async fetch
- `src/composables/__tests__/useFormValidation.test.ts` — required field, max length, pattern, allowed values, reset
- `src/composables/__tests__/useTaskStats.test.ts` — counts, completion rate edge cases (empty list)
- `src/components/__tests__/TaskForm.test.ts` — v-model binding, validation error display, submit/cancel events
- `src/components/__tests__/TaskItem.test.ts` — toggle/delete/edit emit, completed styling
- `src/views/__tests__/TaskManager.test.ts` — integration: adding a task updates list and localStorage

---

### Phase 9: Config & CI

- **`index.html`** — standard Vite entry with `<div id="app">`, meta charset, viewport
- **`public/favicon.svg`** — copied from lesson-1
- **`style.css`** — base reset, task list styles (completed strikethrough, priority colors, edit transitions)
- **`.github/workflows/ci.yml`** — runs `npm run lint && npm run test:unit` on push/PR
- **`husky`** — pre-commit hook running `lint-staged`

---

### Execution Order Summary

| Step | Action | Output |
|------|--------|--------|
| 1 | Create `lesson-4/` dirs + `package.json` + Vite/TS/ESLint/Prettier configs | Bootstrapped project |
| 2 | Write `types/task.ts` + `types/validation.ts` | Type foundations |
| 3 | Build all 8 composables in `src/composables/` | Reusable logic layer |
| 4 | Build `utils/validators.ts` + `router/index.ts` | Utilities + routing |
| 5 | Build 4 components (`.vue` SFCs) | UI layer |
| 6 | Build `views/TaskManager.vue` + `App.vue` + `main.ts` + `index.html` | Entry points |
| 7 | Write CSS styles | Visual polish |
| 8 | Write Vitest config + unit tests | Test coverage |
| 9 | Write CI workflow + husky hook | Quality gates |
| 10 | `npm install && npm run dev` smoke test + `npm run test:unit` + `npm run lint` | Verify everything works |

This plan follows lesson-3's established patterns (router setup, ESLint, Prettier, Vitest with jsdom) and extends them with the composables architecture that lesson-4's learning objectives require. Ready to proceed with implementation on your go.










































Now I have a complete picture. Let me produce the high-level implementation plan.

---

## High-Level Implementation Plan for lesson-4: Composables & Form Validation

### Architecture Overview

The project is a **Task Manager SPA** built on Vue 3 + TypeScript + Vite, demonstrating advanced Composition API patterns. Data flows from composables (reactive state + logic) down into components via props/events, with persistence via localStorage and routing via vue-router.

---

### Phase 1: Project Scaffolding

**Files to create:**
- `lesson-4/package.json` — based on lesson-1's structure, adding `vue-router`, `@vue/test-utils`, `jsdom`
- `lesson-4/vite.config.ts` — `@vitejs/plugin-vue`, sourcemap, server port 5173
- `lesson-4/tsconfig.json` — extends `@vue/tsconfig/tsconfig.dom.json`, target ES2020, strict mode
- `lesson-4/.eslintrc.cjs` — extends `@vue/eslint-config-typescript`, `@vue/eslint-config-prettier`
- `lesson-4/.prettierrc` — semi-colons, single quotes, 2-space indent
- `lesson-4/.husky/pre-commit` — `npx lint-staged`
- `lesson-4/lint-staged.config.js` — lint + format staged `.vue`/`.ts` files

**Key design decisions:**
- Use Vite 8 + Vue 3.5+ (matching lesson-1's known working deps)
- Use `vitest` v4 for testing (same as lesson-1)
- Use `vue-router` 5 (latest for Vue 3.5+, auto-imports `defineRouteComponent`)

---

### Phase 2: TypeScript Types

**`src/types/task.ts`:**
```typescript
export interface Task {
  id: number
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
}
```

**`src/types/validation.ts`:**
```typescript
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  allowedValues?: string[]
}

export interface ValidationRules {
  title: ValidationRule
  description: ValidationRule
  priority: ValidationRule
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}
```

---

### Phase 3: Composables (Core Logic Layer)

| Composable | Responsibility | Key Vue Features |
|---|---|---|
| `useTaskManager` | CRUD tasks, filter, async fetch | `ref`, `computed`, `watch`, `onMounted`, async/await |
| `useFormValidation` | Validate `TaskFormData`, field-level errors | `ref`, reactive error map, composable rules |
| `useKeyboardShortcuts` | Ctrl+N, Delete, F, Esc shortcuts | `onMounted`/`onUnmounted` event listeners, `emit`-based |
| `useLocalStorage` | Persist/restore reactive ref to localStorage | `watch`, `onMounted`, generics `<T>` |
| `useTaskStats` | Derived stats from task list | `computed` with multiple dependencies |
| `useEventListener` | Auto-cleanup event listener on mount/unmount | `onMounted`, `onUnmounted` (utility composable) |
| `useDebounce` | Debounce any function call | `setTimeout`/`clearTimeout` closure |
| `useDeepWatch` | Deep object comparison watch | `watch` with `deep: true`, `JSON.stringify` comparator |

**Data flow:**
```
useTaskManager (owns tasks[], filter, isLoading)
    │
    ├── useTaskStats (reads tasks via Ref → computed stats)
    ├── useLocalStorage (persists tasks on change, restores on mount)
    ├── TaskManager view (consumes all composables)
    │     ├── TaskForm (uses useFormValidation, emits create/update)
    │     ├── TaskList (reads filteredTasks, emits edit/delete/toggle)
    │     │     ├── TaskItem (inline edit, checkbox, delete)
    │     └── FilterBar (sets filter)
    └── useKeyboardShortcuts (emits new-task, delete-task)
```

**`useTaskManager`** — the central composable:
- Internal state: `tasks`, `filter` (`'all'|'active'|'completed'`), `isLoading`, `error`
- `filteredTasks` computed based on filter
- `fetchTasks()` simulates 1s API delay (seed data)
- `addTask(formData)` → assigns ID, timestamps, pushes to array
- `updateTask(id, formData)` → finds and replaces
- `deleteTask(id)` → filters out
- `toggleTask(id)` → flips `completed`
- Returns all refs + computed + functions

**`useFormValidation`**:
- `errors` ref: `Record<string, string>`
- `validate(data): boolean` — checks required, min/max length, pattern, allowed values
- `reset()` — clears errors and submitting flag
- Rules object is externalized (configurable)

**`useKeyboardShortcuts`**:
- `Ctrl+N` → emits `'new-task'`
- `Delete` → emits `'delete-task'`
- `F` → emits `'toggle-filter'`
- `Esc` → emits `'cancel-edit'`
- `onMounted` adds listener, `onUnmounted` removes it

---

### Phase 4: Utilities

**`src/utils/validators.ts`:**
- `validateField(field, value, rules)` — pure function, returns `boolean`
- `generateId()` — timestamp-based unique ID
- `formatDate(date)` — locale date string
- Re-exported validation rules object as constant

---

### Phase 5: Routing

**`src/router/index.ts`:**
```typescript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'tasks', component: () => import('@/views/TaskManager.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }, // catch-all
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

`main.ts` mounts `App` with `router` plugin.

---

### Phase 6: Components

**`TaskForm.vue`** — `<script setup>` with `defineProps`/`defineEmits` (`v-model`-compatible):
- Props: `modelValue` (TaskFormData), `errors` (Record), `submitting` (boolean)
- Emits: `update:modelValue`, `submit`, `cancel`
- Two-way binding on title, description (textarea), priority (select)
- Shows inline error messages per field
- Submit button disabled when `submitting`
- Cancel button emits cancel

**`TaskItem.vue`** — single task row:
- Props: `task` (Task), `isEditing` (boolean)
- Emits: `toggle`, `delete`, `edit`, `save`, `cancel`
- Default: shows title, priority badge, checkbox, edit/delete buttons
- Editing: renders inline TaskForm-like inputs with save/cancel
- Completed tasks: strikethrough style

**`TaskList.vue`** — scrollable list container:
- Props: `tasks` (Task[]), `editingId` (number|null)
- Emits: `toggle`, `delete`, `edit`, `save`, `cancel`
- `TransitionGroup` for enter/leave animations
- Empty state message when `tasks` is empty

**`FilterBar.vue`** — filter button group:
- Props: `modelValue` (string), `disabled` (boolean)
- Emits: `update:modelValue`
- Three buttons: All / Active / Completed with counts
- `v-model` compatible

---

### Phase 7: Views

**`TaskManager.vue`** — the central composing view:
```typescript
// Composes all composables
const { tasks, filter, isLoading, filteredTasks, fetchTasks, addTask, ... } = useTaskManager()
const { errors, validate, reset } = useFormValidation()
const { handleKeyDown } = useKeyboardShortcuts()

// Stats
const { total, completed, active, rate } = useTaskStats(tasks)

// Persistence
useLocalStorage('tasks', tasks)

// Handlers wired to child emits
const handleNewTask = () => { showForm, reset form }
const handleSubmit = () => { if(validate(data)) addTask(data); reset() }
const handleDelete = (id) => { deleteTask(id) }
const handleToggle = (id) => { toggleTask(id) }
```

- `onMounted(() => fetchTasks())`
- `<form @keydown="handleKeyDown">` for keyboard shortcuts
- Child components via props/event bindings
- Stats bar showing completion rate
- Loading spinner while `isLoading`

**`App.vue`** — minimal wrapper:
- `<RouterView />`
- Global keyboard listener delegation

**`main.ts`:**
```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './style.css'

createApp(App).use(router).mount('#app')
```

---

### Phase 8: Testing

**Vitest configuration (`vitest.config.ts`):**
```typescript
import { defineConfig } from 'vitest/config'
export default defineConfig({ test: { environment: 'jsdom' } })
```

**Test files (co-located with source or in `__tests__/`):**
- `src/composables/__tests__/useTaskManager.test.ts` — initial state, add/delete/toggle, filter logic, async fetch
- `src/composables/__tests__/useFormValidation.test.ts` — required field, max length, pattern, allowed values, reset
- `src/composables/__tests__/useTaskStats.test.ts` — counts, completion rate edge cases (empty list)
- `src/components/__tests__/TaskForm.test.ts` — v-model binding, validation error display, submit/cancel events
- `src/components/__tests__/TaskItem.test.ts` — toggle/delete/edit emit, completed styling
- `src/views/__tests__/TaskManager.test.ts` — integration: adding a task updates list and localStorage

---

### Phase 9: Config & CI

- **`index.html`** — standard Vite entry with `<div id="app">`, meta charset, viewport
- **`public/favicon.svg`** — copied from lesson-1
- **`style.css`** — base reset, task list styles (completed strikethrough, priority colors, edit transitions)
- **`.github/workflows/ci.yml`** — runs `npm run lint && npm run test:unit` on push/PR
- **`husky`** — pre-commit hook running `lint-staged`

---

### Execution Order Summary

| Step | Action | Output |
|------|--------|--------|
| 1 | Create `lesson-4/` dirs + `package.json` + Vite/TS/ESLint/Prettier configs | Bootstrapped project |
| 2 | Write `types/task.ts` + `types/validation.ts` | Type foundations |
| 3 | Build all 8 composables in `src/composables/` | Reusable logic layer |
| 4 | Build `utils/validators.ts` + `router/index.ts` | Utilities + routing |
| 5 | Build 4 components (`.vue` SFCs) | UI layer |
| 6 | Build `views/TaskManager.vue` + `App.vue` + `main.ts` + `index.html` | Entry points |
| 7 | Write CSS styles | Visual polish |
| 8 | Write Vitest config + unit tests | Test coverage |
| 9 | Write CI workflow + husky hook | Quality gates |
| 10 | `npm install && npm run dev` smoke test + `npm run test:unit` + `npm run lint` | Verify everything works |

This plan follows lesson-3's established patterns (router setup, ESLint, Prettier, Vitest with jsdom) and extends them with the composables architecture that lesson-4's learning objectives require. Ready to proceed with implementation on your go.

## Notes about implementation
### Phase 3 - useTaskManage composable.
includes:
 - State: tasks, filter, isLoading, error (all strongly typed)
 - Computed: filteredTasks (with placeholder for filtering logic)
 - Methods: fetchTasks, addTask, updateTask, deleteTask, toggleTask stubs
 - Lifecycle: onMounted hook to call fetchTasks
 - Return: clean object with state and methods

### Phase 3 Persistence: useLocalStorage

In a standard web browser (the typical Vue use case), direct file system access is restricted for security reasons.

- **Best Practice**: Use the browser's built-in `localStorage` API. It's the simplest, most idiomatic, and most performant way to achieve "local persistence" in a web application.
- **When to use SQLite/Files**: Only use a database like SQLite or file system access if building a desktop application with Electron, or if building a backend API.
**Recommendation**: For a `useLocalStorage` composable in a standard Vue frontend, use `localStorage`.