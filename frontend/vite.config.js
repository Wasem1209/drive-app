import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import NodePolyfills from "rollup-plugin-node-polyfills";

export default defineConfig({
  base: "./", // important: relative paths for deployed SPA
  plugins: [react()],
  optimizeDeps: {
    include: ["lucid-cardano/browser"],
  },
  build: {
    rollupOptions: {
      plugins: [NodePolyfills()],
    },
  },
  define: {
    "process.env": {},
  },
});
