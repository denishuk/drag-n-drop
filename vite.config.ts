import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "", "src"),
    },
  },
  root: path.resolve(import.meta.dirname, "src"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 5001,
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
