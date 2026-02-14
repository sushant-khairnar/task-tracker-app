<template>
  <div class="card">
    <h2>Add New Task</h2>
    <form @submit.prevent="submitTask">
      <input v-model="title" placeholder="Task title" required />
      <textarea v-model="description" placeholder="Description (optional)" />
      <select v-model="status" required>
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>
      <button type="submit">➕ Add Task</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";

const emit = defineEmits(["refresh"]);

const title = ref("");
const description = ref("");
const status = ref("TODO");

const submitTask = async () => {
  await api.post("/tasks", {
    title: title.value,
    description: description.value,
    status: status.value,
  });

  title.value = "";
  description.value = "";
  status.value = "TODO";

  emit("refresh");
};
</script>

<style scoped>
.card {
  background: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card h2 {
  margin-bottom: 10px;
  color: black;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input, textarea, select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
