import api from "./axios";

export const getRoles = (params) => {
  return api.get("/roles", { params });
};

export const createRole = (data) => api.post("/roles", data);

export const updateRole = (id, data) => api.put(`/roles/${id}`, data);

export const deleteRole = (id) => api.delete(`/roles/${id}`);