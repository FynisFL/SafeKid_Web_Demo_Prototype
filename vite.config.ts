import { defineConfig, PluginOption } from "vite";
import { enterDevPlugin, enterProdPlugin } from 'vite-plugin-enter-dev';
import path from "path";
import { mkdir, writeFile } from "node:fs/promises";

const appEntry: PluginOption = {
  name: "safekid-app-entry",
  apply: "build",
  async writeBundle({ dir }, bundle) {
    // GitHub Pages can serve directory indexes without a SPA rewrite.
    const index = bundle["index.html"];
    if (!dir || index?.type !== "asset") return;

    const appDirectory = path.join(dir, "app");
    await mkdir(appDirectory, { recursive: true });
    await writeFile(path.join(appDirectory, "index.html"), index.source);
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    ...enterProdPlugin(),
    appEntry,
  ];
  if (mode === 'development') {
    plugins.push(...enterDevPlugin());
  }

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
    // SafeKid is published on the custom domain digibabi.id.vn.
    // Custom domains serve the site from the origin root, not /<repo>/.
    base: '/',
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