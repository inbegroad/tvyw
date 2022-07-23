import { vitePluginTvyw } from "tvyw";
import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [vitePluginTvyw(), preact()] });
