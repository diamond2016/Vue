# Lesson 4: Composables & Form Validation

**Vue 3 + TypeScript + Vite** - Advanced Composition API Patterns

A comprehensive project demonstrating Vue's Composition API advanced features:
- **Composables** for reusable logic
- **Computed properties** with caching and dependencies
- **Lifecycle hooks** (onMounted, onUnmounted, watchEffect)
- **Async operations** with loading/error states
- **Form validation** with custom rules
- **Keyboard navigation** with event listeners

## Project Overview

A **Task Manager** application that combines all previous lessons with advanced Composition API patterns. Users can create, edit, and delete tasks with form validation, async operations, and keyboard shortcuts.

## Learning Objectives

| Concept | Lesson 1 | Lesson 2 | Lesson 3 | Lesson 4 |
|---------|----------|----------|----------|----------|
| `ref()` | ✅ | ✅ | ✅ | ✅ |
| `defineProps` | ❌ | ✅ | ✅ | ✅ |
| `defineModel` | ❌ | ❌ | ❌ | ✅ |
| `computed` | ❌ | ❌ | ❌ | ✅ |
| `watch` | ❌ | ❌ | ✅ | ✅ |
| `watchEffect` | ❌ | ❌ | ❌ | ✅ |
| `onMounted` | ❌ | ❌ | ✅ | ✅ |
| `onUnmounted` | ❌ | ❌ | ❌ | ✅ |
| Composables | ❌ | ❌ | ❌ | ✅ |
| Async/Await | ❌ | ❌ | ❌ | ✅ |
| Form Validation | ❌ | ❌ | ❌ | ✅ |
| Keyboard Events | ❌ | ❌ | ❌ | ✅ |

## Features

### 1. Composable Functions

```typescript
// src/composables/useTaskManager.ts
export function useTaskManager() {
  const tasks = ref<Task[]>([])
  const filter = ref('all')
  const isLoading = ref(false)
  
  // Computed derived state
  const filteredTasks = computed(() => {
    switch (filter.value) {
      case 'active': return tasks.value.filter(t => !t.completed)
      case 'completed': return tasks.value.filter(t => t.completed)
      default: return tasks.value
    }
  })
  
  // Watch with immediate option
  watch(filter, (newFilter) => {
    console.log(`Filter changed to: ${newFilter}`)
  }, { immediate: true })
  
  // Async function with loading state
  const fetchTasks = async () => {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      tasks.value = [
        { id: 1, title: 'Learn Vue', completed: false },
        { id: 2, title: 'Build Project', completed: true }
      ]
    } catch (error) {
      tasks.value = []
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    tasks,
    filter,
    isLoading,
    filteredTasks,
    fetchTasks
  }
}
```

### 2. Form Validation with Custom Rules

```typescript
// src/composables/useFormValidation.ts
export function useFormValidation() {
  const errors = ref<Record<string, string>>({})
  const isSubmitting = ref(false)
  
  const validate = (data: TaskFormData): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Required field
    if (!data.title?.trim()) {
      newErrors.title = 'Title is required'
    }
    
    // Max length
    if (data.title?.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }
    
    // Priority validation
    if (!data.priority) {
      newErrors.priority = 'Please select a priority'
    }
    
    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }
  
  const reset = () => {
    errors.value = {}
    isSubmitting.value = false
  }
  
  return { errors, isSubmitting, validate, reset }
}
```

### 3. Keyboard Shortcuts

```typescript
// src/composables/useKeyboardShortcuts.ts
export function useKeyboardShortcuts() {
  const shortcuts = {
    newTask: 'Ctrl+N',
    deleteTask: 'Delete',
    toggleFilter: 'F'
  }
  
  const handleKeyDown = (event: KeyboardEvent) => {
    const { ctrlKey, key } = event
    
    // Ctrl+N - New task
    if (ctrlKey && key === 'n') {
      event.preventDefault()
      emit('new-task')
    }
    
    // Delete - Delete task
    if (key === 'Delete') {
      emit('delete-task')
    }
  }
  
  return { handleKeyDown }
}
```

## Project Structure

