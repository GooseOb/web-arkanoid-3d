import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  const isProd = command === "build";

  const base = isProd ? "/web-arkanoid-3d/" : "/";

  return { base };
});
