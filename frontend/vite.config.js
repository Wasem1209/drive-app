import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import NodePolyfills from "rollup-plugin-node-polyfills";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      // Force lucid-cardano to use the browser entry
      "lucid-cardano": path.resolve(
        // eslint-disable-next-line no-undef
        __dirname,
        "node_modules/lucid-cardano/browser/index.js"
      ),
    },
  },
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
