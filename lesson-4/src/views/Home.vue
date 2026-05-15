<template>
  <div class="home-container">
    <h1>Welcome to Task Manager</h1>
    <p class="subtitle">Your personal task management application</p>
    <router-link to="/tasks" class="cta-button">
      Get Started
    </router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #369970;
}
</style>

<style scoped>
.app {
  padding: 10px;
}
</style>
