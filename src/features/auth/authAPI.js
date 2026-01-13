import api from "../../services/api";

export const registerAPI = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data; // expects { user, token }
};

export const loginAPI = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data; // expects { user, token }
};
