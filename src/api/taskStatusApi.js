import api from "./axios";

export const getTaskStatuses = () => api.get("/task-statuses");