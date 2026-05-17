import { ref, computed, onMounted } from 'vue'
import type { Task, TaskFormData } from '@/types/task'
import { useLocalStorage } from './useLocalStorage'

const TASK_STORAGE_KEY = 'task_manager_tasks'

/**
 * @description Manages all task-related state, logic, and data fetching.
 * @returns {object} An object containing reactive state and methods.
 */
export function useTaskManager() {
  // Instantiate useLocalStorage                                                                                                                                                                                                      
  //    - <Task[]>: Specifies the type of data (an array of Task objects)                                                                                                                                                                
  //    - TASK_STORAGE_KEY: The string key used in localStorage                                                                                                                                                                          
  //    - []: The initial value (an empty array of Tasks)                                                                                                                                                                                
  const tasks = useLocalStorage<Task[]>(TASK_STORAGE_KEY, [])
  
  // --- STATE ---
  const filter = ref<'all' | 'active' | 'completed'>('all')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // --- COMPUTED PROPERTIES ---
  const filteredTasks = computed(() => {
    if (filter.value === 'all') {
      return tasks.value
    }
    if (filter.value === 'active') {
      return tasks.value.filter(task => !task.completed)
    }
    if (filter.value === 'completed') {
      return tasks.value.filter(task => task.completed)
    }
    return tasks.value
  })

  // --- METHODS (CRUD & Logic) ---

  /**
   * Fetches initial task data (simulates API call).
   */
  const fetchTasks = async () => {                                                                                                                                                                                                          
    isLoading.value = true
    try {
      // Simulate API fetch delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate data received from a remote API
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Design UI Mockups',
          description: 'Create high-fidelity mockups for the task manager.',
          priority: 'High',
          completed: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 2,
          title: 'Implement Task Logic',
          description: 'Finish the CRUD operations in useTaskManager.',
          priority: 'High',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: 'Write Documentation',
          description: 'Document the composables and API usage.',
          priority: 'Medium',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      
      // Overwrite local storage data with fresh data from the API
      tasks.value = mockTasks
    } catch (e) {
      error.value = 'Failed to fetch tasks from API.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Adds a new task to the list.
   * @param formData - The data for the new task.
   */
  const addTask = (formData: TaskFormData) => {                                                                                                                                                                                  
    // When you modify tasks.value, the useLocalStorage watcher automatically saves it!                                                                                                                                                  
    const newTask: Task = {                                                                                                                                                                                                              
      id: Date.now(),                                                                                                                                                                                                                    
      title: formData.title,                                                                                                                                                                                                             
      description: formData.description,
      priority: formData.priority,                                                                                                                                                                                                              
      completed: false,                                                                                                                                                                                                                  
      createdAt: new Date().toISOString(),                                                                                                                                                                                               
      updatedAt: new Date().toISOString(),                                                                                                                                                                                               
    }                                                                                                                                                                                                                                    
    tasks.value = [...tasks.value, newTask]  
  }

  /**
   * Updates an existing task.
   * @param id - The ID of the task to update.
   * @param formData - The new data for the task.
   */
  const updateTask = (id: number, formData: TaskFormData) => {
    tasks.value = tasks.value.map(task => 
      task.id === id 
        ? { ...task, ...formData, updatedAt: new Date().toISOString() } 
        : task
    )
  }

  /**
   * Deletes a task by ID.
   * @param id - The ID of the task to delete.
   */
  const deleteTask = (id: number) => {
    // modifying tasks.value triggers the save                                                                                                                                                                                    
    tasks.value = tasks.value.filter(task => task.id !== id)  
  }

  /**
   * Toggles the 'completed' status of a task.
   * @param id - The ID of the task to toggle.
   */
  const toggleTask = (id: number) => {
    tasks.value = tasks.value.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } 
        : task
    )
  }

  // --- LIFECYCLE HOOKS ---
  onMounted(() => {
    fetchTasks()
  })

  // --- RETURN VALUES ---
  return {
    tasks,
    filteredTasks,
    filter,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  }
}