import {
  FrameworksType,
  ScriptsEnumType,
  ScriptsType,
  WorkspaceType,
} from "../types/from-schema";

const appScripts: ScriptsType = {
  dev: "vite",
  build: "vite build",
  preview: "vite preview",
  // lint: "echo lint is not implemented",
  // start: "echo start is not implemented",
  scaf: "echo scaf is not implemented",
  test: "echo test is not implemented",
};
const packageScripts: ScriptsEnumType[FrameworksType][WorkspaceType] = {
  build: 'concurrently -n bundle,types -s all "vite build" "tsc"',
  dev: 'concurrently -n bundle,types "vite build --mode development" "tsc -w"',
  // lint: "echo lint is not implemented",
  preview: "echo preview is not implemented",
  // start: "echo start is not implemented",
  scaf: "echo scaf is not implemented",
  test: "echo test is not implemented",
};

export const scriptsEnum: ScriptsEnumType = {
  custom: {
    app: {
      build: "echo build is not implemented",
      dev: "echo dev is not implemented",
      // start: "echo start is not implemented",
      // lint: "echo lint is not implemented",
      preview: "echo preview is not implemented",
      scaf: "echo scaf is not implemented",
      test: "echo test is not implemented",
    },
    package: {
      build: "echo build is not implemented",
      dev: "echo dev is not implemented",
      // lint: "echo lint is not implemented",
      preview: "echo preview is not implemented",
      // start: "echo start is not implemented",
      scaf: "echo scaf is not implemented",
      test: "echo test is not implemented",
    },
  },
  // express: {
  //   app: appScripts,
  //   package: packageScripts,
  // },
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
