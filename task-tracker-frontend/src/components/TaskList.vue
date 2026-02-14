<template>
  <div class="list">
    <div v-if="tasks.length === 0" class="empty">
      No tasks found 🚀
    </div>

    <div v-for="task in tasks" :key="task._id" class="task-card">
      <!-- VIEW MODE -->
      <div v-if="editId !== task._id">
        <div class="task-header">
          <h3>{{ task.title }}</h3>
          <span :class="['badge', task.status]">{{ task.status }}</span>
        </div>

        <p class="desc">{{ task.description || "No description" }}</p>

        <div class="actions">
          <button class="edit" @click="startEdit(task)">✏️ Edit</button>
          <button class="delete" @click="deleteTask(task._id)">🗑 Delete</button>
        </div>
      </div>

      <!-- EDIT MODE -->
      <div v-else>
        <input v-model="editTitle" placeholder="Title" class="input" />
        <input v-model="editDescription" placeholder="Description" class="input" />

        <select v-model="editStatus" class="input">
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>

        <div class="actions">
          <button class="save" @click="updateTask(task._id)">💾 Save</button>
          <button class="cancel" @click="cancelEdit">❌ Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";

const props = defineProps({
  tasks: Array,
});

const emit = defineEmits(["refresh"]);

const editId = ref(null);
const editTitle = ref("");
const editDescription = ref("");
const editStatus = ref("TODO");

const startEdit = (task) => {
  editId.value = task._id;
  editTitle.value = task.title;
  editDescription.value = task.description;
  editStatus.value = task.status;
};

const cancelEdit = () => {
  editId.value = null;
};

const updateTask = async (id) => {
  try {
    await api.put(`/tasks/${id}`, {
      title: editTitle.value,
      description: editDescription.value,
      status: editStatus.value,
    });

    editId.value = null;
    emit("refresh"); // reload tasks from backend
  } catch (err) {
    console.error("Update failed", err);
    alert("Failed to update task");
  }
};

const deleteTask = async (id) => {
  if (!confirm("Delete this task?")) return;
  await api.delete(`/tasks/${id}`);
  emit("refresh");
};
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #070707;
}

.task-card {
  background: white;
  padding: 14px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.desc {
  color: #555;
  margin: 8px 0;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  color: white;
}

.TODO {
  background: #6b7280;
}
.IN_PROGRESS {
  background: #f59e0b;
}
.DONE {
  background: #10b981;
}

.actions {
  text-align: right;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.edit {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 7px;
  cursor: pointer;
}

.save {
  background: #10b981;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.cancel {
  background: #6b7280;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.input {
  width: 100%;
  margin: 6px 0;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.empty {
  text-align: center;
  color: #777;
  margin-top: 20px;
}
</style>
