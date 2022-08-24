import { removeSync } from "fs-extra";
import { join } from "path";
import { projManCmdEnum } from "../schemas";
import { calculateExcludes } from "../tools/calculate-excludes";
import { calculateIncludes } from "../tools/calculate-includes";
import { calculateReferences } from "../tools/calculate-references";
import { configDefaults } from "../tools/defaults";
import { getPackageJsonFiles } from "../tools/ge-pkgjson-files";
import { processPackageJson } from "../tools/process-package-json";
import { getVersionConfig } from "../tools/version-config";
import { WorkspacesMap } from "../tools/workspaces/workspaces-map";
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
    projMan: Required<ProjManType>;
    extraInclude?: string[];
    entriesDir?: string;
    repoType: RepoType;
    framework: FrameworksType;
    path?: string;
    workspaces: WorkspacesMap;
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
  const { dev, name: coreName } = getVersionConfig();
  const workspace =
    repoType === "monoRepo"
      ? workspaces.findByName(packageName)
      : workspaces.getRoot();

  if (workspace !== undefined) {
    const { packageJson, tsconfig = {}, name } = workspace;

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
    if (dev) {
      delete packageJson.scripts?.[coreName];
      for (const scr of projManCmdEnum) {
        delete packageJson.scripts?.[scr];
      }
    }

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
      tsconfig.references = calculateReferences(name, workspaces);
      tsconfig.desplay = projMan.packageName;
      tsconfig.exclude = calculateExcludes(projMan);
      tsconfig.include = calculateIncludes(projMan);

      await writeTsconfig(
        {
          ...tsconfig,
          include: [
            ...(tsconfig.include || []),
            entriesDir || configDefaults.entriesDir,
          ],
          compilerOptions: {
            ...tsconfig.compilerOptions,
            resolveJsonModule: true,
            // moduleResolution: "Node",
            // module:
            //   framework === "express"
            //     ? "CommonJS"
            //     : tsconfig.compilerOptions?.module,
            // esModuleInterop:
            //   framework === "express"
            //     ? true
            //     : tsconfig.compilerOptions?.esModuleInterop,
            noEmit: workspaceType === "app" ? true : undefined,
            emitDeclarationOnly: workspaceType === "package" ? true : undefined,
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

      if (projMan.workspaceType === "package") {
        if (!isDev)
          removeSync(join(workspace.location, "tsconfig.tsbuildinfo"));
      }
    }
  }
};
