import { defineConfig } from "vite";
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import nodePolyfills from "rollup-plugin-polyfill-node";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  optimizeDeps: {
    esbuildOptions: {
      // Enable esbuild polyfill plugins
      plugins: [NodeModulesPolyfillPlugin()],
      exclude: ['chunk-KXW2NGCQ.js']
    },
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },
}); 