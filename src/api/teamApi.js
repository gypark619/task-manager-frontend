import api from "./axios";

export const getTeams = (params) => {
  return api.get("/teams", {params});
};

export const createTeam = (data) => api.post("/teams", data);

export const updateTeam = (id, data) => api.put(`/teams/${id}`, data);

export const deleteTeam = (id) => api.delete(`/teams/${id}`);