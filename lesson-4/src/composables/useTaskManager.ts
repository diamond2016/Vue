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
    // TODO: Implement filtering logic based on 'filter.value'
    return tasks.value
  })

  // --- METHODS (CRUD & Logic) ---

  /**
   * Fetches initial task data (simulates API call).
   */
  const fetchTasks = async () => {                                                                                                                                                                                                          
    // Simulate API fetch, but if tasks.value is already populated from localStorage,                                                                                                                                                    
    // you might skip this or merge the data.                                                                                                                                                                                            
    await new Promise(resolve => setTimeout(resolve, 1000))                                                                                                                                                                              
    isLoading.value = false                                                                                                                                                                                                              
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
    // TODO: Implement task update logic (find and replace in tasks.value)
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
    // TODO: Implement task toggle logic
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