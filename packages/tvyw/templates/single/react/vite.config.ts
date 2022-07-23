import { vitePluginTvyw } from "tvyw";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({ plugins: [react(), vitePluginTvyw()] });