```
lesson-4/
├── src/
│   ├── composables/
│   │   ├── useTaskManager.ts       # Main task logic
│   │   ├── useFormValidation.ts    # Form validation rules
│   │   └── useKeyboardShortcuts.ts # Keyboard event handlers
│   ├── components/
│   │   ├── TaskForm.vue            # Create/Edit task form
│   │   ├── TaskList.vue            # Display tasks
│   │   ├── TaskItem.vue            # Individual task
│   │   └── FilterBar.vue           # Filter controls
│   ├── views/
│   │   └── TaskManager.vue         # Main view
│   ├── router/
│   │   └── index.ts                # Router config
│   ├── types/
│   │   └── task.ts                 # TypeScript interfaces
│   ├── utils/
│   │   └── validators.ts           # Validation utilities
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      App.vue (Root)                          │
│  - Provides global state                                     │
│  - Manages router                                           │
│  - Calls composables                                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  TaskManager.vue (Main View)                 │
│  - Composes multiple composables                             │
│  - Manages form state                                       │
│  - Handles keyboard events                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              TaskForm.vue (Child Component)                  │
│  - Uses useFormValidation                                  │
│  - Two-way binding with v-model                             │
│  - Emits validation events                                  │
└─────────────────────────────────────────────────────────────┘
```

## Key Concepts

### 1. Composables Pattern

Composables extract reusable logic into functions that return reactive state:

```typescript
// useLocalStorage.ts - Persist data to localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = ref<T>(initialValue)
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }, [])
  
  // Save to localStorage on change
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue.value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [storedValue.value])
  
  return { storedValue, setStoredValue }
}
```

### 2. Computed with Multiple Dependencies

```typescript
// useTaskStats.ts - Calculate task statistics
export function useTaskStats(tasks: Ref<Task[]>) {
  const totalTasks = computed(() => tasks.value.length)
  const completedTasks = computed(() => 
    tasks.value.filter(t => t.completed).length
  )
  const activeTasks = computed(() => 
    tasks.value.filter(t => !t.completed).length
  )
  const completionRate = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })
  
  return {
    totalTasks,
    completedTasks,
    activeTasks,
    completionRate
  }
}
```

### 3. watchEffect for Auto-Execution

```typescript
// Auto-update UI when data changes
watchEffect(() => {
  console.log('Tasks changed:', tasks.value.length)
  updateTaskCount()
})

// watchEffect runs immediately, unlike watch
```

### 4. Async Operations with Error Handling

```typescript
const createTask = async (task: TaskFormData): Promise<Task> => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  })
  
  if (!response.ok) {
    throw new Error('Failed to create task')
  }
  
  return response.json()
}

const deleteTask = async (id: number): Promise<void> => {
  await fetch(`/api/tasks/${id}`, {
    method: 'DELETE'
  })
}
```

### 5. Form Validation with Custom Rules

```typescript
// Custom validation rules
const validationRules = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_]+$/ // Only letters, numbers, spaces, hyphens, underscores
  },
  description: {
    required: false,
    maxLength: 500
  },
  priority: {
    required: true,
    allowedValues: ['low', 'medium', 'high']
  }
}

// Validate field
const validateField = (
  field: keyof TaskFormData, 
  value: string | number, 
  rules: typeof validationRules
): boolean => {
  const fieldRules = rules[field]
  
  if (fieldRules.required && !value) return false
  
  if (fieldRules.minLength && value.length < fieldRules.minLength) return false
  
  if (fieldRules.maxLength && value.length > fieldRules.maxLength) return false
  
  if (fieldRules.pattern && !fieldRules.pattern.test(value as string)) return false
  
  if (fieldRules.allowedValues && !fieldRules.allowedValues.includes(value as string)) return false
  
  return true
}
```

## Setup

```bash
cd lesson-4
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

### Task Management

- **Create tasks** with title, description, and priority
- **Edit existing tasks** with inline editing
- **Delete tasks** with confirmation
- **Mark as complete/incomplete** with checkbox
- **Filter tasks** by: all, active, completed

### Form Validation

- **Required field validation**
- **Min/max length validation**
- **Pattern validation** (regex)
- **Custom error messages**
- **Real-time validation feedback**

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | Create new task |
| `Delete` | Delete selected task |
| `F` | Toggle filter view |
| `Esc` | Close modal/cancel edit |

### Async Operations

- **Loading states** during API calls
- **Error handling** with user feedback
- **Optimistic updates** for better UX
- **Debounced search** for performance

### Composables

- `useTaskManager()` - Main task logic
- `useFormValidation()` - Form validation rules
- `useKeyboardShortcuts()` - Keyboard event handlers
- `useLocalStorage()` - Persist data to localStorage
- `useTaskStats()` - Calculate task statistics

## Example Usage

1. **Start the app:** `npm run dev`
2. **Open browser:** http://localhost:5173/
3. **Create a task:**
   - Press `Ctrl+N` or click "New Task"
   - Fill in the form with validation
   - Submit to create
4. **Filter tasks:**
   - Click filter buttons (All/Active/Completed)
   - Press `F` to toggle filter
5. **Edit a task:**
   - Click on a task to edit
   - Press `Esc` to cancel
6. **Delete a task:**
   - Select a task
   - Press `Delete` key
7. **View statistics:**
   - See completion rate and task counts

## TypeScript Types

```typescript
// src/types/task.ts
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

