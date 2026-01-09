import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VERCEL === "1"
          ? "https://restyle-backend123.vercel.app"
          : "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
