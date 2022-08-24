import { writeFileSync } from "fs-extra";
import { join } from "path";
import { calculateReferences } from "../tools/calculate-references";
import { configDefaults } from "../tools/defaults";
import {
  gitignoreTemplate,
  npmignoreTemplate,
} from "../tools/ignore-templates";
import { processPackageJson } from "../tools/process-package-json";
import { getVersionConfig } from "../tools/version-config";
import { WorkspacesMap } from "../tools/workspaces/workspaces-map";
import { writeTsconfig, writePackageJson } from "../tools/write";
import { buildAProject } from "./build-a-project";

export const projectBuild = async (
  workspaces: WorkspacesMap,
  isDev: boolean
) => {
  const versionJson = getVersionConfig();
  const root = workspaces.getRoot();
  if (root.projMan.repoType === "single") {
    const gitIgnorePath = join(process.cwd(), ".gitignore");
    const npmIgnorePath = join(process.cwd(), ".npmignore");
    let gitIgnore = gitignoreTemplate;

    let propsBuildDir = "";
    let propsDeclarationDir = "";
    let propsTemp = "";
    let srcDec = "";
    const {
      buildDir,
      entries,
      declarationDir,
      workspaceType,
      repoType,
      framework,
      extraInclude,
      packageName,
      entriesDir,
      typeSource,
      deploy,
      npmIgnore: npmIgnoreProp,
      gitIgnore: gitIgnoreProp,
    } = root.projMan;
    const workspace = workspaces.getRoot();

    const npmignore = `${npmignoreTemplate}\n${
      versionJson.name
    }.ts\n${entriesDir}\n${join(
      entriesDir || configDefaults.entriesDir,
      typeSource || configDefaults.typeSource
    )}\n${npmIgnoreProp}`;
    if (workspace.rootDirName) {
      propsBuildDir = `${propsBuildDir}\n${join(
        workspace?.rootDirName,
        workspace?.dirName,
        buildDir || configDefaults.buildDir
      )}`;
      propsDeclarationDir = `${propsDeclarationDir}\n${join(
        workspace?.rootDirName,
        workspace?.dirName,
        declarationDir || configDefaults.declarationDir
      )}`;
      srcDec = `${srcDec}\n!${join(
        workspace?.rootDirName,
        workspace?.dirName,
        entriesDir || configDefaults.entriesDir,
        typeSource || configDefaults.typeSource
      )}`;
    }
    propsTemp = `${propsTemp}\nnode_modules/.cache/${versionJson.name}/${workspace.dirName}/${workspace.dirName}.temp.json`;
    if (deploy) {
      writeFileSync(npmIgnorePath, npmignore.replace(/\\/g, "/"));
    }
    gitIgnore = `${gitIgnore}\n${propsBuildDir}\n${propsDeclarationDir}\n${srcDec}\n${propsTemp}\n${gitIgnoreProp}`;
    writeFileSync(gitIgnorePath, gitIgnore.replace(/\\/g, "/"));
    await buildAProject({
      buildDir,
      declarationDir,
      entries,
      workspaceType,
      entriesDir,
      extraInclude,
      framework,
      packageName,
      projMan: root.projMan,
      repoType,
      isDev,
      workspaces,
    });
  } else {
    const { projMan } = root;
    if (projMan.root) {
      const gitIgnorePath = join(root.location, ".gitignore");
      let gitIgnore = gitignoreTemplate;
      const { name, packageJson, tsconfig = {} } = root;
      //     //mono repo
      // root packageJson
      packageJson.name = "root";
      packageJson.private = true;
      // root tsconfig
      const rootRefs = calculateReferences(name, workspaces);

      tsconfig.desplay = "root";
      tsconfig.references = rootRefs;

      await writeTsconfig(tsconfig, process.cwd());

      await writePackageJson(
        processPackageJson({
          packageJson: packageJson,
          repoType: "monoRepo",
          appsRootDir: projMan.appsRootDir,
          packagesRootDir: projMan.packagesRootDir,
          extraWorkspaces: projMan.extraWorkspaces,
          root: true,
        }),
        process.cwd()
      );
      let propsBuildDir = "";
      let propsDeclarationDir = "";
      let propsTemp = "";
      let srcDec = "";
      let gitIgnoreProp = "";
      for (const workspace of workspaces.workspacesList) {
        const npmIgnorePath = join(workspace.location, ".npmignore");
        const { projMan, location } = workspace;
        if (projMan.repoType === "monoRepo" && !projMan.root) {
          // projMan.repoType === "monoRepo" &&
          //   !projMan.root &&

          const {
            framework,
            packageName,
            repoType,
            workspaceType,
            buildDir,
            declarationDir,
            entries,
            entriesDir,
            extraInclude,
            deploy,
            gitIgnore: gip,
            npmIgnore: npmIgnoreProp,
            typeSource,
          } = projMan;
          gitIgnoreProp = gip || "";
          const npmignore = `${npmignoreTemplate}\n${
            versionJson.name
          }.ts\n${entriesDir}\n${join(
            entriesDir || configDefaults.entriesDir,
            typeSource || configDefaults.typeSource
          )}\n${npmIgnoreProp}`;
          if (workspace.rootDirName) {
            propsBuildDir = `${propsBuildDir}\n${join(
              workspace?.rootDirName,
              workspace?.dirName,
              buildDir || configDefaults.buildDir
            )}`;
            propsDeclarationDir = `${propsDeclarationDir}\n${join(
              workspace?.rootDirName,
              workspace?.dirName,
              declarationDir || configDefaults.declarationDir
            )}`;
            srcDec = `${srcDec}\n!${join(
              workspace?.rootDirName,
              workspace?.dirName,
              entriesDir || configDefaults.entriesDir,
              typeSource || configDefaults.typeSource
            )}`;
          }
          propsTemp = `${propsTemp}\nnode_modules/.cache/${versionJson.name}/${workspace.dirName}/${workspace.dirName}.temp.json`;
          if (deploy) {
            writeFileSync(npmIgnorePath, npmignore.replace(/\\/g, "/"));
          }
          await buildAProject({
            buildDir,
            declarationDir,
            entries,
            workspaceType,
            entriesDir,
            extraInclude,
            framework,
            packageName,
            projMan,
            repoType,
            path: location,
            isDev,
            workspaces,
          });
        }
      }
      gitIgnore = `${gitIgnore}\n${propsBuildDir}\n${propsDeclarationDir}\n${srcDec}\n${propsTemp}\n${gitIgnoreProp}`;
      writeFileSync(gitIgnorePath, gitIgnore.replace(/\\/g, "/"));
    }
  }
};
