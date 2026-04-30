import api from "./axios";

export const getTasks = (params) => {
  return api.get("/tasks", { params });
};

export const createTask = (data) => api.post("/tasks", data);

export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export const getTask = (taskId) => {
  return api.get(`/tasks/${taskId}`);
};