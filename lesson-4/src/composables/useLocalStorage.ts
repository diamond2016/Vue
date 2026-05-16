import { ref, watch, type Ref } from 'vue';

/**
 * A custom composable that synchronizes a Vue ref with the browser's localStorage.
 *
 * @template T The type of the value being stored.
 * @param {string} key The key under which the value will be stored in localStorage.
 * @param {T} initialValue The default value to use if nothing is found in localStorage.
 * @returns {Ref<T>} A Vue ref that holds the value and automatically syncs with localStorage.
 */
export function useLocalStorage<T>(key: string, initialValue: T): Ref<T> {
  // 1. Initialize the ref by checking localStorage
  const storedValue = localStorage.getItem(key);
  
  // Determine the initial value: parse from storage or use the provided default
  const value = ref<T>(
    storedValue ? JSON.parse(storedValue) as T : initialValue
  );

  // 2. Watch the ref and update localStorage whenever the value changes
  watch(value, (newValue) => {
    try {
      // Stringify the new value and save it to localStorage
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      // Handle potential storage quota errors or security issues
      console.error(`Error saving to localStorage for key \"${key}":`, error);
    }
  }, { deep: true }); // Use deep watch if T is an object/array

  // 3. Return the ref
  return value;

}