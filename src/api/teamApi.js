import api from "./axios";

export const getTeams = (params) => {
  return api.get("/teams", {params});
};