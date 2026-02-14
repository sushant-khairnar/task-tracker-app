<template>
  <div class="app">
    <header class="header">
      <h1>✅ Task Tracker</h1>
      <p>Preskilet Intern Assignment</p>
    </header>

    <main class="container">
      <TaskForm @refresh="fetchTasks" />

      <div class="toolbar">
        <select v-model="filterStatus" @change="fetchTasks">
          <option value="">All</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>

        <input
          v-model="search"
          placeholder="Search by title..."
          @input="fetchTasks"
        />
      </div>

      <TaskList :tasks="tasks" @refresh="fetchTasks" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "./services/api";
import TaskForm from "./components/TaskForm.vue";
import TaskList from "./components/TaskList.vue";

const tasks = ref([]);
const filterStatus = ref("");
const search = ref("");

const fetchTasks = async () => {
  const params = {};
  if (filterStatus.value) params.status = filterStatus.value;
  if (search.value) params.search = search.value;
  params.sort = "latest";

  const res = await api.get("/tasks", { params });
  tasks.value = res.data.tasks;
};

onMounted(fetchTasks);
</script>

<style>
body {
  margin: 0;
  font-family: "Segoe UI", sans-serif;
  background: #f4f6f8;
}

.app {
  min-height: 100vh;
}

.header {
  background: #4f46e5;
  color: white;
  padding: 20px;
  text-align: center;
}

.container {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 16px;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.toolbar select,
.toolbar input {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex: 1;
}
</style>
