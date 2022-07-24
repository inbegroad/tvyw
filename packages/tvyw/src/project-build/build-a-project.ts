import { calculateExcludes } from "../tools/calculate-excludes";
import { calculateIncludes } from "../tools/calculate-includes";
import { calculateReferences } from "../tools/calculate-references";
import { getPackageJsonFiles } from "../tools/ge-pkgjson-files";
import { processPackageJson } from "../tools/process-package-json";
import {
  findWorkspaceByName,
  getWorkspacesList,
  isWorkspaceDep,
  WorkspacesListType,
} from "../tools/workspaces-list";
import { writePackageJson, writeTsconfig } from "../tools/write";
import { ProjManType } from "../types";
import { WorkspaceType, RepoType, FrameworksType } from "../types/from-schema";
import { CallBack } from "../types/generics";

export type BuildAProjectType = CallBack<
  {
    workspaceType: WorkspaceType;
    buildDir?: string;
    entries?: string;
    declarationDir?: string;
    packageName: string;
    projMan: ProjManType;
    extraInclude?: string[];
    entriesDir?: string;
    repoType: RepoType;
    framework: FrameworksType;
    path?: string;
    workspaces?: WorkspacesListType;
    isDev: boolean;
  },
  Promise<void>
>;

export const buildAProject: BuildAProjectType = async ({
  buildDir,
  entriesDir,
  framework,
  repoType,
  packageName,
  projMan,
  workspaceType,
  declarationDir,
  path = process.cwd(),
  entries,
  workspaces,
  isDev,
}) => {
  // packageJson
  const wss = workspaces || getWorkspacesList(true);
  const found = findWorkspaceByName(packageName, wss);
  if (found !== undefined) {
    const { packageJson, tsconfig = {} } = found;
    if (projMan.repoType === "monoRepo" && !projMan.root) {
      const tempDeps = packageJson.dependencies || {};
      const haveDeps = isWorkspaceDep(packageJson.dependencies, wss);

      for (const dep of haveDeps) {
        const found = findWorkspaceByName(dep, wss);
        if (found !== undefined)
          tempDeps[dep] = isDev
            ? "workspace:^"
            : found.packageJson.version || "0.0.0";
      }
      packageJson.dependencies = tempDeps;
    }
    const { exports, main, module, types } = getPackageJsonFiles({
      buildDir: buildDir || "build",
      declarationDir: declarationDir || "types",
      entries: entries || "index",
      framework,
      workspaceType,
      exports: packageJson.exports,
      main: packageJson.main,
      module: packageJson.module,
      types: packageJson.types,
    });
    packageJson.name = packageName;

    const newPackageJson = processPackageJson({
      packageJson: {
        ...packageJson,
        exports,
        main,
        module,
        types,
        private: workspaceType === "app" ? true : packageJson.private,
      },
      repoType,
      framework,
      root: false,
      workspaceType,
    });

    await writePackageJson(newPackageJson, path);
    // tsconfig
    if (
      ((projMan.repoType === "monoRepo" && !projMan.root) ||
        projMan.repoType === "single") &&
      !projMan.disableTypescript
    ) {
      // tsconfig

      if (framework === "svelte") {
        tsconfig.extends = "@tsconfig/svelte/tsconfig.json";
      }

      tsconfig.references = calculateReferences(projMan, wss);
      tsconfig.exclude = calculateExcludes(projMan);
      tsconfig.include = calculateIncludes(projMan);

      await writeTsconfig(
        {
          ...tsconfig,
          compilerOptions: {
            ...tsconfig.compilerOptions,
            module:
              framework === "express"
                ? "CommonJS"
                : tsconfig.compilerOptions?.module,
            esModuleInterop:
              framework === "express"
                ? true
                : tsconfig.compilerOptions?.esModuleInterop,
            emitDeclarationOnly:
              framework === "preact"
                ? tsconfig.compilerOptions?.emitDeclarationOnly
                : true,
            composite:
              repoType === "monoRepo"
                ? true
                : tsconfig.compilerOptions?.composite,
            declaration:
              workspaceType === "package"
                ? true
                : tsconfig.compilerOptions?.declaration,
            rootDir: `./${entriesDir}`,
            outDir: `./${buildDir}`,
            declarationDir: `./${declarationDir}`,
            // jsx: workspaceType === "app" ? "react-jsx" : "preserve",
          },
        },
        path
      );
    }
  }
};