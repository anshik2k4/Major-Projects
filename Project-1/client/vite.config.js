import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/listing": { target: "http://localhost:8080", changeOrigin: true },
      "/login": { target: "http://localhost:8080", changeOrigin: true },
      "/signup": { target: "http://localhost:8080", changeOrigin: true },
      "/logout": { target: "http://localhost:8080", changeOrigin: true },
      "/css": { target: "http://localhost:8080", changeOrigin: true },
      "/images": { target: "http://localhost:8080", changeOrigin: true },
      "/js": { target: "http://localhost:8080", changeOrigin: true },
      "/api": { target: "http://localhost:8080", changeOrigin: true },
    },
  },
});
