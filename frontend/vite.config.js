import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from 'vite-plugin-wasm';
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

export default defineConfig({
  plugins: [wasm(), react()],
  resolve: {
    alias: {
      // Browser polyfills for Node modules
      fs: false,
      path: "path-browserify",
      stream: "stream-browserify",
      util: "util/",
      crypto: "crypto-browserify",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis", // some Lucid packages expect global
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      // ensure external Node modules are ignored
      external: ["fs", "path", "stream", "util", "crypto"],
    },
  },
});
