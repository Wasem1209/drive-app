// vite.config.js
import { defineConfig } from "vite";           // Make sure this import is present
import react from "@vitejs/plugin-react";      // Make sure React plugin is imported
import NodePolyfills from "rollup-plugin-node-polyfills"; // Node polyfills

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["lucid-cardano/browser"], // Only if you use Lucid in the browser
  },
  build: {
    rollupOptions: {
      plugins: [NodePolyfills()],
    },
  },
  define: {
    "process.env": {}, // for browser compatibility
  },
});
