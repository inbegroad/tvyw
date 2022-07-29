import { defineConfig } from "rollup";
import commonjsPlugin from "@rollup/plugin-commonjs";
import eslintPlugin from "@rollup/plugin-eslint";
import jsonPlugin from "@rollup/plugin-json";
import resolvePlugin from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import delPlugin from "rollup-plugin-delete";
import ts from "rollup-plugin-typescript2";
import camelcase from "camelcase";
import { dependencies } from "./package.json";
import { build, ignoreFiles } from "scripts";
import { resolve } from "path";

const isDev = process.argv.includes("-w") || process.argv.includes("--watch");

const globals = {};
const external = Object.keys(dependencies);
external.forEach((ext) => {
  if (ext === "path") globals["path"] = "path-browserify";
  else globals[ext] = camelcase(ext);
});

const resolveToDirname = (name) => resolve(__dirname, name);

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
      file: resolveToDirname("dist/index.es.js"),
      format: "es",
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
    build(),
    ignoreFiles([
      {
        buildDir: "dist",
        dirName: "tvyw",
        packageName: "tvyw",
        rootDir: "packages",
      },
      {
        buildDir: "dist",
        dirName: "scripts",
        rootDir: "packages",
        packageName: "scripts",
        deploy: false,
      },
      {
        buildDir: "dist",
        dirName: "create-tvyw",
        packageName: "create-tvyw",
        rootDir: "packages",
        deploy: false,
      },
    ]),
    jsonPlugin(),
    eslintPlugin(),
    commonjsPlugin(),
    ts({
      tsconfig: resolveToDirname("./tsconfig.json"),
      typescript: require("typescript"),
      useTsconfigDeclarationDir: true,
    }),
    delPlugin({
      targets: ["./dist/**/*", "./types/**/*"],
      verbose: isDev,
      hook: "buildStart",
      runOnce: isDev,
    }),
    !isDev && terser(),

    resolvePlugin({
      preferBuiltins: false,
      resolveOnly: external,
    }),
  ],
});
