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
    exclude: ['chunk-KXW2NGCQ.js'],
    esbuildOptions: {
      // Enable esbuild polyfill plugins
      plugins: [NodeModulesPolyfillPlugin()]
    },
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },
}); 