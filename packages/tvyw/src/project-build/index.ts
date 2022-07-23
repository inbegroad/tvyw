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
import { getWorkspacesList } from "../tools/workspaces-list";
import { writeTsconfig, writePackageJson } from "../tools/write";
import { buildAProject } from "./build-a-project";

export const projectBuild = async (isDev: boolean) => {
  const workspaces = getWorkspacesList();
  const versionJson = getVersionConfig();
  const { projMan, packageJson, tsconfig = {} } = workspaces.root;

  if (projMan.repoType === "monoRepo") {
    const gitIgnorePath = join(workspaces.root.fullPath, ".gitignore");
    let gitIgnore = gitignoreTemplate;

    if (projMan.root) {
      //     //mono repo
      // root packageJson
      packageJson.name = "root";
      packageJson.private = true;
      // root tsconfig
      tsconfig.references = calculateReferences(projMan, workspaces);
      tsconfig.files = [];

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
      for (const workspace of workspaces.workspaces) {
        const npmIgnorePath = join(workspace.fullPath, ".npmignore");
        const { projMan, fullPath } = workspace;
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
            path: fullPath,
            isDev,
            workspaces,
          });
        }
      }
      gitIgnore = `${gitIgnore}\n${propsBuildDir}\n${propsDeclarationDir}\n${srcDec}\n${propsTemp}\n${gitIgnoreProp}`;
      writeFileSync(gitIgnorePath, gitIgnore.replace(/\\/g, "/"));
    }
  } else {
    //single repo
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
    } = projMan;
    const workspace = workspaces.root;

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
      projMan,
      repoType,
      isDev,
      workspaces,
    });
  }
};
