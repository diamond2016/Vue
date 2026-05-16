<template>
  <div class="settings-container">
    <h1>User Settings</h1>
    
    <div class="input-group">
      <label for="username">Username:</label>
      <input 
        id="username" 
        v-model="username" 
        placeholder="Enter username" 
      />
    </div>

    <p>Current Username: <strong>{{ username }}</strong></p>
    
    <button @click="clearStorage" class="clear-button">Clear Local Storage</button>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@/composables/useLocalStorage';

// Define the type for the username (string)
// Use the composable to manage the 'username' state
// If 'username' is not in localStorage, it defaults to 'Guest'
const username = useLocalStorage<string>('user_username', 'Guest');

// Example function to demonstrate clearing storage
const clearStorage = () => {
  localStorage.removeItem('user_username');
  // Reset the ref to the initial value after clearing storage
  username.value = 'Guest'; 
};
</script>

<style scoped>
.settings-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #35495e;
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

p {
  margin-bottom: 20px;
  font-size: 1.1em;
}

.clear-button {
  width: 100%;
  padding: 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-button:hover {
  background-color: #c0392b;
}
</style>