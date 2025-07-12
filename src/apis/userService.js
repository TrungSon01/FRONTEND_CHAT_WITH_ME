import { http } from "./config";

export const loginService = (data) => {
  return http.post("/auth/login", data);
};

export const registerService = (data) => {
  return http.post("/auth/register", data);
};

export const getUser = () => {
  return http.get("/auth/user");
};

export const getAllUsersExceptMe = (userId) => {
  return http.get(`/auth/users?userId=${userId}`);
};
