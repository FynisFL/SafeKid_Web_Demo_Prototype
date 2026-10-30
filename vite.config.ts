import { defineConfig, PluginOption } from "vite";
import { enterDevPlugin, enterProdPlugin } from 'vite-plugin-enter-dev';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    ...enterProdPlugin(),
  ];
  if (mode === 'development') {
    plugins.push(...enterDevPlugin());
  }
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: plugins.filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // GitHub Pages serves this repository as a project site under /<repo>/.
    // Keep local development at the root for a simpler localhost URL.
    base: isGitHubActions ? '/SafeKid_Web_Demo_Prototype/' : '/',
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("motion") || id.includes("framer-motion")) return "motion";
            if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
              return "react-vendor";
            }
            return "vendor";
          },
        },
      },
    }
  };
});