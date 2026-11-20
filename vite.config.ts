import { defineConfig, PluginOption } from "vite";
import { enterDevPlugin, enterProdPlugin } from 'vite-plugin-enter-dev';
import path from "path";
import { mkdir, readdir, writeFile } from "node:fs/promises";

const pageEntries: PluginOption = {
  name: "safekid-page-entries",
  apply: "build",
  async writeBundle({ dir }, bundle) {
    // GitHub Pages can serve directory indexes without a SPA rewrite.
    const index = bundle["index.html"];
    if (!dir || index?.type !== "asset") return;

    const html = typeof index.source === "string" ? index.source : new TextDecoder().decode(index.source);
    // Retry can revalidate a failed lazy route by its deployed, hashed URL.
    const routeChunks = Object.fromEntries(Object.values(bundle).flatMap((entry) =>
      entry.type === "chunk" && entry.isDynamicEntry && /\/src\/pages\/(Product|Zodiac)\.tsx$/.test(entry.facadeModuleId ?? "")
        ? [[entry.name, entry.fileName]]
        : []
    ));
    await writeFile(path.join(dir, "route-chunks.json"), JSON.stringify(routeChunks));
    await writeFile(path.join(dir, "404.html"), html.replace("<head>", '<head><meta name="robots" content="noindex" />'));

    const editionImages = await readdir(path.join(__dirname, "src/assets/safekid/editions"));
    const productRoutes = editionImages
      .filter((file) => /^[a-z]+\.webp$/.test(file))
      .map((file) => `product/${path.basename(file, ".webp")}`);
    for (const route of ["app", "watch-passport", "watchpassport", "Watchpassport", "WatchPassport", "zodiac", "support", "contact", "about", "chat", "s-f-ai", "sos", "cart", "checkout", ...productRoutes]) {
      const pageDirectory = path.join(dir, route);
      await mkdir(pageDirectory, { recursive: true });
      await writeFile(path.join(pageDirectory, "index.html"), index.source);
    }
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    ...enterProdPlugin(),
    pageEntries,
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
