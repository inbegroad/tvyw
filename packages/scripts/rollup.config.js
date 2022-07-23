import { defineConfig } from "rollup";
import commonjsPlugin from "@rollup/plugin-commonjs";
import eslintPlugin from "@rollup/plugin-eslint";
import jsonPlugin from "@rollup/plugin-json";
import resolvePlugin from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import delPlugin from "rollup-plugin-delete";
import typescriptPlugin from "rollup-plugin-typescript2";
import { dependencies } from "./package.json";
import path, { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

const isDev = process.argv.includes("-w") || process.argv.includes("--watch");

const globals = {
  fs: "fs",
  path: "path-browserify",
  "@yarnpkg/shell": "shell",
};
const external = Object.keys(dependencies).concat(
  "fs",
  "path",
  "@yarnpkg/shell"
);

const resolveToDirname = (name) => path.resolve(__dirname, name);

export default defineConfig({
  input: resolveToDirname("src/index.ts"),
  external: external,
  output: [
    {
      name: "index",
      file: resolveToDirname("dist/index.js"),
      format: "cjs",
      sourcemap: isDev,
      globals,
    },
    {
      name: "index",
      file: resolveToDirname("dist/index.umd.js"),
      format: "umd",
      sourcemap: isDev,
      globals,
    },
    {
      name: "index",
      file: resolveToDirname("dist/index.es.js"),
      format: "es",
      sourcemap: isDev,
      globals,
    },
  ],
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
  plugins: [
    {
      name: "rollup-plugin-edit-version",
      buildStart: async () => {
        const vConfigFilePath = resolve("../tvyw/src/version.json");
        const versionJson = JSON.parse(
          readFileSync(resolve(vConfigFilePath), "utf8")
        );
        const pkgJsonPath = resolve(`../${versionJson.name}/package.json`);
        const cPkgJsonPath = resolve(
          `../create-${versionJson.name}/package.json`
        );
        const pkgJson = JSON.parse(readFileSync(resolve(pkgJsonPath), "utf8"));
        const cPkgJson = JSON.parse(
          readFileSync(resolve(cPkgJsonPath), "utf8")
        );
        versionJson.version = pkgJson.version;
        versionJson.dev = isDev;
        writeFileSync(vConfigFilePath, JSON.stringify(versionJson, null, 2));

        cPkgJson.dependencies[versionJson.name] = isDev
          ? "workspace:^"
          : pkgJson.version;
        writeFileSync(cPkgJsonPath, JSON.stringify(cPkgJson, null, 2));
      },
    },
    jsonPlugin(),
    eslintPlugin(),
    commonjsPlugin(),
    typescriptPlugin({
      tsconfig: resolveToDirname("tsconfig.json"),
      useTsconfigDeclarationDir: true,
    }),
    resolvePlugin({
      preferBuiltins: false,
      resolveOnly: external,
    }),
    delPlugin({
      targets: ["./dist/**/*", "./types/**/*"],
      verbose: isDev,
      hook: "buildStart",
      runOnce: isDev,
    }),
    !isDev && terser(),
  ],
});
