import api from "./axios";

export const getPositions = (params) => {
  return api.get("/positions", { params });
};

export const createPosition = (data) => api.post("/positions", data);

export const updatePosition = (id, data) => api.put(`/positions/${id}`, data);

export const deletePosition = (id) => api.delete(`/positions/${id}`);