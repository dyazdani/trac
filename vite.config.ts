import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // to fix bug accessing Vite Node dependencies (was logging TypeError: 'Bst.inherits is not a function')
    nodePolyfills(),
  ],
  // To remove the build warning: '".prisma/client/index-browser" is imported by ".prisma/client/index-browser?commonjs-external", but could not be resolved – treating it as an external dependency.'
  resolve: {
    alias: {
      ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
    }
  },
}); 