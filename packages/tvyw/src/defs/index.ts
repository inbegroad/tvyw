import { ScriptsEnumType } from "../types/from-schema";

const appScripts: Record<string, string> = {
  dev: "vite",
  build: "vite build",
  preview: "vite preview",
};
const packageScripts: Record<string, string> = {
  build:
    'yarn tsc --build --clean && concurrently "yarn vite build" "yarn tsc"',
  dev: 'yarn tsc --build --clean && concurrently "yarn vite build --mode development" "yarn tsc -w"',
};

export const scriptsEnum: ScriptsEnumType = {
  custom: {},
  express: {
    package: packageScripts,
  },
  preact: {
    app: appScripts,
    package: packageScripts,
  },
  react: {
    app: appScripts,
    package: packageScripts,
  },
  svelte: {
    app: appScripts,
    package: packageScripts,
  },

  vanilla: {
    app: appScripts,
    package: packageScripts,
  },
  vue: {
    app: appScripts,
    package: packageScripts,
  },
};