## Best Practices Implemented

1. **Composables**: Extract reusable logic into composable functions
2. **Type Safety**: Full TypeScript with interfaces and type guards
3. **Error Handling**: Try-catch blocks with user-friendly messages
4. **Validation**: Client-side validation before API calls
5. **Performance**: Computed caching and debounced operations
6. **Code Style**: ESLint + Prettier configured
7. **Testing**: Vitest setup with component tests
8. **Accessibility**: Keyboard navigation and ARIA labels

## Comparison with Previous Lessons

| Feature | Lesson 1 | Lesson 2 | Lesson 3 | Lesson 4 |
|---------|----------|----------|----------|----------|
| State Management | Single ref | Props only | Reactive + watch | Composables + computed |
| Data Flow | One-way | One-way | Two-way | Complex patterns |
| Async Handling | ❌ | ❌ | ❌ | ✅ Loading states |
| Form Validation | ❌ | ❌ | ❌ | ✅ Custom rules |
| Keyboard Events | ❌ | ❌ | ❌ | ✅ Shortcuts |
| Code Reusability | ❌ | ❌ | ❌ | ✅ Composables |
| LocalStorage | ❌ | ❌ | ❌ | ✅ Persistence |

## Advanced Patterns

### 1. Composable with Multiple Return Values

```typescript
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }) as T
}
```

### 2. Composable with Cleanup

```typescript
export function useEventListener(
  target: Window | Document | Element,
  event: string,
  handler: EventListener
) {
  onMounted(() => {
    target.addEventListener(event, handler)
  })
  
  onUnmounted(() => {
    target.removeEventListener(event, handler)
  })
}
```

### 3. Composable with Deep Watch

```typescript
export function useDeepWatch(
  target: Ref<any>,
  callback: (newValue: any, oldValue: any) => void
) {
  watch(
    () => JSON.stringify(target.value),
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        callback(target.value, oldValue)
      }
    },
    { deep: true }
  )
}
```

## Testing

```bash
npm run test:unit
```

Example test:

```typescript
// src/composables/__tests__/useTaskManager.test.ts
import { describe, it, expect, vi } from 'vitest'
import { useTaskManager } from '../useTaskManager'

describe('useTaskManager', () => {
  it('should return initial state', () => {
    const { tasks, filter, isLoading } = useTaskManager()
    expect(tasks.value).toEqual([])
    expect(filter.value).toBe('all')
    expect(isLoading.value).toBe(false)
  })
  
  it('should filter tasks correctly', () => {
    const { filteredTasks, filter } = useTaskManager()
    filter.value = 'active'
    expect(filteredTasks.value).toEqual([])
  })
})
```

## Next Steps

After completing Lesson 4, you'll be ready for:
- **Lesson 5**: Pinia State Management
- **Lesson 6**: Advanced Routing with Guards
- **Lesson 7**: API Integration with Axios
- **Lesson 8**: Unit Testing Best Practices

---

**Stack:** Vue 3.5+, TypeScript 6+, Vite 8+, Vitest, ESLint, Prettier, Husky

## 1. The new App.vue and enhanced routing
Comparison: Lesson-3 vs Lesson-4 Routing
Lesson-3 (Simple RouterView)
<template>
  <header>
    <NavBar v-model:expr="expr" />
  </header>
  <RouterView />  <!-- Basic router view -->
</template>
Lesson-4 (Enhanced with Transitions)
<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

Key Differences:

✅ Functionally equivalent: Both render the current route component
✅ Same behavior: Navigation works identically
✅ Additional feature: Lesson-4 adds smooth fade transitions
⚠️ More complex: Lesson-4 requires understanding slot syntax and transitions
⚠️ Vue Router 4+ only: Lesson-3 works with Vue Router 3; Lesson-4 uses modern slot syntax

Why Lesson-4 is Better
Smooth UX: Visual feedback during navigation
Modern pattern: Uses Vue Router 4 recommended approach
Reusable: Easy to customize animations per route
Professional: Standard practice in production apps

How It Works
Lesson-3: RouterView directly renders the component for the current route.

Lesson-4:
- slot="{ Component }" extracts the current route component
- <transition> wraps it with fade animation
- mode="out-in" ensures old component fades out before new one fades in
- <component :is="Component"> renders the extracted component

Both achieve the same routing behavior, but Lesson-4 provides a polished user experience with smooth transitions.