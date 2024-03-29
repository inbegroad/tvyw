import legacy from "@vitejs/plugin-legacy";
import esLint from "vite-plugin-eslint";
import { ConfigEnv, LibraryFormats, PluginOption, UserConfig } from "vite";
import { readPackageJsonSync } from "./tools/read";
import { dedupArray } from "./tools/set-to-array";
import { externalsTool } from "./tools/externals-tool";
import { getEntryExtentionFromFramework } from "./tools/extention-from-framework";
import { getExtFromBuildFile } from "./tools/get-ext-from-build-file";
import { resolveConfig } from "./tools/resolveProjMan";
import { resolve } from "path";
import { isNodeModule } from "./tools/is-module";

export type TvywPluginPropsType = {
  disableExternal?: boolean;
};
export const vitePluginTvyw = (
  { disableExternal }: TvywPluginPropsType = { disableExternal: false }
): PluginOption => {
  const projMan = resolveConfig();
  const packageJson = readPackageJsonSync();
  return {
    name: "vite-plugin-tvyw",

    config: (config: UserConfig, { mode }: ConfigEnv): UserConfig => {
      {
        const dev = mode === "development";
        let dependencies: string[] | undefined;
        if (packageJson.dependencies) {
          dependencies = Object.keys(packageJson.dependencies).filter((dep) =>
            isNodeModule(dep)
          );
        }
        const exclude = dedupArray(
          ...(config.optimizeDeps?.exclude || []),
          ...(dependencies || [])
        );
        if (projMan.repoType === "monoRepo" && projMan.root)
          throw new Error(
            "Project build was called from root level, please check your configuration"
          );
        const { buildDir, entries, entriesDir, framework, workspaceType } =
          projMan;

        const plugins: PluginOption[] = [esLint()].concat(
          workspaceType === "app"
            ? [
                legacy({
                  additionalLegacyPolyfills: [
                    "formdata-polyfill",
                    "element-remove",
                    "eligrey-classlist.js",
                  ],
                  targets: ["defaults", "not IE 11"],
                }),
              ]
            : []
        );
        const formats: LibraryFormats[] = ["umd", "cjs", "es"];
        const externals = externalsTool({
          packageJson: readPackageJsonSync(),
          isPackage: workspaceType === "package",
        });
        const optimizeDeps = {
          ...config.optimizeDeps,
          include: config.optimizeDeps?.exclude?.concat(exclude || []),
        };

        return {
          clearScreen: false,

          root:
            workspaceType === "app"
              ? resolveFromDirName(entriesDir)
              : undefined,
          plugins: [...new Set([...plugins, ...(config.plugins || [])])],
          resolve: {
            dedupe: [
              ...new Set([
                ...(config.resolve?.dedupe || []),
                ...(externals.external || []),
              ]),
            ],
          },
          esbuild: {
            ...config.esbuild,
            logOverride: {
              ...(config.esbuild && config.esbuild.logOverride),
              "this-is-undefined-in-esm": "silent",
            },
          },
          optimizeDeps,

          build: {
            emptyOutDir: !dev,
            watch: dev
              ? {
                  clearScreen: !dev,
                }
              : undefined,
            minify: !dev,

            sourcemap: dev,
            rollupOptions: {
              ...config.build?.rollupOptions,
              external: !disableExternal ? externals.external : undefined,
              output: {
                ...config.build?.rollupOptions?.output,
                globals: !disableExternal ? externals.globals : undefined,
              },
              onwarn(warning, warn) {
                if (warning.message.includes("Package subpath")) {
                  return;
                }
                if (warning.message.includes("Use of eval")) {
                  return;
                }
                if (warning.message.includes("Circular dependency")) {
                  return;
                }
                warn(warning);
              },
            },
            outDir: resolveFromDirName(buildDir),
            lib:
              workspaceType === "package"
                ? {
                    name: entries,
                    entry: resolveFromDirName(
                      `${entriesDir}/${entries}.${getEntryExtentionFromFramework(
                        framework,
                        workspaceType
                      )}`
                    ),
                    formats,
                    fileName: (format) =>
                      `[name]${getExtFromBuildFile(format)}`,
                    ...config.build?.lib,
                  }
                : false,
            ...config.build,
          },
        };
      }
    },
  };
};

function resolveFromDirName(src: string) {
  return resolve(process.cwd(), src);
}
