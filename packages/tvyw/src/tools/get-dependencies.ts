import { PackageJsonType } from "../types";
import { FrameworksType } from "../types/from-schema";
import { getVersionConfig } from "./version-config";
import { versions } from "./versions";

type Props = {
  isMono: boolean;
  framework?: FrameworksType;
} & Pick<
  PackageJsonType,
  | "dependencies"
  | "devDependencies"
  | "peerDependencies"
  | "peerDependenciesMeta"
  | "bundleDependencies"
  | "optionalDependencies"
  | "bundledDependencies"
>;

export const getDependencies = ({
  framework,
  isMono,
  ...props
}: Props): Pick<
  PackageJsonType,
  | "dependencies"
  | "devDependencies"
  | "peerDependencies"
  | "peerDependenciesMeta"
  | "bundleDependencies"
  | "optionalDependencies"
  | "bundledDependencies"
> => {
  const { name, version: orVersion, dev, source } = getVersionConfig();
  const newVersion = dev ? `${source}${name}/packages/${name}` : orVersion;
  // const names =
  const version = dev
    ? isMono
      ? `../../../${name}/packages/${name}`
      : newVersion
    : orVersion;
  const forMonoRoot = { [name]: newVersion };
  const forFws = { [name]: version, concurrently: versions["concurrently"] };
  switch (framework) {
    case "express":
      return {
        ...props,
        dependencies: {
          ...props.dependencies,
          express: versions["express"],
        },
        devDependencies: {
          ...props.devDependencies,
          ...forFws,
          "@swc/core": versions["@swc/core"],
          "@types/express": versions["@types/express"],
          "@types/node": versions["@types/node"],
          tslib: versions["tslib"],
          "ts-node": versions["ts-node"],
          "@typescript-eslint/eslint-plugin":
            versions["@typescript-eslint/eslint-plugin"],
          "@typescript-eslint/parser": versions["@typescript-eslint/parser"],
          eslint: versions["eslint"],
          "eslint-config-prettier": versions["eslint-config-prettier"],
          prettier: versions["prettier"],
          "ts-node-dev": versions["ts-node-dev"],
          typescript: versions["typescript"],
          vite: versions["vite"],
        },
      };
    case "preact":
      return {
        ...props,
        dependencies: {
          ...props.dependencies,
          preact: versions["preact"],
        },
        devDependencies: {
          ...props.devDependencies,
          "@preact/preset-vite": versions["@preact/preset-vite"],
          "@types/node": versions["@types/node"],
          ...forFws,
          typescript: versions["typescript"],
          "eslint-config-preact": versions["eslint-config-preact"],
          vite: versions["vite"],
          "@typescript-eslint/eslint-plugin":
            versions["@typescript-eslint/eslint-plugin"],
          "@typescript-eslint/parser": versions["@typescript-eslint/parser"],
          eslint: versions["eslint"],
          "eslint-config-prettier": versions["eslint-config-prettier"],
          prettier: versions["prettier"],
        },
      };
    case "react":
      return {
        ...props,
        dependencies: {
          ...props.dependencies,
          react: versions["react"],
          "react-dom": versions["react-dom"],
        },
        devDependencies: {
          ...props.devDependencies,
          "@types/node": versions["@types/node"],
          "@types/react": versions["@types/react"],
          "@types/react-dom": versions["@types/react-dom"],
          "eslint-config-react-app": "7.0.1",
          ...forFws,
          typescript: versions["typescript"],
          vite: versions["vite"],
          "@typescript-eslint/eslint-plugin":
            versions["@typescript-eslint/eslint-plugin"],
          "@typescript-eslint/parser": versions["@typescript-eslint/parser"],
          eslint: versions["eslint"],
          "eslint-config-prettier": versions["eslint-config-prettier"],
          prettier: versions["prettier"],
          "@vitejs/plugin-react": versions["@vitejs/plugin-react"],
        },
        peerDependencies: {
          ...props.peerDependencies,
          react: versions["react"],
          "react-dom": versions["react-dom"],
        },
      };
    case "svelte":
      return {
        ...props,
        devDependencies: {
          ...props.devDependencies,
          "@sveltejs/vite-plugin-svelte":
            versions["@sveltejs/vite-plugin-svelte"],
          "@tsconfig/svelte": versions["@tsconfig/svelte"],
          "@types/node": versions["@types/node"],
          ...forFws,
          svelte: versions["svelte"],
          "eslint-plugin-svelte3": versions["eslint-plugin-svelte3"],
          "svelte-check": versions["svelte-check"],
          "svelte-preprocess": versions["svelte-preprocess"],
          tslib: versions["tslib"],
          typescript: versions["typescript"],
          vite: versions["vite"],
          "@typescript-eslint/eslint-plugin":
            versions["@typescript-eslint/eslint-plugin"],
          "@typescript-eslint/parser": versions["@typescript-eslint/parser"],
          eslint: versions["eslint"],
          "eslint-config-prettier": versions["eslint-config-prettier"],
          prettier: versions["prettier"],
        },
      };
    case "vanilla":
      return {
        ...props,
        devDependencies: {
          ...props.devDependencies,
          "@types/node": versions["@types/node"],
          ...forFws,
          typescript: versions["typescript"],
          vite: versions["vite"],
          "@typescript-eslint/eslint-plugin":
            versions["@typescript-eslint/eslint-plugin"],
          "@typescript-eslint/parser": versions["@typescript-eslint/parser"],
          eslint: versions["eslint"],
          "eslint-config-prettier": versions["eslint-config-prettier"],
          prettier: versions["prettier"],
        },
      };
    case "vue":
      return {
        ...props,
        dependencies: {
          ...props.dependencies,
          vue: versions["vue"],
        },
        devDependencies: {
          ...props.devDependencies,
          "@types/node": versions["@types/node"],
          "@vitejs/plugin-vue": versions["@vitejs/plugin-vue"],
          "eslint-plugin-vue": "9.2.0",
          ...forFws,
          typescript: versions["typescript"],
          vite: versions["vite"],
          "vue-tsc": versions["vue-tsc"],
          "@typescript-eslint/eslint-plugin":
            versions["@typescript-eslint/eslint-plugin"],
          "@typescript-eslint/parser": versions["@typescript-eslint/parser"],
          eslint: versions["eslint"],
          "eslint-config-prettier": versions["eslint-config-prettier"],
          prettier: versions["prettier"],
        },
      };
    case "custom":
      return {
        ...props,
        devDependencies: {
          ...props.devDependencies,
          "@typescript-eslint/eslint-plugin":
            versions["@typescript-eslint/eslint-plugin"],
          "@typescript-eslint/parser": versions["@typescript-eslint/parser"],
          eslint: versions["eslint"],
          "eslint-config-prettier": versions["eslint-config-prettier"],
          prettier: versions["prettier"],
        },
      };
    default:
      return {
        ...props,
        dependencies: {
          ...props.dependencies,
          ...forMonoRoot,
          turbo: versions["turbo"],
          typescript: versions["typescript"],
        },
      };
  }
};
