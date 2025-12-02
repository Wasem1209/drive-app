import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import NodePolyfills from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [react()],
  base: "./", // <-- THIS FIXES blank page in production
  optimizeDeps: {
    include: ["lucid-cardano/browser"],
  },
  build: {
    rollupOptions: {
      plugins: [
        NodePolyfills()
      ],
    },
  },
  define: {
    "process.env": {},
  },
});
