import { ProjManType } from "../types";
import { configDefaults } from "./defaults";

const returnConfig = (config: ProjManType): Required<ProjManType> =>
  config.repoType === "monoRepo"
    ? config.root
      ? {
          repoType: "monoRepo",
          root: true,
          appsRootDir: config.appsRootDir || configDefaults.appsRootDir,
          packagesRootDir:
            config.packagesRootDir || configDefaults.packagesRootDir,
          extraWorkspaces:
            config.extraWorkspaces || configDefaults.extraWorkspaces,
        }
      : {
          repoType: config.repoType,
          root: false,
          buildDir: config.buildDir || configDefaults.buildDir,
          declarationDir:
            config.declarationDir || configDefaults.declarationDir,
          deploy: config.deploy || false,
          disableTypescript: config.disableTypescript || false,
          entries: config.entries || configDefaults.entries,
          entriesDir: config.entriesDir || configDefaults.entriesDir,
          extraExclude: config.extraExclude || [],
          extraInclude: config.extraInclude || [],
          extraReferences: config.extraReferences || [],
          framework: config.framework,
          packageName: config.packageName,
          testsDir: config.testsDir || configDefaults.testsDir,
          workspaceType: config.workspaceType || configDefaults.workspaceType,
          typeSource: config.typeSource || configDefaults.typeSource,
          gitIgnore: config.gitIgnore || configDefaults.gitIgnore,
          npmIgnore: config.npmIgnore || configDefaults.npmIgnore,
          fullPath: "",
          location: "",
        }
    : {
        repoType: "single",
        root: true,
        buildDir: config.buildDir || configDefaults.buildDir,
        declarationDir: config.declarationDir || configDefaults.declarationDir,
        deploy: config.deploy || false,
        disableTypescript: config.disableTypescript || false,
        entries: config.entries || configDefaults.entries,
        entriesDir: config.entriesDir || configDefaults.entriesDir,
        extraExclude: config.extraExclude || [],
        extraInclude: config.extraInclude || [],
        extraReferences: config.extraReferences || [],
        framework: config.framework,
        packageName: config.packageName,
        testsDir: config.testsDir || configDefaults.testsDir,
        workspaceType: config.workspaceType || configDefaults.workspaceType,
        typeSource: config.typeSource || configDefaults.typeSource,
        gitIgnore: config.gitIgnore || configDefaults.gitIgnore,
        npmIgnore: config.npmIgnore || configDefaults.npmIgnore,
        fullPath: "",
        location: "",
      };

export const defineConfig = (config: ProjManType): Required<ProjManType> =>
  returnConfig(config);
