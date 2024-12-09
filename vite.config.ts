import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@stores": path.resolve(__dirname, "src/app/stores"),
      "@ToDo": path.resolve(__dirname, "src/models/ToDo"),
      "@Status": path.resolve(__dirname, "src/models/Status"),
      "@api": path.resolve(__dirname, "src/api"),
      "@utils": path.resolve(__dirname, "src/app/common/utils"),
    },
  },
  server: {
    host: true,
    strictPort: true,
    //port: 7080,
  },
});
