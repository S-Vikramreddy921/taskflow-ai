import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

export const api = {
  getBoard: (id) => client.get(`/boards/${id}`).then((r) => r.data),

  createTask: (payload) => client.post("/tasks", payload).then((r) => r.data),

  updateTask: (id, payload) => client.put(`/tasks/${id}`, payload).then((r) => r.data),

  moveTask: (id, targetColumnId, targetPosition) =>
    client
      .patch(`/tasks/${id}/move`, { targetColumnId, targetPosition })
      .then((r) => r.data),

  deleteTask: (id) => client.delete(`/tasks/${id}`),

  clearColumn: (columnId) => client.delete(`/columns/${columnId}/tasks`),

  suggestTask: (title, context) =>
    client.post("/ai/suggest", { title, context }).then((r) => r.data),
};
