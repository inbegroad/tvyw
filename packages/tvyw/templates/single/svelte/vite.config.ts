import { vitePluginTvyw } from "tvyw";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({ plugins: [vitePluginTvyw(), svelte()] });
