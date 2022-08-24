import path from "path";
import fsExtra from "fs-extra";
import yarn from "@yarnpkg/shell";
import { copyProject } from "../tools/copy-project";
import { createProjMan } from "../tools/create-proj-man";
import { writePackageJson } from "../tools/write";
import { askAddWorkspaceQuestions } from "./askQuestions";
import { configDefaults } from "../tools/defaults";
import { processPackageJson } from "../tools/process-package-json";
import { getPackageManagerVersion } from "../tools/package-manager-version";
import { AddWorkspaceActionType } from "../types/actions";
import { questionsMonoList } from "../tools/questions";
import { WorkspacesMap } from "../tools/workspaces/workspaces-map";

export const addWorkspace: AddWorkspaceActionType = async (
  packageName,
  props
) => {
  const {
    framework,
    workspaceType,
    packageName: pkgName,
    dirName,
    //  workspaceStructure
  } = await askAddWorkspaceQuestions(packageName, props);
  const workspaces = new WorkspacesMap();
  const root = workspaces.getRoot();
  if (!workspaces.isAvailableName(pkgName))
    throw new Error("Workspace name is taken");

  if (root.projMan.repoType === "monoRepo" && root.projMan.root) {
    const {
      appsRootDir = configDefaults.appsRootDir,
      packagesRootDir = configDefaults.packagesRootDir,
    } = root.projMan;
    const workspacesDir =
      workspaceType === "app" ? appsRootDir : packagesRootDir;
    const projectPath = path.join("./", workspacesDir, dirName);

    await fsExtra.ensureDir(projectPath);
    await copyProject({
      repoType: "monoRepo",
      root: projectPath,
      framework,
      isRoot: false,
      workspaceType,
    });

    await writePackageJson(
      processPackageJson({
        repoType: root.projMan.repoType,
        root: false,
        workspaceType,
        framework,
        packageJson: {
          name: pkgName,
          license: "MIT",
          packageManager: getPackageManagerVersion(),
        },
      }),
      projectPath
    );
    createProjMan({
      packageName: pkgName,
      repoType: "monoRepo",
      src: projectPath,
      root: false,
      projMan: {
        // workspaceStructure,
        workspaceType,
        framework,
      },
    });

    const linkedWorkspaces = await questionsMonoList.linkWorkspaces(
      pkgName,
      workspaces
    );

    if (linkedWorkspaces.length === 0) await yarn.execute("yarn");
    else {
      for (const ws of linkedWorkspaces) {
        await yarn.execute(`yarn workspace ${pkgName} add ${ws}`);
      }
    }
  } else
    throw new Error(`The path ${process.cwd()} is not the root of monoRepo`);
};
