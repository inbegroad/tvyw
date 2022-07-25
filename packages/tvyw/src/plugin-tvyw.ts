import legacy from "@vitejs/plugin-legacy";
import { ConfigEnv, LibraryFormats, Plugin, UserConfig } from "vite";
import { readPackageJsonSync } from "./tools/read";
import { isWorkspace } from "./tools/workspaces-list";
import { dedupArray } from "./tools/set-to-array";
import { externalsTool } from "./tools/externals-tool";
import { getEntryExtentionFromFramework } from "./tools/extention-from-framework";
import { getExtFromBuildFile } from "./tools/get-ext-from-build-file";
import { resolveConfig } from "./tools/resolveProjMan";
import { resolve } from "path";
import delPlugin from "rollup-plugin-delete";
import typescriptPlugin from "rollup-plugin-typescript2";

export type TvywPluginPropsType = {
  disableExternal?: boolean;
};
export const vitePluginTvyw = (
  { disableExternal }: TvywPluginPropsType = { disableExternal: false }
): Plugin => {
  return {
    name: "vite-plugin-tvyw",
    config: (config: UserConfig, { mode }: ConfigEnv): UserConfig => {
      {
        const projMan = resolveConfig();
        const packageJson = readPackageJsonSync();
        let dependencies: string[] | undefined;
        if (packageJson.dependencies) {
          dependencies = Object.keys(packageJson.dependencies).filter((dep) =>
            isWorkspace(dep)
          );
        }
        const exclude = dedupArray(
          ...(config.optimizeDeps?.include || []),
          ...(dependencies || [])
        );
        if (projMan.repoType === "monoRepo" && projMan.root)
          throw new Error(
            "Project build was called from root level, please check your configuration"
          );
        const dev = mode === "development";
        const { buildDir, entries, entriesDir, framework, workspaceType } =
          projMan;

        const plugins: Plugin[] =
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
            : [
                typescriptPlugin({
                  tsconfig: resolveToDirname("tsconfig.json"),
                  useTsconfigDeclarationDir: true,
                }),
                delPlugin({
                  targets: [`${projMan.declarationDir}/**/*`],
                  verbose: dev,
                  hook: "buildStart",
                  runOnce: dev,
                }),
              ];

        const formats: LibraryFormats[] = ["es", "umd", "cjs"];
        const externals = externalsTool({
          packageJson: readPackageJsonSync(),
          isPackage: workspaceType === "package",
        });
        return {
          clearScreen: false,

          root: workspaceType === "app" ? entriesDir : undefined,
          plugins: [...plugins, ...(config.plugins || [])],

          optimizeDeps: {
            ...config.optimizeDeps,
            exclude,
          },

          build: {
            commonjsOptions: {
              ...config.build?.commonjsOptions,
              include: [
                ...(externals.external || []).map((ex) => `/${ex}/`),
                projMan.repoType === "monoRepo" ? "/node_modules/" : "",
              ],
            },
            emptyOutDir: !dev,
            watch: dev
              ? {
                  clearScreen: false,
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
            outDir: workspaceType === "app" ? `../${buildDir}` : buildDir,
            lib: workspaceType === "package" && {
              name: entries,
              entry: `${entriesDir}/${entries}.${getEntryExtentionFromFramework(
                framework,
                workspaceType
              )}`,
              formats,
              fileName: (format) => `[name]${getExtFromBuildFile(format)}`,
              ...config.build?.lib,
            },
            ...config.build,
          },
        };
      }
    },
  };
};

export function resolveToDirname(name: string) {
  return resolve(__dirname, name);
}

// export const tvyw:Plugin =
