import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Cho phép truy cập từ IP LAN
    port: 5173,
    allowedHosts: [
      "864df9a04d89.ngrok-free.app", // Thêm domain ngrok vào đây
      "localhost",
      "3000",
    ],
  },
});
