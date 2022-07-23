import { vitePluginTvyw } from "tvyw";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [vitePluginTvyw, vue()] });
