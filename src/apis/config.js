import axios from "axios";

export const http = axios.create({
  baseURL: "https://backendchatwithme-production.up.railway.app/api",
});
